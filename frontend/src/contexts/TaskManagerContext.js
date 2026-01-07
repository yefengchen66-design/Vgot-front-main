import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { api } from '../services/apiClient';
import historyService from '../services/historyService';

/**
 * Task shape
 * {
 *   id: string           // local id
 *   apiTaskId: string    // task id from backend
 *   page: 'text'|'image'|'enhance'
 *   prompt: string
 *   params: object
 *   status: 'queued'|'running'|'success'|'failed'|'canceled'
 *   progress: number
 *   createdAt: number
 *   resultUrl?: string    // external result url
 *   supabaseUrl?: string  // finalized url stored in supabase
 *   errorMsg?: string
 * }
 */

// Per-page concurrency caps
const PAGE_LIMITS = { text: 5, image: 5, enhance: 3, superip: 3 };
const MAX_TOTAL = 10;
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_MS = 2 * 60 * 60 * 1000; // 2 hours

const STORAGE_KEY = 'vgot:task-manager:v1';
const STORAGE_LAST_CLEAR_KEY = 'vgot:task-manager:lastClearDate';

const baseInitialState = {
  textTasks: [],
  imageTasks: [],
  enhanceTasks: [],
  superipTasks: [],
  pendingQueue: { text: [], image: [], enhance: [], superip: [] },
  activeCountByPage: { text: 0, image: 0, enhance: 0, superip: 0 },
  totalActiveCount: 0,
};

function computeCounters(state) {
  const textRunning = (state.textTasks || []).filter(t => t.status === 'running').length;
  const imageRunning = (state.imageTasks || []).filter(t => t.status === 'running').length;
  const enhanceRunning = (state.enhanceTasks || []).filter(t => t.status === 'running').length;
  const superipRunning = (state.superipTasks || []).filter(t => t.status === 'running').length;
  return {
    ...state,
    pendingQueue: { text: [], image: [], enhance: [], superip: [] },
    activeCountByPage: { text: textRunning, image: imageRunning, enhance: enhanceRunning, superip: superipRunning },
    totalActiveCount: textRunning + imageRunning + enhanceRunning + superipRunning,
  };
}

