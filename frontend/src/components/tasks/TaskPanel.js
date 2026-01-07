import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import './TaskPanel.css';
import { useTaskManager } from '../../contexts/TaskManagerContext';

function TaskCard({ task, onCancel, onDelete, page }) {
  const [fallbackUrl, setFallbackUrl] = useState(null);
  const [fallbackIsVideo, setFallbackIsVideo] = useState(false);
  const triedFallbackRef = useRef(false);
  // Desktop: show controls on hover; Touch devices: always show
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: none)').matches) {
        setShowControls(true);
      }
    } catch (e) {
      // no-op: be conservative
      setShowControls(true);
    }
  }, []);

  // Treat "success without supabaseUrl" as a persisting phase. In that case,
  // keep showing the placeholder animation instead of trying to render
  // external/ephemeral resultUrl that might be black due to CORS or encoding.
  const isPersisting = task.status === 'success' && !task.supabaseUrl;
  const mediaSrc = isPersisting
    ? (fallbackUrl || task.supabaseUrl || undefined)
    : (fallbackUrl || task.supabaseUrl || task.resultUrl);
  const isVideo = useMemo(() => {
    if (!mediaSrc) return false;
    // If we already created a blob fallback, trust its detected type
    if (fallbackUrl) return fallbackIsVideo || mediaSrc.startsWith('blob:');
    // Be tolerant: many providers return signed or redirected URLs without .mp4 suffix
    // Consider it video if it includes mp4 anywhere or looks like a video path
    const u = mediaSrc.toLowerCase();
    return mediaSrc.startsWith('blob:') || u.endsWith('.mp4') || u.includes('mp4') || u.includes('/video') || u.includes('/videos');
  }, [mediaSrc, fallbackUrl, fallbackIsVideo]);

  const handleVideoError = async (evt) => {
    if (triedFallbackRef.current) return;
    triedFallbackRef.current = true;
    try {
      if (!mediaSrc) return;
      // Print failing url to console for debugging as requested
      // Including local task id and api task id if present
      // eslint-disable-next-line no-console
      console.warn('[TaskCard] Video load failed, trying blob fallback', {
        src: mediaSrc,
        taskId: task?.id,
        apiTaskId: task?.apiTaskId,
        page: task?.page,
        error: evt?.message || evt?.type || 'unknown'
      });
      // Try to inspect response headers to diagnose issues (CORS, MIME, Range, redirects)
      try {
        const headResp = await fetch(mediaSrc, { method: 'GET', mode: 'cors' });
        // eslint-disable-next-line no-console
        console.info('[TaskCard] Inspect response headers', {
          ok: headResp.ok,
          status: headResp.status,
          contentType: headResp.headers.get('content-type'),
          acceptRanges: headResp.headers.get('accept-ranges'),
          contentLength: headResp.headers.get('content-length'),
          allowOrigin: headResp.headers.get('access-control-allow-origin'),
        });
      } catch (inspectErr) {
        // eslint-disable-next-line no-console
        console.warn('[TaskCard] Header inspection failed (likely CORS or network)', inspectErr);
      }
      const resp = await fetch(mediaSrc, { mode: 'cors' });
      if (!resp.ok) throw new Error(`fetch failed ${resp.status}`);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      setFallbackUrl(url);
      setFallbackIsVideo((blob?.type || '').toLowerCase().startsWith('video/'));
    } catch (e) {
      // keep silent; user can still click Download to open in new tab
      // eslint-disable-next-line no-console
      console.warn('[TaskCard] video blob fallback failed', e);
    }
  };

  const showProgress = task.status === 'queued' || task.status === 'running';
  // Consider "success without supabaseUrl" as still in-progress (persisting to stable URL)
  const hasMedia = !!mediaSrc;
  const isDone = (task.status === 'success' && hasMedia) || task.status === 'failed' || task.status === 'canceled';
  return (
    <div 
      className={`task-card status-${task.status} ${isPersisting && !hasMedia ? 'status-persisting' : (!hasMedia && task.status === 'success' ? 'status-queued' : '')}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="task-media">
        {hasMedia ? (
          isVideo ? (
            <video
              src={mediaSrc}
              controls={showControls}
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              onError={handleVideoError}
              className={(task?.params?.aspect_ratio === '9:16') ? 'media-portrait' : ''}
            />
          ) : (
            <img src={mediaSrc} alt={task.prompt} className={(task?.params?.aspect_ratio === '9:16') ? 'media-portrait' : ''} />
          )
        ) : (
          <div className="task-placeholder">
            {task.status === 'failed' ? (
              <span className="error-icon">⚠️</span>
            ) : (
              null /* 移除本地旋转加载器，改用闪烁遮罩 */
            )}
            <div className="task-status-text">
              {task.status === 'failed' && 'FAILED'}
            </div>
          </div>
        )}

        {/* 不再显示 Text/Success 徽标；仅在有错误时叠加提示，避免干扰视频控件 */}
        {!showProgress && hasMedia && task.errorMsg && (
          <div className="task-meta overlay">
            <div className="error">{task.errorMsg}</div>
          </div>
        )}

        {/* 进度叠加：仅在 text/image 页面显示；enhance/superip 不显示百分比 */}
        {showProgress && typeof task.progress === 'number' && (page === 'text' || page === 'image') && (
          <div style={{ position: 'absolute', top: '8px', left: '12px', zIndex: 5, pointerEvents: 'none' }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '14px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
              {Math.round(Math.max(0, Math.min(100, task.progress)))}%
            </span>
          </div>
        )}
      </div>

      {!isDone && (
        <button className="btn-cancel" onClick={onCancel}>取消</button>
      )}

      {isDone && hasMedia && page !== 'superip' && (
        <button className="btn-delete" title="删除任务" onClick={onDelete}>
          <Trash2 size={14} />
        </button>
      )}

      {isDone && hasMedia && (
        <a className="btn-download" href={mediaSrc} target="_blank" rel="noreferrer">下载</a>
      )}
    </div>
  );
}

export default function TaskPanel({ page, variant, filter }) {
  const { textTasks, imageTasks, enhanceTasks, superipTasks, cancelTask, removeTask } = useTaskManager();
  let tasks = page === 'text' ? textTasks : (page === 'image' ? imageTasks : (page === 'enhance' ? enhanceTasks : superipTasks));
  
  // Apply optional filter prop
  if (filter && typeof filter === 'function') {
    tasks = tasks.filter(filter);
  }

  // 过滤潜在的“黑框”：已取消的任务；保留“成功但无媒体”的任务用于持久化中的占位显示
  tasks = tasks.filter(t => {
    const media = t.supabaseUrl || t.resultUrl;
    if (t.status === 'canceled') return false;
    // 积分不足或失败但没有媒体的任务，不显示空卡片
    if ((t.status === 'failed') && !media) return false;
    return true;
  });

  // 根据 variant 不同采用不同展示策略
  // 默认：结果区域（含 SuperIP 的单卡模式）
  let displayTasks = tasks;
  if (!variant) {
    if (page === 'superip') {
      try {
        displayTasks = [...tasks].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 1);
      } catch {
        displayTasks = tasks.slice(0, 1);
      }
    }
  }

  // 历史栏变体：用于在 SuperIP 的历史栏中展示“除最新外”的运行中/排队中/持久化中的任务
  if (variant === 'history-list') {
    try {
      const sorted = [...tasks].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      const latestId = sorted[0]?.id;
      displayTasks = sorted.filter(t => {
        const isPersisting = t.status === 'success' && !(t.supabaseUrl);
        const isActive = t.status === 'queued' || t.status === 'running' || isPersisting;
        return t.id !== latestId && isActive;
      });
    } catch {
      displayTasks = [];
    }
  }

  if (displayTasks.length === 0) {
    // SuperIP 空状态：返回空，不渲染任何内容（由父组件控制占位）
    if (page === 'superip' && !variant) return null;
    if (variant === 'history-list') return null;
    // 仅显示居中文本提示（无边框卡片），位于生成区域正中
    return (
      <div className="task-panel empty-state">
        <div className="empty-text-wrapper">
          <div className="empty-title">RESULT</div>
          <div className="empty-subtitle">生成的内容将在这里显示</div>
        </div>
      </div>
    );
  }

  // 历史栏变体：每个任务用与历史卡片一致的容器包裹
  if (variant === 'history-list') {
    return (
      <>
        {displayTasks.map(task => (
          <div key={task.id} className="video-history-item" onClick={(e) => e.stopPropagation()}>
            <TaskCard
              task={task}
              onCancel={() => cancelTask(page, task.id)}
              onDelete={() => removeTask(page, task.id)}
              page={page}
            />
          </div>
        ))}
      </>
    );
  }

  return (
    <div className={`task-panel ${page === 'superip' ? 'single-card-mode' : ''}`} style={page === 'superip' ? { width: '100%', height: '100%', padding: 0, background: 'transparent', border: 'none' } : {}}>
      {displayTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onCancel={() => cancelTask(page, task.id)}
          onDelete={() => removeTask(page, task.id)}
          page={page}
        />
      ))}
    </div>
  );
}