function getInitialState() {
  try {
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const sanitized = {
          textTasks: Array.isArray(data?.textTasks) ? data.textTasks : [],
          imageTasks: Array.isArray(data?.imageTasks) ? data.imageTasks : [],
          enhanceTasks: Array.isArray(data?.enhanceTasks) ? data.enhanceTasks : [],
          superipTasks: Array.isArray(data?.superipTasks) ? data.superipTasks : [],
        };
        return computeCounters({ ...baseInitialState, ...sanitized });
      }
    }
  } catch {}
  return { ...baseInitialState };
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      return computeCounters({
        ...state,
        textTasks: action.payload?.textTasks || [],
        imageTasks: action.payload?.imageTasks || [],
        enhanceTasks: action.payload?.enhanceTasks || [],
        superipTasks: action.payload?.superipTasks || [],
      });
    }
    case 'ADD_TASK': {
  const listKey = action.task.page === 'text' ? 'textTasks' : (action.task.page === 'image' ? 'imageTasks' : (action.task.page === 'enhance' ? 'enhanceTasks' : 'superipTasks'));
      const list = state[listKey];
      const updated = [...list, action.task];
      const activeInc = action.task.status === 'running' ? 1 : 0;
      return {
        ...state,
        [listKey]: updated,
        activeCountByPage: {
          ...state.activeCountByPage,
          [action.task.page]: state.activeCountByPage[action.task.page] + activeInc,
        },
        totalActiveCount: state.totalActiveCount + activeInc,
      };
    }
    case 'UPDATE_TASK': {
  const listKey = action.page === 'text' ? 'textTasks' : (action.page === 'image' ? 'imageTasks' : (action.page === 'enhance' ? 'enhanceTasks' : 'superipTasks'));
      const updated = state[listKey].map(t => t.id === action.id ? { ...t, ...action.patch } : t);
      return { ...state, [listKey]: updated };
    }
    case 'END_TASK': {
  const { page, id, status, errorMsg } = action;
  const listKey = page === 'text' ? 'textTasks' : (page === 'image' ? 'imageTasks' : (page === 'enhance' ? 'enhanceTasks' : 'superipTasks'));
      const updated = state[listKey].map(t => t.id === id ? { ...t, status, errorMsg } : t);
      // reduce counters if we ended from running state
      const wasRunning = state[listKey].find(t => t.id === id)?.status === 'running';
      return {
        ...state,
        [listKey]: updated,
        activeCountByPage: wasRunning ? { ...state.activeCountByPage, [page]: Math.max(0, state.activeCountByPage[page] - 1) } : state.activeCountByPage,
        totalActiveCount: wasRunning ? Math.max(0, state.totalActiveCount - 1) : state.totalActiveCount,
      };
    }
    case 'ENQUEUE': {
  const pq = { ...state.pendingQueue };
  pq[action.page] = [...(pq[action.page] || []), action.payload];
      return { ...state, pendingQueue: pq };
    }
    case 'DEQUEUE': {
  const pq = { ...state.pendingQueue };
  pq[action.page] = (pq[action.page] || []).slice(1);
      return { ...state, pendingQueue: pq };
    }
    case 'REMOVE_TASK': {
  const listKey = action.page === 'text' ? 'textTasks' : (action.page === 'image' ? 'imageTasks' : (action.page === 'enhance' ? 'enhanceTasks' : 'superipTasks'));
      const target = state[listKey].find(t => t.id === action.id);
      const updated = state[listKey].filter(t => t.id !== action.id);
      const wasRunning = target?.status === 'running';
      return {
        ...state,
        [listKey]: updated,
        activeCountByPage: wasRunning
          ? { ...state.activeCountByPage, [action.page]: Math.max(0, state.activeCountByPage[action.page] - 1) }
          : state.activeCountByPage,
        totalActiveCount: wasRunning ? Math.max(0, state.totalActiveCount - 1) : state.totalActiveCount,
      };
    }
    case 'CLEAR_RESULT_CARDS': {
      // UI-only cleanup: clear all generated result cards from all pages.
      // Does NOT delete Supabase files or backend DB records.
      return computeCounters({
        ...state,
        textTasks: [],
        imageTasks: [],
        enhanceTasks: [],
        superipTasks: [],
      });
    }
    default:
      return state;
  }
}

const TaskManagerContext = createContext(null);

export function TaskManagerProvider({ children }) {
  // Lazy init from localStorage so reload后任务不丢失
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  const timersRef = useRef(new Map()); // id -> { intervalId, startAt }

  const canStartTask = useCallback((page) => {
    const pageLimit = PAGE_LIMITS[page] ?? 5;
    return state.activeCountByPage[page] < pageLimit && state.totalActiveCount < MAX_TOTAL;
  }, [state.activeCountByPage, state.totalActiveCount]);

  const internalAddTask = useCallback((task) => {
    dispatch({ type: 'ADD_TASK', task });
  }, []);

  const updateTask = useCallback((page, id, patch) => {
    dispatch({ type: 'UPDATE_TASK', page, id, patch });
  }, []);

  const endTask = useCallback((page, id, status, errorMsg) => {
    dispatch({ type: 'END_TASK', page, id, status, errorMsg });
    // Do not call startTask here to avoid initialization order issues; queue draining handled in useEffect below.
  }, []);

  const tryStartNextFromQueue = useCallback(async (page) => {
    if (!canStartTask(page)) return;
    const queue = state.pendingQueue[page] || [];
    if (!queue.length) return;
    const next = queue[0];
    dispatch({ type: 'DEQUEUE', page });
    // Use timers to avoid referencing startTask before its initialization
    setTimeout(() => {
      // startTask is defined below; this timeout runs after render phase
      // eslint-disable-next-line no-unused-expressions
      startTask && startTask({ ...next, enqueueOnLimit: false }).catch(() => {});
    }, 0);
  }, [canStartTask, state.pendingQueue]);

  // Drain queues when counters change and slots become available
  useEffect(() => {
    ['text', 'image', 'enhance', 'superip'].forEach((p) => {
      if (canStartTask(p)) {
        tryStartNextFromQueue(p);
      }
    });
  }, [state.activeCountByPage, state.totalActiveCount, canStartTask, tryStartNextFromQueue]);

  // Persist to localStorage whenever task lists change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const toStore = {
          textTasks: state.textTasks,
          imageTasks: state.imageTasks,
          enhanceTasks: state.enhanceTasks,
          superipTasks: state.superipTasks,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      }
    } catch {}
  }, [state.textTasks, state.imageTasks, state.enhanceTasks, state.superipTasks]);

  // On mount: if last clear date is before today, immediately clear UI cards (no backend deletions)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const last = window.localStorage.getItem(STORAGE_LAST_CLEAR_KEY);
        if (last !== todayStr) {
          // Clear UI result cards only
          dispatch({ type: 'CLEAR_RESULT_CARDS' });
          window.localStorage.setItem(STORAGE_LAST_CLEAR_KEY, todayStr);
        }
      }
    } catch {}
  }, []);

  // Daily midnight cleanup: clear UI result cards only (no backend deletions)
  useEffect(() => {
    function msUntilNextMidnight() {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0); // today 24:00 => next day's 00:00
      return next.getTime() - now.getTime();
    }

    let timeoutId;
    function scheduleNext() {
      const delay = msUntilNextMidnight();
      timeoutId = setTimeout(() => {
        // Clear UI result cards for both pages
        dispatch({ type: 'CLEAR_RESULT_CARDS' });
        // Record last clear date as today
        try {
          if (typeof window !== 'undefined') {
            const todayStr = new Date().toISOString().slice(0, 10);
            window.localStorage.setItem(STORAGE_LAST_CLEAR_KEY, todayStr);
          }
        } catch {}
        // re-schedule for the following midnight
        scheduleNext();
      }, Math.max(1000, delay));
    }

    scheduleNext();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Rehydrate polling for running tasks after reload
  useEffect(() => {
    const running = [
      ...state.textTasks.filter(t => t.status === 'running' && t.apiTaskId),
      ...state.imageTasks.filter(t => t.status === 'running' && t.apiTaskId),
      ...state.enhanceTasks.filter(t => t.status === 'running' && t.apiTaskId),
      ...state.superipTasks.filter(t => t.status === 'running' && t.apiTaskId),
    ];
    running.forEach(t => {
      if (!timersRef.current.has(t.id)) startPolling(t);
    });
    // no cleanup needed; polling lifecycle managed per-task
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start polling a single task
  const startPolling = useCallback((task) => {
    const key = task.id;
    if (timersRef.current.has(key)) return; // already polling
    const startAt = Date.now();

    const poll = async () => {
      try {
        // Poll by page type
        const pollPath = task.page === 'text'
          ? `/api/sora/poll/${task.apiTaskId}`
          : (task.page === 'image'
            ? `/api/sora/watermark-free/${task.apiTaskId}`
            : (task.page === 'enhance'
              ? `/api/enhance/outputs/${task.apiTaskId}`
              : `/api/superip/outputs/${task.apiTaskId}`));
  const res = await api.get(pollPath);
        const data = res?.data || {};
        const status = ((data.status || data.state || '')).toLowerCase();
        // If backend already persisted and returned a Supabase URL, treat as success even if provider status is missing/unknown
        const persistedUrl = data.stored_url || data.supabase_url;
        // Robust progress extraction: support nested provider responses and string values
        const progressRaw = (
          data.progress !== undefined ? data.progress :
          (data.data && data.data.progress !== undefined ? data.data.progress :
            (data.result && data.result.progress !== undefined ? data.result.progress : undefined))
        );
        const progress = (typeof progressRaw === 'number')
          ? progressRaw
          : (typeof progressRaw === 'string' ? parseFloat(progressRaw) : undefined);
        const resultUrl = data.result_url || data.url || data.output || data.file_url || undefined;

        if (progress !== undefined) updateTask(task.page, task.id, { progress });

        if (!status && persistedUrl) {
          // Shortcut: finalize immediately based on stored_url
          const externalUrl = resultUrl || data.external_url || data.url || (data.results && data.results[0] && data.results[0].url);
          updateTask(task.page, task.id, { resultUrl: externalUrl || persistedUrl, supabaseUrl: persistedUrl });
          endTask(task.page, task.id, 'success');
          clearInterval(intervalId);
          timersRef.current.delete(key);
          return;
        }

        // Early failure: provider/agent may return an immediate violation message without a terminal status
        const msg = data?.error || data?.message || data?.detail || '';
        const msgStr = typeof msg === 'string' ? msg : String(msg || '');
        // Chinese responses may vary; match broader keywords
        const isCnSimilarity = (
          (msgStr.includes('第三方内容相似性')) ||
          (msgStr.includes('相似性') && msgStr.includes('第三方')) ||
          (msgStr.includes('违反') && msgStr.includes('相似性'))
        );
        const isEnSimilarity = (
          msgStr.toLowerCase().includes('content similarity') ||
          msgStr.toLowerCase().includes('similarity violation')
        );
        const isHttpError = (res?.status && res.status >= 400);
        const isSimilarityViolation = isCnSimilarity || isEnSimilarity;
        if (isSimilarityViolation) {
          endTask(task.page, task.id, 'failed', msgStr || '内容相似性校验未通过');
          clearInterval(intervalId);
          timersRef.current.delete(key);
          return;
        }

        if (status === 'queued' || status === 'running' || status === 'processing') {
          // keep polling
          if (resultUrl) updateTask(task.page, task.id, { resultUrl });
          // stop if exceeded time
          if (Date.now() - startAt > MAX_POLL_MS) {
            endTask(task.page, task.id, 'failed', '轮询超时');
            clearInterval(intervalId);
            timersRef.current.delete(key);
          }
          return;
        }

  if (status === 'succeeded' || status === 'success' || status === 'completed' || status === 'finished' || status === 'done') {
          // finalize on backend to upload to Supabase and persist history
          try {
            // SORA 文生视频后端在 /api/sora/poll/{task_id} 内部已尝试持久化并返回 stored_url
            // 图生视频（水印自由）直接返回 results[0].url
            const supabaseUrl = data.stored_url || data.supabase_url || undefined;
            const externalUrl = resultUrl || data.external_url || data.url || (data.results && data.results[0] && data.results[0].url);
            // Enhance/SuperIP flow: outputs endpoint may return fileUrl directly
            if (task.page === 'enhance' || task.page === 'superip') {
              const rhUrl = data.file_url || data.fileUrl || externalUrl;
              if (rhUrl) {
                updateTask(task.page, task.id, { resultUrl: rhUrl });
              }
            }
            updateTask(task.page, task.id, { resultUrl: externalUrl, supabaseUrl });
            endTask(task.page, task.id, 'success');

            // Persist history only when we actually have a final URL
            if (supabaseUrl || externalUrl) {
              // Align with backend enum values
              const subtype = task.page === 'text' ? 'text_to_video' : (task.page === 'image' ? 'image_to_video' : 'video_enhance');
              try {
                // Ensure returnedUrl is defined for later checks even if enhance branch skips saving
                let returnedUrl;
                // 前端仅在 text/image 成功时入库；enhance 由后端 /api/enhance/outputs 完成入库，避免重复记录
                if (task.page !== 'enhance' && task.page !== 'superip') {
                  const saved = await historyService.saveGeneratedContent({
                    content_type: 'video',
                    content_subtype: subtype,
                    // 将来源区分：文生视频归类为 VideoGeneration；图生视频归类为 HyperSell
                    source_page: task.page === 'text' ? 'VideoGeneration' : 'HyperSell',
                    file_data: supabaseUrl || externalUrl,
                    prompt: task.prompt || '',
                    generation_params: task.params || {},
                    api_endpoint: task.page === 'text' ? '/api/sora/text-to-video' : '/api/sora/watermark-free',
                    api_response_data: data,
                    duration: Number(task.params?.duration) || null,
                    dimensions: typeof task.params?.aspect_ratio === 'string' ? task.params.aspect_ratio : null,
                  });
                  returnedUrl = saved?.file_url;
                  if (returnedUrl) {
                    updateTask(task.page, task.id, {
                      supabaseUrl: returnedUrl,
                      resultUrl: returnedUrl,
                    });
                  }
                }
                // 对于 enhance，后端会返回 stored_url；前端只更新展示，不在此处入库

                // Post-success short refresh: if still no media URL, try re-poll a few times to catch late writes
                const hasMedia = (supabaseUrl || externalUrl || returnedUrl);
                if (!hasMedia) {
                  const pollPath = task.page === 'text'
                    ? `/api/sora/poll/${task.apiTaskId}`
                    : `/api/sora/watermark-free/${task.apiTaskId}`;
                  const MAX_RETRY = 5;
                  const RETRY_MS = 3000;
                  let attempts = 0;
                  const retryOnce = async () => {
                    attempts += 1;
                    try {
                      const r = await api.get(pollPath);
                      const d = r?.data || {};
                      const newUrl = d.stored_url || d.supabase_url || d.result_url || d.url || (d.results && d.results[0] && d.results[0].url);
                      if (newUrl) {
                        updateTask(task.page, task.id, { supabaseUrl: newUrl, resultUrl: newUrl });
                        return; // stop retries
                      }
                    } catch {}
                    if (attempts < MAX_RETRY) {
                      setTimeout(retryOnce, RETRY_MS);
                    }
                  };
                  setTimeout(retryOnce, RETRY_MS);
                }
              } catch (e) {
                // Non-blocking: saving history shouldn't disrupt the UI
                console.warn('history save failed', e?.response?.data || e);
              }
            } else {
              // No URL present in success response; skip history save to avoid 422
              console.warn('history save skipped: no result URL in success response');

              // Even if success returned no URL, attempt short refresh to obtain stored_url later
              const pollPath = task.page === 'text'
                ? `/api/sora/poll/${task.apiTaskId}`
                : (task.page === 'image' ? `/api/sora/watermark-free/${task.apiTaskId}` : `/api/superip/outputs/${task.apiTaskId}`);
              const MAX_RETRY = 5;
              const RETRY_MS = 3000;
              let attempts = 0;
              const retryOnce = async () => {
                attempts += 1;
                try {
                  const r = await api.get(pollPath);
                  const d = r?.data || {};
                  const newUrl = d.stored_url || d.supabase_url || d.result_url || d.url || (d.results && d.results[0] && d.results[0].url);
                  if (newUrl) {
                    updateTask(task.page, task.id, { supabaseUrl: newUrl, resultUrl: newUrl });
                    return; // stop retries
                  }
                } catch {}
                if (attempts < MAX_RETRY) {
                  setTimeout(retryOnce, RETRY_MS);
                }
              };
              setTimeout(retryOnce, RETRY_MS);
            }
          } catch (e) {
            endTask(task.page, task.id, 'failed', e?.response?.data?.detail || e.message);
          } finally {
            clearInterval(intervalId);
            timersRef.current.delete(key);
          }
          return;
        }

        if (status === 'failed' || status === 'error' || status === 'canceled' || status === 'timeout') {
          const errorMsg = data?.error || data?.message || '任务失败';
          // HyperSell (image page): alert on failure so user knows why the card disappeared
          if (task.page === 'image' && status !== 'canceled') {
            alert(`生成失败: ${errorMsg}`);
          }
          endTask(task.page, task.id, status === 'canceled' ? 'canceled' : 'failed', errorMsg);
          clearInterval(intervalId);
          timersRef.current.delete(key);
          return;
        }

        // unknown status -> keep polling but guard timeout
        if (Date.now() - startAt > MAX_POLL_MS) {
          endTask(task.page, task.id, 'failed', '轮询超时');
          clearInterval(intervalId);
          timersRef.current.delete(key);
        }
      } catch (err) {
        // swallow intermittent errors but stop after 30min via global timeout
        if (Date.now() - startAt > MAX_POLL_MS) {
          endTask(task.page, task.id, 'failed', err?.message || '轮询失败');
          clearInterval(intervalId);
          timersRef.current.delete(key);
        }
      }
    };

    const intervalId = setInterval(poll, POLL_INTERVAL_MS);
    timersRef.current.set(key, { intervalId, startAt });
    // kick immediately
    poll();
  }, [endTask, updateTask]);

  const startTask = useCallback(async ({ page, prompt, params, enqueueOnLimit = true }) => {
  if (!['text', 'image', 'enhance', 'superip'].includes(page)) throw new Error('Invalid page');

    if (!canStartTask(page)) {
      if (enqueueOnLimit) {
        // push a lightweight descriptor into pending queue; when slot frees, consumer should call startTask again.
        dispatch({ type: 'ENQUEUE', page, payload: { page, prompt, params } });
      }
      throw new Error('最多同时运行 5 个任务');
    }

    // create placeholder task right away
    const id = `${page}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const task = {
      id,
      page,
      prompt: prompt || '',
      params: params || {},
      status: 'running',
      progress: 0,
      createdAt: Date.now(),
    };
    internalAddTask(task);

    try {
      if (page === 'enhance') {
        // Enhance flow: prefer URL-based upload to avoid serverless body limits; fallback to file when URL missing
        const fileObj = params?.file;
        const fileUrl = params?.url;
        let fileName;
        if (fileUrl) {
          const up = await api.post('/api/enhance/upload-by-url', { url: fileUrl });
          fileName = up?.data?.file_name || up?.data?.fileName;
        } else {
          if (!(fileObj instanceof Blob)) throw new Error('缺少视频文件');
          const fd = new FormData();
          fd.append('file', fileObj);
          const up = await api.post('/api/enhance/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
          fileName = up?.data?.file_name || up?.data?.fileName;
        }
        if (!fileName) throw new Error('上传失败：未返回 fileName');
        const st = await api.post('/api/enhance/start', { file_name: fileName });
        const apiTaskId = st?.data?.task_id || st?.data?.taskId;
        if (!apiTaskId) throw new Error('创建任务失败：未返回 taskId');
        updateTask(page, id, { apiTaskId });
        startPolling({ ...task, apiTaskId });
        return { id, apiTaskId };
      } else if (page === 'superip') {
        // SuperIP: 通过 RunningHub create 启动任务，后端应提供代理以隐藏 apiKey
        const imgFileName = params?.image_file_name;
        const audFileName = params?.audio_file_name;
        const prompt = params?.prompt || '';
        if (!imgFileName || !audFileName) throw new Error('缺少图片或音频 fileName');
        // 后端代理启动
        const res = await api.post('/api/superip/start', {
          image_file_name: imgFileName,
          audio_file_name: audFileName,
          prompt,
          duration: params?.duration || undefined,
        });
        const apiTaskId = res?.data?.task_id || res?.data?.taskId;
        if (!apiTaskId) throw new Error('未返回 task_id');
        updateTask(page, id, { apiTaskId });
        startPolling({ ...task, apiTaskId });
        return { id, apiTaskId };
      } else {
        // 使用后端已有的 SORA 接口
        const endpoint = page === 'text' ? '/api/sora/text-to-video' : '/api/sora/watermark-free';
        const res = await api.post(endpoint, params);
        const apiTaskId = res?.data?.task_id || res?.data?.id || res?.task_id;
        if (!apiTaskId) throw new Error('未返回 task_id');
        updateTask(page, id, { apiTaskId });
        // start polling
        startPolling({ ...task, apiTaskId });
        return { id, apiTaskId };
      }
    } catch (err) {
      endTask(page, id, 'failed', err?.response?.data?.detail || err.message || '创建任务失败');
      throw err;
    }
  }, [canStartTask, internalAddTask, startPolling, updateTask, endTask]);

  const cancelTask = useCallback(async (page, id) => {
    try {
      // Find task from the correct list by page
      const listKey = page === 'text' ? 'textTasks' : (page === 'image' ? 'imageTasks' : (page === 'enhance' ? 'enhanceTasks' : 'superipTasks'));
      const taskList = state[listKey] || [];
      const task = taskList.find(t => t.id === id);
      if (!task) return;

      // Determine phase
      const hasMedia = !!(task?.supabaseUrl || task?.resultUrl);
      const phase = (!task?.apiTaskId ? 'submit' : (task.status === 'success' && !hasMedia ? 'persisting' : 'polling'));

      // Call backend cancel endpoint (phase-aware) using external apiTaskId
      if (task.apiTaskId) {
        try {
          await api.post(`/api/tasks/${task.apiTaskId}/cancel`, {
            phase,
            supabase_url: task?.supabaseUrl,
            result_url: task?.resultUrl,
          });

          // UI-only deletion for HyperSell (image page): skip backend history deletion by file_url
          const fileUrl = task?.supabaseUrl || task?.resultUrl;
          if (page !== 'image' && phase === 'persisting' && fileUrl) {
            try { await historyService.deleteByFileUrl(fileUrl); } catch (e) { console.warn('后端清理后，历史删除失败（忽略）：', e?.message || e); }
          }
        } catch (e) {
          console.warn('取消接口调用失败，前端仍将标记为已取消：', e?.message || e);
        }
      }
    } finally {
      // regardless of backend support, mark as canceled
      endTask(page, id, 'canceled');
      const key = id;
      const timers = timersRef.current.get(key);
      if (timers) {
        clearInterval(timers.intervalId);
        timersRef.current.delete(key);
      }
      // Immediately remove the card from UI after cancel per request
      dispatch({ type: 'REMOVE_TASK', page, id });
    }
  }, [endTask, state]);

  const removeTask = useCallback(async (page, id) => {
    try {
      const task = (page === 'text' ? state.textTasks : state.imageTasks).find(t => t.id === id);
      const fileUrl = task?.supabaseUrl || task?.resultUrl;
      // HyperSell 图生视频页：仅删除前端UI，不触发后端删除
      if (fileUrl && page !== 'image') {
        try { await historyService.deleteByFileUrl(fileUrl); } catch (e) { console.warn('历史记录删除失败，忽略：', e?.message || e); }
      }
    } finally {
      dispatch({ type: 'REMOVE_TASK', page, id });
    }
  }, [state.textTasks, state.imageTasks]);

  const value = useMemo(() => ({
    ...state,
    MAX_PER_PAGE: PAGE_LIMITS.text,
    PAGE_LIMITS,
    MAX_TOTAL,
    canStartTask,
    startTask,
    cancelTask,
    removeTask,
  }), [state, canStartTask, startTask, cancelTask, removeTask]);

  return (
    <TaskManagerContext.Provider value={value}>{children}</TaskManagerContext.Provider>
  );
}

export const useTaskManager = () => {
  const ctx = useContext(TaskManagerContext);
  if (!ctx) throw new Error('useTaskManager must be used within TaskManagerProvider');
  return ctx;
};
