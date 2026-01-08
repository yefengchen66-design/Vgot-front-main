import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Loader2, Play, Pause, Settings, X, Upload, Trash2, RefreshCw } from 'lucide-react';
import { useSupabaseUpload } from '../hooks/useSupabaseUpload';
import historyService from '../services/historyService';
import contentManager from '../services/contentManager';
import './SuperIP.css';
import SystemSelect from '../components/SystemSelect';
import VideoThumbnail from '../components/VideoThumbnail';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { useTaskManager } from '../contexts/TaskManagerContext';
import TaskPanel from '../components/tasks/TaskPanel';
import '../components/tasks/TaskPanel.css';
// 保留 SuperIP 内置的音色选择弹窗样式（不使用通用弹窗样式）

const CustomAudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    if (audioRef.current && audioRef.current.duration) {
      const newTime = percentage * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="custom-audio-player">
      <audio ref={audioRef} src={src} />
      <button className="player-btn" onClick={togglePlay}>
        {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" style={{ marginLeft: '1px' }} />}
      </button>
      <div className="player-progress-container" onClick={handleSeek}>
        <div className="player-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="player-time">
        {formatTime(Math.max(0, duration - currentTime))}
      </div>
    </div>
  );
};

const systemVoices = [
  { id: 'v1', name: '女声-温柔', type: 'system' },
  { id: 'v2', name: '男声-磁性', type: 'system' },
  { id: 'v3', name: '女声-活泼', type: 'system' },
  { id: 'v4', name: '男声-沉稳', type: 'system' },
  { id: 'v5', name: '童声-可爱', type: 'system' },
];

// Helper to get audio duration reliably
const getAudioDuration = (src) => {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      const d = audio.duration;
      resolve(Number.isFinite(d) ? Math.ceil(d) : 5);
    };
    audio.onerror = () => {
      console.warn('Audio duration load error, defaulting to 5s');
      resolve(5);
    };
    audio.src = src;
    // Safety timeout 10s
    setTimeout(() => resolve(5), 10000);
  });
};

export default function SuperIP() {
  const { startTask, canStartTask, PAGE_LIMITS, activeCountByPage, superipTasks, removeTask } = useTaskManager();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('character');

  // 文件和URL状态
  const [characterFile, setCharacterFile] = useState('');
  const [characterFileUrl, setCharacterFileUrl] = useState(null); // 公共预览/分析用的 Supabase URL
  const [characterFileNameRH, setCharacterFileNameRH] = useState(null); // RunningHub 上传得到的 fileName（用于数字人生成）
  const [voiceFile, setVoiceFile] = useState('');
  const [voiceFileUrl, setVoiceFileUrl] = useState(null); // RunningHub fileName (was Supabase URL)
  const [audioDuration, setAudioDuration] = useState(5); // 音频时长（秒），默认5秒
  const [isCalculatingDuration, setIsCalculatingDuration] = useState(false);
  const [videoFile, setVideoFile] = useState('');
  const [videoFileUrl, setVideoFileUrl] = useState(null); // 生成后的视频URL
  const [navVideoLoading, setNavVideoLoading] = useState(false); // 导航栏视频生成状态
  const [isNavThumbHover, setIsNavThumbHover] = useState(false); // 导航缩略图悬浮
  // 轻量播放预览（不影响结果区域）
  const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');
  // 上传 input 引用，用于清空值后可重新选择相同文件
  const characterInputRef = useRef(null);
  const voiceInputRef = useRef(null);
  // 声线复刻上传 input 引用
  const cloneInputRef = useRef(null);

  // 上传状态
  const [imageUploading, setImageUploading] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);

  // 选择角色页面的状态
  const [selectedImage, setSelectedImage] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [historyImages, setHistoryImages] = useState([]); // 从数据库加载的历史图片
  const [loadingHistory, setLoadingHistory] = useState(false);

  // 选择音色页面的状态
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceText, setVoiceText] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [voiceHistory, setVoiceHistory] = useState([]);
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableVoices, setAvailableVoices] = useState({}); // 从后端获取的音色列表
  const canvasRef = useRef(null);
  // voice analysis / trial states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedPrompt, setAnalyzedPrompt] = useState(''); // prompt returned from /api/voice/design
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [modalPrompt, setModalPrompt] = useState('');
  const [trialText, setTrialText] = useState('你好呀，今天我很高兴，你呢');
  const [trialAudio, setTrialAudio] = useState(''); // hex or url from /api/avatar/shiting
  const [isPlayingTrial, setIsPlayingTrial] = useState(false); // 试听音频播放状态
  const [voiceId, setVoiceId] = useState(''); // 试听接口返回的 voice_id
  const [overrideVoiceId, setOverrideVoiceId] = useState(''); // 用户选择系统/自定义音色覆盖 voice_id
  const [isGeneratingTrial, setIsGeneratingTrial] = useState(false);
  const [hasWaveform, setHasWaveform] = useState(false); // 表示已生成声音波形（分析或试听）
  const trialAudioRef = useRef(null); // 试听音频对象引用
  const [voiceDialogTab, setVoiceDialogTab] = useState('system'); // 音色对话框导航标签: 'system' | 'custom' | 'clone'
  // Business 波形/克隆路径的实际所需积分（0=首次免费；3000=已用过）
  const [waveformRequiredCredits, setWaveformRequiredCredits] = useState(null);

  // 声线复刻（隐藏大多数接口逻辑）
  const [cloneFile, setCloneFile] = useState(null);
  const [cloneFileId, setCloneFileId] = useState('');
  const [cloneFileDuration, setCloneFileDuration] = useState(0);
  const [cloneUploading, setCloneUploading] = useState(false);
  // 后端写死 Preview 文本，不在UI展示
  const [cloneVoiceIdInput, setCloneVoiceIdInput] = useState('');
  const [cloneAllowEditName, setCloneAllowEditName] = useState(false); // 点击“修改系统默认命名”后允许自定义
  const [cloneAudioUrl, setCloneAudioUrl] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [isCloneSettingsOpen, setCloneSettingsOpen] = useState(false);
  const [cloneNameError, setCloneNameError] = useState(''); // 红字提示命名不符合规则

  // 生成视频页面的状态
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [videoHistory, setVideoHistory] = useState([]);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // 大图查看
  const [enlargedImage, setEnlargedImage] = useState(null);

  // 缓存
  const [historyCache, setHistoryCache] = useState(new Map());
  // 画幅比例（用于生成图片接口）
  // 画幅比例选择已移除：生成与清除按钮位置保持不变

  // Supabase上传hook
  // 统一上传到 Supabase 的 vgot 桶
  const { uploadFile, uploading: isUploading, progress, error: uploadError } = useSupabaseUpload('vgot');
  // RunningHub API keys (prefer env; fallback to provided samples)
  const RH_IMAGE_API_KEY = process.env.REACT_APP_RH_IMAGE_API_KEY || 'ba95f9de5b504c80aa4f70bccb84b1c6';
  const RH_AUDIO_API_KEY = process.env.REACT_APP_RH_AUDIO_API_KEY || '4f81fbffbd014892897264c5583c6aad';
  const RH_UPLOAD_URL = 'https://www.runninghub.cn/task/openapi/upload';
  const RH_CREATE_URL = 'https://www.runninghub.cn/task/openapi/create';
  const RH_OUTPUTS_URL = 'https://www.runninghub.cn/task/openapi/outputs';
  // 每个历史列表独立的“滚动中”状态，避免跨页面失效
  const [isImageScrolling, setIsImageScrolling] = useState(false);
  const [isVoiceScrolling, setIsVoiceScrolling] = useState(false);
  const [isVideoScrolling, setIsVideoScrolling] = useState(false);

  const makeScrollHandler = (setFn, timeout = 800) => {
    return (e) => {
      setFn(true);
      const el = e.currentTarget;
      if (el._scrollTimeout) clearTimeout(el._scrollTimeout);
      el._scrollTimeout = setTimeout(() => setFn(false), timeout);
    };
  };

  // 监测用户登录状态和tier信息
  useEffect(() => {
    console.log('👤 SuperIP - 用户状态更新:', {
      user: user,
      tier: user?.tier,
      monthly_credits: user?.monthly_credits
    });
  }, [user]);

  // 查询 Business 用户在“波形/克隆”路径是否仍享受首次免费
  const refreshWaveformCost = async () => {
    try {
      if (!user || user.tier !== 'Business') {
        setWaveformRequiredCredits(null);
        return;
      }
      const token = localStorage.getItem('token');
      const resp = await axios.post(
        API_ENDPOINTS.credits.check,
        { action_type: 'superip_voice_gen_waveform', quantity: 1 },
        { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
      );
      // 兼容不同返回结构：{ success, data: { required_credits } }
      const data = resp?.data?.data || resp?.data;
      const rc = typeof data?.required_credits === 'number' ? data.required_credits : null;
      setWaveformRequiredCredits(rc);
    } catch (e) {
      console.warn('credits.check 调用失败（忽略）:', e?.message || e);
      setWaveformRequiredCredits(null);
    }
  };

  // 登录或套餐变化时刷新一次
  useEffect(() => {
    refreshWaveformCost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.tier]);

  const handleImageScroll = makeScrollHandler(setIsImageScrolling);
  const handleVoiceScroll = makeScrollHandler(setIsVoiceScrolling);
  const handleVideoScroll = makeScrollHandler(setIsVideoScrolling);

  // 加载历史视频记录 - 与图片/音频一致的缓存机制
  const loadVideoHistory = async (useCache = true) => {
    const cacheKey = 'superip_video_history';
    console.log('🔄 loadVideoHistory 被调用, useCache:', useCache);

    if (useCache && historyCache.has(cacheKey)) {
      const cached = historyCache.get(cacheKey);
      console.log('🚀 从缓存加载历史视频，数量:', cached.items.length);
      setVideoHistory(cached.items);
      return;
    }

    try {
      const filters = {
        source_page: 'SuperIP',
        content_type: 'video',
        limit: 50
      };
      console.log('📡 正在从服务器加载历史视频...');
      const records = await historyService.getUserHistory(filters);
      const mapped = (Array.isArray(records) ? records : []).map(r => ({
        id: r.id,
        videoUrl: r.file_url,
        prompt: r.prompt || r.generation_params?.prompt || '',
        created_at: r.created_at,
        timestamp: r.created_at ? new Date(r.created_at) : new Date()
      }));

      setVideoHistory(mapped);
      setHistoryCache(prev => new Map(prev.set(cacheKey, { items: mapped })));
      console.log('✅ 历史视频加载完成并已缓存');
    } catch (err) {
      console.error('❌ 加载历史视频失败:', err);
      // 保持现状
    }
  };

  // 加载历史图片记录 - 使用缓存机制
  const loadHistoryImages = async (useCache = true) => {
    const cacheKey = 'superip_history_images';

    console.log('🔄 loadHistoryImages 被调用, useCache:', useCache);

    // 检查缓存（与历史生成页一致：有就直接用，不做过期判断）
    if (useCache && historyCache.has(cacheKey)) {
      const cachedData = historyCache.get(cacheKey);
      console.log('🚀 从缓存加载历史图片，数量:', cachedData.images.length);
      setHistoryImages(cachedData.images);
      return;
    }

    setLoadingHistory(true);
    try {
      const filters = {
        source_page: 'SuperIP',
        content_type: 'image',
        limit: 50
      };

      console.log('📡 正在从服务器加载历史图片...');
      const images = await historyService.getUserHistory(filters);

      console.log('📋 加载的历史图片数量:', images.length);
      console.log('📋 历史图片详情:', images.slice(0, 3)); // 只打印前3条

      setHistoryImages(images);

      // 缓存结果
      setHistoryCache(prev => new Map(prev.set(cacheKey, { images })));

      console.log('✅ 历史图片加载完成并已缓存');

    } catch (error) {
      console.error('❌ 加载历史图片失败:', error);
      setHistoryImages([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // 加载历史音频记录 - 使用与图片一致的缓存机制
  const loadVoiceHistory = async (useCache = true) => {
    const cacheKey = 'superip_voice_history';

    console.log('🔄 loadVoiceHistory 被调用, useCache:', useCache);

    if (useCache && historyCache.has(cacheKey)) {
      const cached = historyCache.get(cacheKey);
      console.log('🚀 从缓存加载历史音频，数量:', cached.items.length);
      setVoiceHistory(cached.items);
      return;
    }

    try {
      const filters = {
        source_page: 'SuperIP',
        content_type: 'audio',
        limit: 50
      };
      console.log('📡 正在从服务器加载历史音频...');
      const records = await historyService.getUserHistory(filters);
      // 映射为本页需要的结构
      const mapped = (Array.isArray(records) ? records : []).map(r => ({
        id: r.id,
        audio_url: r.file_url,
        text: (r.generation_params && (r.generation_params.text || r.generation_params.content || '')) || (r.prompt || ''),
        voiceName: (r.generation_params && (r.generation_params.voice_name || r.generation_params.voiceId || '')) || undefined,
        created_at: r.created_at,
        timestamp: r.created_at ? new Date(r.created_at) : new Date()
      }));

      setVoiceHistory(mapped);
      setHistoryCache(prev => new Map(prev.set(cacheKey, { items: mapped })));
      console.log('✅ 历史音频加载完成并已缓存');
    } catch (err) {
      console.error('❌ 加载历史音频失败:', err);
      // 保持现状，不抛错
    }
  };

  // 处理图片文件上传到后端 Supabase（返回公共 URL），与 HyperSell 同步方式
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      // 读成 base64 data URL
      const toDataUrl = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const dataUrl = await toDataUrl(file);
      const token = localStorage.getItem('token');
      console.log('📤 正在上传图片到后端 files.upload:', API_ENDPOINTS.files.upload);
      let publicUrl = null;
      try {
        const resp = await axios.post(API_ENDPOINTS.files.upload, {
        file_data: dataUrl,
        filename: file.name,
        folder: 'images'
      }, {
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
        publicUrl = resp?.data?.url || null;
        if (publicUrl) {
          console.log('✅ 图片上传到 Supabase 成功，url:', publicUrl);
        } else {
          throw new Error('Upload failed: no public URL returned');
        }
      } catch (supErr) {
        // 若 JSON 上传失败（例如 404 或 413），尝试 multipart 方式避免网关大小限制
        const status = supErr?.response?.status;
        console.warn('⚠️ JSON 上传失败，状态:', status, '改用 multipart 方式重试');
        try {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('folder', 'images');
          const mResp = await axios.post(`${API_ENDPOINTS.files.upload.replace('/api/files/upload','')}/api/files/upload-multipart`, fd, {
            headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
          });
          publicUrl = mResp?.data?.url || null;
          if (publicUrl) {
            console.log('✅ 图片通过 multipart 上传成功，url:', publicUrl);
          } else {
            throw new Error('Multipart upload failed: no public URL');
          }
        } catch (mpErr) {
          console.warn('⚠️ Multipart 上传也失败，最终回退使用 data URL 作为预览与分析源:', mpErr?.response?.status || mpErr?.message);
          publicUrl = dataUrl; // XGAI 接口支持合法的 data URL
        }
      }
      setCharacterFile(file.name);
      setCharacterFileUrl(publicUrl); // 保存公共 URL 供后续分析/生成与显示
      setSelectedImage(publicUrl); // 在上传框显示预览

      // 同步上传到 RunningHub 以获取 fileName（用于后续数字人生成）
      const form = new FormData();
      form.append('apiKey', RH_IMAGE_API_KEY);
      form.append('file', file);
      form.append('fileType', 'input');
      const rhResp = await fetch(RH_UPLOAD_URL, { method: 'POST', body: form });
      const rhData = await rhResp.json();
      if (rhResp.ok && rhData && rhData.code === 0) {
        const fileNameRH = rhData?.data?.fileName;
        console.log('✅ 图片上传到 RunningHub 成功，fileName:', fileNameRH);
        setCharacterFileNameRH(fileNameRH);
      } else {
        const msg = rhData?.msg || `HTTP ${rhResp.status}`;
        console.warn('⚠️ 图片上传到 RunningHub 失败（不影响预览与分析）:', msg);
      }
    } catch (error) {
      console.error('图片上传错误:', error);
      const isAxiosNetworkError = !!(error?.message && error.message.includes('Network Error'));
      const detail = error.response?.data?.detail || error.message;
      // 额外打印请求 URL 与环境，便于线上排查
      try { console.log('🧭 files.upload URL:', API_ENDPOINTS.files.upload, 'token?', !!localStorage.getItem('token')); } catch {}
      alert(t('superIP.alerts.imageUploadFail').replace('{msg}', String(detail || (isAxiosNetworkError ? 'Network Error' : 'Unknown'))));
    } finally {
      setImageUploading(false);
    }
  };

  // 处理音频文件上传到 RunningHub（返回 fileName）
  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioUploading(true);
    try {
      const form = new FormData();
      form.append('apiKey', RH_AUDIO_API_KEY);
      form.append('file', file);
      form.append('fileType', 'input');
      const resp = await fetch(RH_UPLOAD_URL, { method: 'POST', body: form });
      const data = await resp.json();
      if (!resp.ok || !data || data.code !== 0) {
        const msg = data?.msg || `HTTP ${resp.status}`;
        console.error('音频上传到 RunningHub 失败:', msg, data);
        alert(t('superIP.alerts.audioUploadFail').replace('{msg}', String(msg)));
      } else {
        const fileName = data?.data?.fileName;
        console.log('✅ 音频上传到 RunningHub 成功，fileName:', fileName);
        setVoiceFile(file.name);
        setVoiceFileUrl(fileName); // 保存 fileName 供后续生成
        
        // 获取音频时长
        setIsCalculatingDuration(true);
        const obj = URL.createObjectURL(file);
        try {
          const d = await getAudioDuration(obj);
          console.log(`📊 音频时长: ${d}秒`);
          setAudioDuration(d);
        } finally {
          setIsCalculatingDuration(false);
          try { URL.revokeObjectURL(obj); } catch {}
        }
      }
    } catch (error) {
      console.error('音频上传错误:', error);
      alert(t('superIP.alerts.audioUploadFail').replace('{msg}', error.response?.data?.detail || error.message));
    } finally {
      setAudioUploading(false);
    }
  };

  // 保存到历史记录
  const saveToHistory = async (fileUrl, contentType, generationParams = {}, apiResponseData = {}) => {
    try {
      console.log(`📝 开始保存历史记录: ${contentType} - ${fileUrl}`);

      const contentSubtype = contentType === 'image' ? 'superip_character' :
        contentType === 'audio' ? 'superip_voice' : 'superip_video';

      const result = await contentManager.processGeneratedContent({
        fileUrl: fileUrl,
        contentType: contentType,
        contentSubtype: contentSubtype,
        sourcePage: 'SuperIP',
        prompt: generationParams.prompt || '',
        generationParams: generationParams,
        apiResponse: apiResponseData,
        customFilename: null
      });

      // 屏蔽占位符/无效 storageUrl，统一回退到原始 URL（用于历史缩略图与后续加载）
      const isUsableStorageUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        const lower = url.toLowerCase();
        if (!/^https?:\/\//.test(lower)) return false;
        if (lower.includes('example.com/placeholder')) return false;
        if (lower.endsWith('/placeholder.png')) return false;
        return true;
      };

      if (result.success && isUsableStorageUrl(result.storageUrl)) {
        console.log('✅ 历史记录保存成功，使用 Storage URL:', result.storageUrl);
        console.log('✅ 历史记录ID:', result.historyRecord?.id);
        return result;
      }

      // 存储未启用或返回无效地址：明确回退
      const adjusted = { ...result };
      if (!isUsableStorageUrl(result.storageUrl)) {
        adjusted.storageUrl = null;
      }
      console.warn('⚠️ 使用原始URL保存/展示:', adjusted.originalUrl);
      return adjusted;

    } catch (error) {
      console.error('❌ 历史记录保存失败:', error);
      throw error;
    }
  };

  // 获取积分显示文本的辅助函数
  const getCreditDisplay = (feature) => {
    if (!user || !user.tier) {
      console.log(`💳 SuperIP - 无法获取用户信息:`, { user });
      return '';
    }
    
    const tier = user.tier;
    console.log(`💳 SuperIP - 获取积分显示: feature=${feature}, tier=${tier}, lang=${lang}`);
    
    const creditCosts = {
      'superip_image_gen': { 'Free': 50, 'Creator': 50, 'Business': 0, 'Enterprise': 0 },
      // 保留旧键以兼容，但语音将使用动态显示
      'superip_voice_gen': { 'Free': -1, 'Creator': 3000, 'Business': 3000, 'Enterprise': 0 },
      'superip_video_gen': { 'Free': -1, 'Creator': 30, 'Business': 30, 'Enterprise': 0 }
    };

    const cost = creditCosts[feature]?.[tier];
    console.log(`💳 SuperIP - 积分成本: cost=${cost}`);
    
    if (cost === undefined) return '';
    if (cost === 0) return '';
    
    // 根据语言返回不同格式
    if (cost === -1) {
      // 需要升级
      if (lang === 'zh') return ' (需要升级)';
      if (lang === 'zh-TW') return ' (需要升級)';
      if (lang === 'en') return ' (Upgrade Required)';
      if (lang === 'es') return ' (Actualización Requerida)';
      return ' (Upgrade Required)';
    }
    
    // 针对视频生成,显示每秒积分
    if (feature === 'superip_video_gen') {
      if (lang === 'zh') return ` (${cost}积分/秒)`;
      if (lang === 'zh-TW') return ` (${cost}積分/秒)`;
      if (lang === 'en') return ` (${cost} credits/sec)`;
      if (lang === 'es') return ` (${cost} créditos/seg)`;
      return ` (${cost} credits/sec)`;
    }
    
    // 普通积分显示
    if (lang === 'zh') return ` (${cost}积分)`;
    if (lang === 'zh-TW') return ` (${cost}積分)`;
    if (lang === 'en') return ` (${cost} credits)`;
    if (lang === 'es') return ` (${cost} créditos)`;
    return ` (${cost} credits)`;
  };

  // 动态语音积分显示：仅当选中“选择音色”或存在波形 voiceId 时才显示；
  // 选择音色（overrideVoiceId）= 按字数阶梯 20~160；波形 voiceId（voiceId）=3000；企业0；Free显示需要升级
  const getDynamicVoiceCreditDisplay = () => {
    // 未选择任何来源时，不展示任何积分信息
    // 允许在“仅上传了克隆音频（尚未拿到 voice_id）”时也提前显示文案
    if (!overrideVoiceId && !voiceId) {
      // 如果存在克隆上传或克隆试听，也视为来源为“波形/克隆”，用于提前展示按钮文案
      const hasCloneSource = !!(cloneFileId || cloneAudioUrl || hasWaveform);
      if (!hasCloneSource) return '';
    }
    if (!user || !user.tier) return '';
    const tier = user.tier;
    if (tier === 'Enterprise') return '';
    if (tier === 'Free') {
      return lang === 'zh' ? ' (需要升级)' : lang === 'zh-TW' ? ' (需要升級)' : lang === 'en' ? ' (Upgrade Required)' : lang === 'es' ? ' (Actualización Requerida)' : ' (Upgrade Required)';
    }
  // 新规则：有 overrideVoiceId 代表“选择音色”面板所选（20）；
  // 否则若使用波形/克隆来源（包括仅上传克隆但暂未获取 voice_id 的状态）则显示 3000 或商务“1次免费”
  const isFromSelection = !!overrideVoiceId;
    // Business 首次免费：根据后端 /credits/check 的 required_credits 精准显示
    if (tier === 'Business' && !isFromSelection) {
      if (waveformRequiredCredits === 0) {
        if (lang === 'zh') return ' (1次免费)';
        if (lang === 'zh-TW') return ' (1次免費)';
        if (lang === 'en') return ' (First free)';
        if (lang === 'es') return ' (Primero gratis)';
        return ' (First free)';
      }
      // 非0（含 null 或 3000）统一展示 3000
      const costTxt = lang === 'zh' ? ' (3000积分)' : lang === 'zh-TW' ? ' (3000積分)' : lang === 'en' ? ' (3000 credits)' : ' (3000 créditos)';
      return costTxt;
    }
  // 选择音色路径：根据字数动态显示
  if (isFromSelection) {
    const n = voiceText.length || 0;
    const units = n <= 400 ? 1 : n <= 800 ? 2 : n <= 1200 ? 3 : n <= 1600 ? 4 : n <= 2000 ? 5 : n <= 2400 ? 6 : n <= 2800 ? 7 : 8;
    const cost = 20 * units;
    if (lang === 'zh') return ` (${cost}积分)`;
    if (lang === 'zh-TW') return ` (${cost}積分)`;
    if (lang === 'en') return ` (${cost} credits)`;
    if (lang === 'es') return ` (${cost} créditos)`;
    return ` (${cost} credits)`;
  }
  const cost = 3000;
    if (lang === 'zh') return ` (${cost}积分)`;
    if (lang === 'zh-TW') return ` (${cost}積分)`;
    if (lang === 'en') return ` (${cost} credits)`;
    if (lang === 'es') return ` (${cost} créditos)`;
    return ` (${cost} credits)`;
  };

  // 图片生成函数 - 仅在输入提示词时调用生成接口
  const handleGenerate = async () => {
    // 必须输入提示词
    if (!textInput || !textInput.trim()) {
      alert(t('superIP.work.inputPrompt'));
      return;
    }

    const currentPrompt = textInput; // 保存当前提示词
    setIsGenerating(true);

    try {
      // 改为调用后端代理接口，避免在前端暴露 apiKey
      const token = localStorage.getItem('token');
      const resp = await axios.post(
        API_ENDPOINTS.superip.generateImage,
        { prompt: currentPrompt },
        { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
      );
      const data = resp?.data;
      const generatedImageUrl = data?.url || data?.data?.url || null;

      if (generatedImageUrl) {
        // 立即显示生成的图片
        setGeneratedImage(generatedImageUrl);
        setSelectedImage(generatedImageUrl);
        setCharacterFile('generated_character.png');
        setCharacterFileUrl(generatedImageUrl);
  // 生成图片来源不具备 RunningHub fileName，明确重置，确保后续生成使用当前URL轨迹
  setCharacterFileNameRH(null);

        // 创建临时记录 ID
        const tempId = `temp_${Date.now()}`;

        // 立即添加到历史记录数组（新的在上方）- 先显示，后保存
        const newHistoryItem = {
          id: tempId,
          file_url: generatedImageUrl,
          content_type: 'image',
          prompt: currentPrompt,
          created_at: new Date().toISOString(),
          isTemp: true, // 标记为临时记录，表示还未保存到数据库
        };

        // 立即更新UI显示
        setHistory([newHistoryItem, ...history]);
        setHistoryImages([newHistoryItem, ...historyImages]);

        // 清空提示词
        setTextInput('');

  // 后台异步保存到数据库（不阻塞UI）
  // 前端已改为走后端代理，无直接第三方响应体，这里构造一个最小结果对象以兼容原签名
  const result = { provider: 'runninghub' };
  saveToHistory(generatedImageUrl, 'image', { prompt: currentPrompt }, result)
          .then((saveResult) => {
            console.log('✅ 图片已保存到数据库');

            if (saveResult && saveResult.historyRecord) {
              // 保存成功后，用真实的数据库记录替换临时记录（保持位置不变）
              const realRecord = saveResult.historyRecord;

              setHistory(prev => prev.map(item =>
                item.id === tempId ? {
                  ...realRecord,
                  file_url: saveResult.storageUrl || generatedImageUrl, // 使用Supabase URL
                  isTemp: false
                } : item
              ));

              setHistoryImages(prev => prev.map(item =>
                item.id === tempId ? {
                  ...realRecord,
                  file_url: saveResult.storageUrl || generatedImageUrl, // 使用Supabase URL
                  isTemp: false
                } : item
              ));

              // 清除缓存，下次重新加载时会从数据库获取最新数据
              setHistoryCache(new Map());

              console.log('✅ 临时记录已更新为真实记录，位置保持不变');
            }
          })
          .catch(error => {
            console.error('❌ 保存到数据库失败:', error);
            // 保存失败，更新临时记录标记错误状态
            setHistory(prev => prev.map(item =>
              item.id === tempId ? { ...item, saveError: true, isTemp: false } : item
            ));
            setHistoryImages(prev => prev.map(item =>
              item.id === tempId ? { ...item, saveError: true, isTemp: false } : item
            ));
          });

      } else {
        alert(t('superIP.alerts.imageGenFailNoUrl'));
      }

    } catch (error) {
      console.error('图片生成失败:', error);
      alert('图片生成失败: ' + (error.response?.data?.detail || error.message));
    } finally {
      setIsGenerating(false);
    }
  };

  // 初始化：加载历史图片
  useEffect(() => {
    loadHistoryImages();
  }, []);

  // 初始化：加载历史音频
  useEffect(() => {
    loadVoiceHistory();
  }, []);

  // 初始化：加载历史视频
  useEffect(() => {
    loadVideoHistory();
  }, []);

  // 删除历史图片记录
  const handleDeleteHistoryImage = async (recordId, fileUrl, e) => {
    e.stopPropagation(); // 阻止触发图片选择

    if (!window.confirm(t('superIP.dialogs.confirmDelete') || '确定要删除这张图片吗？')) {
      return;
    }

    try {
      console.log('🗑️ 开始删除历史记录:', recordId);

      // 使用 useAuth hook 检查用户登录状态
      if (!user) {
        console.error('❌ 用户未登录');
        alert('请先登录');
        return;
      }
      console.log('✅ 用户已登录:', user.email || user.id);

      // 调用后端删除接口（会同时删除数据库记录和Supabase存储）
      await historyService.deleteHistoryRecord(recordId);

      console.log('✅ 删除成功');

      // 从本地状态中移除
      setHistoryImages(prev => prev.filter(item => item.id !== recordId));

      // 清除缓存
      setHistoryCache(new Map());

      // 如果删除的是当前选中的图片，清空选中状态
      if (characterFileUrl === fileUrl) {
        setCharacterFile('');
        setCharacterFileUrl(null);
        setSelectedImage(null);
      }

    } catch (error) {
      console.error('❌ 删除失败:', error);
      const msg = (error && error.message) ? String(error.message) : '';
      // 针对 404/403 的友好处理：刷新列表以与服务器同步
      if (msg.includes('not belong') || msg.includes('属于') || msg.includes('not found')) {
        // 与服务器同步状态：重新拉取历史记录
        await loadHistoryImages(false);
        // 本地兜底移除（避免残留）
        setHistoryImages(prev => prev.filter(item => item.id !== recordId));
        alert((t('superIP.alerts.deleteNotOwnedOrMissing') || '记录不存在或不属于当前账号，已为你刷新列表'));
      } else {
        alert((t('superIP.alerts.deleteFailed') || '删除失败') + ': ' + msg);
      }
    }
  };

  // 删除历史音频记录
  const handleDeleteVoiceHistory = async (recordId, fileUrl, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(t('superIP.dialogs.confirmDelete') || '确定要删除这个音频吗？')) return;

    try {
      // 使用 useAuth hook 检查用户登录状态
      if (!user) {
        console.error('❌ 用户未登录，user:', user);
        alert('请先登录');
        return;
      }
      
      // 额外检查 localStorage 中的 token
      const token = localStorage.getItem('token');
      console.log('🔍 用户登录状态检查:', { user: !!user, token: !!token });
      if (!token) {
        console.error('❌ localStorage 中没有找到 token');
        alert('认证已过期，请重新登录');
        return;
      }

      await historyService.deleteHistoryRecord(recordId);

      // 本地移除并清缓存
      setVoiceHistory(prev => prev.filter(i => i.id !== recordId));
      setHistoryCache(prev => {
        const next = new Map(prev);
        next.delete('superip_voice_history');
        return next;
      });

      // 如果当前上传/结果正在引用该音频，清理引用
      if (voiceFileUrl === fileUrl) {
        setVoiceFile('');
        setVoiceFileUrl(null);
        setAudioDuration(5);
      }
      if (generatedAudio === fileUrl) {
        setGeneratedAudio(null);
      }
    } catch (error) {
      console.error('❌ 删除音频历史失败:', error);
      
      // 检查是否是认证错误
      if (error.response && error.response.status === 401) {
        alert('登录已过期，请重新登录');
        // 可以考虑清除本地存储的token并重定向到登录页
        localStorage.removeItem('token');
        return;
      }
      
      const msg = (error && error.message) ? String(error.message) : '';
      // 404/403 同步刷新
      if (msg.includes('not belong') || msg.includes('属于') || msg.includes('not found')) {
        await loadVoiceHistory(false);
        setVoiceHistory(prev => prev.filter(i => i.id !== recordId));
        alert(t('superIP.alerts.deleteNotOwnedOrMissing') || '记录不存在或不属于当前账号，已为你刷新列表');
      } else {
        alert((t('superIP.alerts.deleteFailed') || '删除失败') + ': ' + msg);
      }
    }
  };

  // 删除历史视频记录
  const handleDeleteVideoHistory = async (recordId, fileUrl, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(t('superIP.dialogs.confirmDelete') || '确定要删除这个视频吗？')) return;

    try {
      // 使用 useAuth hook 检查用户登录状态
      if (!user) {
        alert('请先登录');
        return;
      }

      await historyService.deleteHistoryRecord(recordId);

      // 本地移除并清缓存
      setVideoHistory(prev => prev.filter(i => i.id !== recordId));
      setHistoryCache(prev => {
        const next = new Map(prev);
        next.delete('superip_video_history');
        return next;
      });

      // 若结果区或小缩略正在引用该视频，可按需清理（目前仅预览，不做清理）
    } catch (error) {
      console.error('❌ 删除视频历史失败:', error);
      const msg = (error && error.message) ? String(error.message) : '';
      if (msg.includes('not belong') || msg.includes('属于') || msg.includes('not found')) {
        await loadVideoHistory(false);
        setVideoHistory(prev => prev.filter(i => i.id !== recordId));
        alert(t('superIP.alerts.deleteNotOwnedOrMissing') || '记录不存在或不属于当前账号，已为你刷新列表');
      } else {
        alert((t('superIP.alerts.deleteFailed') || '删除失败') + ': ' + msg);
      }
    }
  };

  const handleFileChange = async (e, type) => {
    if (type === 'character') {
      await handleImageUpload(e);
    } else if (type === 'voice') {
      await handleAudioUpload(e);
    }
  };

  const truncateFileName = (name, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + '...';
  };

  const handleImageSelect = (imageUrl) => {
    // 只设置到上传框，不在结果区域显示
    setSelectedImage(imageUrl);
    setCharacterFile('selected_character.png');
    setCharacterFileUrl(imageUrl);
    // 历史/图库选择不具备 RunningHub fileName，明确重置，确保后续生成使用当前URL轨迹
    setCharacterFileNameRH(null);
    setIsDialogOpen(false);
  };

  // 从历史记录选择音频：将音频URL放入“上传”框（与图片行为一致）
  const handleVoiceSelect = async (audioUrl) => {
    // 只设置到上传框，不在结果区域显示
    setVoiceFile('selected_voice.mp3');
    setVoiceFileUrl(audioUrl);
    
    // 获取音频时长
    setIsCalculatingDuration(true);
    try {
      const d = await getAudioDuration(audioUrl);
      console.log(`📊 选中历史音频时长: ${d}秒`);
      setAudioDuration(d);
    } finally {
      setIsCalculatingDuration(false);
    }
  };

  // 复刻：校验并上传到后端（后端再转传 minimaxi）
  const handleCloneFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 校验后缀
    const lower = file.name.toLowerCase();
    const ok = lower.endsWith('.mp3') || lower.endsWith('.m4a') || lower.endsWith('.wav');
    if (!ok) { alert('Only mp3/m4a/wav are allowed'); return; }
    // 校验大小 <=20MB
    if (file.size > 20 * 1024 * 1024) { alert('File too large (>20MB)'); return; }
    // 校验时长 10s~300s
    try {
      const obj = URL.createObjectURL(file);
      const audio = new Audio(obj);
      await new Promise((resolve, reject) => {
        audio.addEventListener('loadedmetadata', () => resolve());
        audio.addEventListener('error', () => reject(new Error('Failed to read audio metadata')));
      });
      const dur = Math.ceil(audio.duration || 0);
      URL.revokeObjectURL(obj);
      if (dur < 10 || dur > 300) { alert('Audio duration must be between 10s and 300s'); return; }
      setCloneFileDuration(dur);
    } catch (err) {
      console.warn('Audio metadata check failed', err);
    }
    // 上传到后端
    setCloneUploading(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('file', file);
      const resp = await axios.post(API_ENDPOINTS.voice.clone.upload, fd, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = resp.data || {};
      const fid = data?.file?.file_id || data?.file_id || data?.data?.file_id || '';
      if (!fid) throw new Error('Upload failed: no file_id');
      setCloneFile(file);
      setCloneFileId(fid);
    } catch (err) {
      console.error('Clone upload failed', err);
      alert('Upload failed');
    } finally {
      setCloneUploading(false);
    }
  };

  const doVoiceClone = async () => {
    if (!cloneFileId) { alert('Please upload an audio file for cloning first'); return; }
    setIsCloning(true);
    setCloneNameError(''); // 清除之前的错误
    try {
      const token = localStorage.getItem('token');
      const payload = { file_id: cloneFileId, text: "This voice sounds natural and pleasant." };
      // 允许用户点击“修改系统默认命名”后自定义 voice_id
      // 验证命名规则: 8-256字符, 字母开头, 仅含字母/数字/-/_
      const trimmedName = (cloneVoiceIdInput || '').trim();
      const isValidName = trimmedName.length >= 8 && trimmedName.length <= 256 && /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(trimmedName);
      
      if (cloneAllowEditName && trimmedName) {
        if (isValidName) {
          payload.voice_id = trimmedName;
          payload.auto_name = false;
        } else {
          payload.auto_name = true;
          setCloneNameError('命名格式不符合规则(8-256字符,字母开头,仅含字母/数字/-/_), 已使用系统默认命名');
        }
      } else {
        payload.auto_name = true;
      }
      const resp = await axios.post(API_ENDPOINTS.voice.clone.preview, payload, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const result = resp.data || {};
      // 兼容多种返回结构提取音频
      let audioUrl = result?.data?.audio || result?.audio || result?.url || '';
      if (!audioUrl && result?.output && Array.isArray(result.output)) {
        const first = result.output.find(x => x.audio || x.url);
        audioUrl = first?.audio || first?.url || '';
      }
      if (audioUrl) {
        setCloneAudioUrl(audioUrl);
        // 若后端返回最终使用的 voice_id，填充显示
        if (result.voice_id && !cloneAllowEditName) {
          setCloneVoiceIdInput(result.voice_id);
        }
        // 将克隆得到的 voice_id 用于“生成”按钮的可用性与积分显示
        // 优先使用后端返回的 voice_id；若用户自定义了名称则使用自定义 ID
        // 优先使用用户自定义的 voice_id（当开启了“修改系统默认命名”）
        // 若未自定义，则采用后端返回的 result.voice_id；最后再退回输入框值
        const vid = (cloneAllowEditName && cloneVoiceIdInput && cloneVoiceIdInput.trim())
          ? cloneVoiceIdInput.trim()
          : (result.voice_id || cloneVoiceIdInput || '');
        if (vid) {
          setVoiceId(vid);
        }
      } else {
        alert(result?.error || 'Clone preview failed');
      }
    } catch (err) {
      console.error('Clone preview failed', err);
      alert('Clone preview failed');
    } finally {
      setIsCloning(false);
    }
  };

  const clearClone = () => {
    setCloneFile(null);
    setCloneFileId('');
    setCloneFileDuration(0);
    setCloneAudioUrl('');
    setCloneVoiceIdInput('');
    setCloneAllowEditName(false);
    // 若当前 voiceId 来源为克隆（没有选择音色且没有波形），一并清除以便重新选择任一模块
    if (!overrideVoiceId && !hasWaveform) {
      setVoiceId('');
    }
  };

  // 安全格式化时间，避免 undefined 访问错误
  const safeFormatTime = (record) => {
    try {
      if (!record) return '';
      const ts = record.timestamp;
      if (ts instanceof Date) return ts.toLocaleTimeString();
      if (typeof ts === 'string' || typeof ts === 'number') {
        const d = new Date(ts);
        if (!isNaN(d.getTime())) return d.toLocaleTimeString();
      }
      const created = record.created_at;
      if (created) {
        const d2 = new Date(created);
        if (!isNaN(d2.getTime())) return d2.toLocaleTimeString();
      }
      return '';
    } catch {
      return '';
    }
  };

  const handleClear = () => {
    // 清除提示词和生成结果图片
    setTextInput('');
    setGeneratedImage(null);
    // 注意：不清除上传框中选择的图片（selectedImage, characterFile等）
  };

  // 处理后端返回的音色数据，确保每个分类是数组
  const processVoiceData = (voicesData) => {
    if (!voicesData || typeof voicesData !== 'object' || Array.isArray(voicesData)) {
      return {};
    }
    const processed = {};
    Object.keys(voicesData).forEach(key => {
      processed[key] = Array.isArray(voicesData[key]) ? voicesData[key] : [];
    });
    return processed;
  };

  // 获取可选音色列表
  const fetchVoices = async () => {
    try {
      const token = localStorage.getItem('token');
      // 尝试解码 token 以获取当前用户ID，用于过滤自定义音色
      const parseJwt = (t) => {
        try {
          const base64 = t.split('.')[1];
          if (!base64) return null;
          const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
          return JSON.parse(json);
        } catch (e) {
          return null;
        }
      };
      const payload = token ? parseJwt(token) : null;
      const currentUserId = payload?.sub || payload?.user_id || payload?.id || payload?.auth_id || payload?.uid || null;
      const response = await axios.get(API_ENDPOINTS.voice.allAudio, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Load user's custom voices registry from backend
      let myCustomVoiceIds = [];
      let myCloneVoiceIds = [];
      try {
        const regResp = await axios.get(API_ENDPOINTS.voice.custom, { headers: { 'Authorization': `Bearer ${token}` } });
        if (regResp.data && Array.isArray(regResp.data.voices)) {
          myCustomVoiceIds = regResp.data.voices.map(v => v.voice_id);
          myCloneVoiceIds = regResp.data.voices.filter(v => (v.source_type === 'clone' || v.source_type === 'cloning')).map(v => v.voice_id);
        }
      } catch (e) {
        console.warn('Failed to fetch custom voice registry', e);
      }
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        const raw = { ...response.data };
        // Build custom bucket based on registry (voice_generation items user actually owns)
        const generationList = Array.isArray(raw.voice_generation) ? raw.voice_generation : [];
        const cloningList = Array.isArray(raw.voice_cloning) ? raw.voice_cloning : [];
        const systemList = Array.isArray(raw.system_voice) ? raw.system_voice : [];
  const myGeneration = generationList.filter(v => myCustomVoiceIds.includes(v.voice_id));
  const externalOthers = generationList.filter(v => !myCustomVoiceIds.includes(v.voice_id));
  // 改进：克隆列表直接展示后端返回的 voice_cloning（当前用户的克隆记录），不依赖注册表
  const myClones = cloningList;

        const merged = {
          system_voice: systemList,
          voice_generation: externalOthers, // still available but not marked as custom
          custom: myGeneration,
          clone: myClones
        };
        setAvailableVoices(merged);
      } else {
        setAvailableVoices({});
      }
    } catch (err) {
      console.error('获取音色列表失败:', err);
      setAvailableVoices({});
    }
  };

  useEffect(() => { fetchVoices(); }, []);

  // 声音波形动画：仅在生成试听音频时动画（正式合成不引起动画）
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    const bars = 40;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f5f5dc';

      for (let i = 0; i < bars; i++) {
        const barHeight = (isGeneratingTrial)
          ? Math.random() * canvas.height * 0.7 + canvas.height * 0.15
          : canvas.height * 0.1;
        const x = (i * canvas.width) / bars;
        const y = (canvas.height - barHeight) / 2;
        const barWidth = (canvas.width / bars) * 0.7;

        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [isGeneratingTrial]);

  const handleStartRecording = () => {
    // 如果已有试听音频，点击左侧按钮优先进行试听播放
    if (trialAudio) {
      // 如果正在播放，则暂停
      if (isPlayingTrial && trialAudioRef.current) {
        trialAudioRef.current.pause();
        setIsPlayingTrial(false);
        return;
      }
      // 否则开始播放
      playHexAudio(trialAudio);
      return;
    }
    // 若未有试听音频，保持原交互（仅在未选择音色且已有图片时可手动触发/演示波形）
    if (selectedVoice) return;
    // 用户点击波形入口时，提前标记 hasWaveform 为 true，用于立即禁用“选择音色”和“克隆”模块
    setHasWaveform(true);
    setIsGenerating(!isGenerating);
  };

  const handleSelectVoice = (voice) => {
    // 允许随时选择音色覆盖当前试听得到的 voice_id
    setSelectedVoice(voice);
    const vid = voice.voice_id || voice.id; // 若数据源带 voice_id 用它，否则用 id
    setOverrideVoiceId(vid);
    setIsVoiceDialogOpen(false);
  };

  const handleClearVoice = () => {
    setVoiceText('');
    setSelectedVoice(null);
    setOverrideVoiceId('');
    // 保留 analyzedPrompt 方便继续合成，只清除试听与生成相关
    setTrialAudio('');
    setVoiceId('');
    setHasWaveform(false);
    // 也清空生成结果区域中的音频
    setGeneratedAudio(null);
  };

  // 仅清除已选择的音色（不影响提示词、试听等）
  const handleUnselectVoice = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setSelectedVoice(null);
    setOverrideVoiceId('');
  };

  // 清除当前激活的来源：若有试听生成的 voiceId / trialAudio 则清除；若有选中的系统/自定义音色则取消选择
  const handleClearCurrentVoiceSource = () => {
    // 停止播放
    stopAudio();
    // 仅清除波形区域（试听）相关状态，不影响已选择的系统/自定义音色
    setTrialAudio('');
    setVoiceId('');
    setHasWaveform(false);
    setAnalyzedPrompt('');
    setModalPrompt('');
  };

  // 调用后端分析角色图片以生成音色提示词
  // analyzeVoiceFromCharacter 支持可选的 prompt 参数（用于从弹窗传入 prompt）
  const analyzeVoiceFromCharacter = async (promptArg) => {
    if (!characterFileUrl) {
      alert(t('superIP.alerts.needCharacterImage'));
      return;
    }
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const payload = { image_url: characterFileUrl };
      if (promptArg && promptArg.trim()) payload.prompt = promptArg;
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.voice.design, payload, {
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      const result = response.data;
      // 如果返回了 choices，优先使用返回的提示词；否则，如果传入了 promptArg，将其作为分析提示
      let prompt = '';
      if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
        prompt = result.choices[0].message.content;
      } else if (promptArg && promptArg.trim()) {
        prompt = promptArg;
      }

      if (prompt) {
        setAnalyzedPrompt(prompt);
        setModalPrompt(prompt);
        // 不再自动填充工作台的输入文本 voiceText，保持用户原有输入
        // 注意：分析完成不代表已生成可用波形/voice_id，不设置 hasWaveform
        return prompt;
      } else {
        alert(t('superIP.alerts.analyzeInvalid'));
        return '';
      }
    } catch (error) {
      console.error('角色图片分析失败:', error);
      alert(t('superIP.alerts.analyzeFail'));
      return '';
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 当角色图片上传/选择后，自动触发分析；分析中禁用“生成”按钮并显示“分析中...”
  // 角色图片变化时只重置状态，不再自动分析，等待用户点击“生成”按钮再分析
  useEffect(() => {
    if (characterFileUrl) {
      setAnalyzedPrompt('');
      setModalPrompt('');
      setTrialAudio('');
      setVoiceId('');
      setHasWaveform(false);
    }
  }, [characterFileUrl]);

  // 组件卸载时清理音频引用
  useEffect(() => {
    return () => {
      // 清理试听音频
      if (trialAudioRef.current) {
        trialAudioRef.current.pause();
        trialAudioRef.current = null;
      }
      // 清理历史音频
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 生成试听音频（/api/avatar/shiting）使用 analyzedPrompt 作为 prompt，trialText 作为 text
  // generateTrialAudio 支持可选 prompt 参数（优先使用传入的 prompt）
  const generateTrialAudio = async (promptArg) => {
    // 试听使用分析得到的提示词或传入的 prompt，不再回退到工作台的 voiceText
    const prompt = promptArg || analyzedPrompt || '';
    if (!prompt) {
      alert(t('superIP.alerts.needAnalyzeOrPrompt'));
      return;
    }
    if (!trialText || trialText.trim() === '') {
      alert(t('superIP.alerts.needTrialText'));
      return;
    }
    if (isGeneratingTrial) return;
    setIsGeneratingTrial(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.avatar.shiting, {
        prompt: prompt,
        text: trialText
      }, {
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      const result = response.data;
      // 兼容多种返回结构，提取 voiceId
      const extractedVoiceId = result.voice_id
        || result.voiceId
        || result?.voice?.id
        || result?.data?.voice_id
        || result?.data?.voiceId
        || '';

      if (result.trial_audio) setTrialAudio(result.trial_audio);
      if (extractedVoiceId) setVoiceId(extractedVoiceId);
      setHasWaveform(!!result.trial_audio);
      // 强制保持静音与暂停状态：生成成功后不自动播放，避免图标一秒闪动
      try {
        if (trialAudioRef.current) {
          trialAudioRef.current.pause();
          trialAudioRef.current = null;
        }
      } catch {}
      setIsPlayingTrial(false);
      // 返回实际的试听音频字符串或URL，便于调用方直接播放
      return result.trial_audio || '';
    } catch (error) {
      console.error('试听音频生成失败:', error);
      alert(t('superIP.alerts.trialFail'));
      return '';
    } finally {
      setIsGeneratingTrial(false);
    }
  };

  // 隐藏式生成：在后台执行分析 -> 设置固定英文试听文本 -> 生成试听并自动播放
  const handleHiddenGenerate = async () => {
    // 需要图片
    if (!characterFileUrl) {
      alert(t('superIP.alerts.needCharacterImage'));
      return;
    }

    // 如果已选择音色或覆盖 voiceId，则不执行隐藏流程（保持原有限制）
    if (selectedVoice || overrideVoiceId) {
      alert(t('superIP.alerts.clearVoiceFirst') || '请先清除已选择的音色');
      return;
    }

    try {
      // 用户点击“生成(隐藏式)”时，提前标记 hasWaveform 为 true，使“选择音色/克隆”立即禁用
      setHasWaveform(true);
      // 分析图片以获得 prompt（如果已有 analyzedPrompt，会复用）
      let prompt = analyzedPrompt;
      if (!prompt) {
        prompt = await analyzeVoiceFromCharacter();
      }
      if (!prompt) {
        // analyzeVoiceFromCharacter 已展示提示
        return;
      }

      // 隐藏式固定试听文本（英语）
      const hiddenTrialText = "Hey! I'm in a great mood today. How about you?";
      setTrialText(hiddenTrialText);

      // 生成试听音频（在后台）
      setIsGeneratingTrial(true);
      const audioResult = await generateTrialAudio(prompt);
      // generateTrialAudio 已设置 trialAudio/voiceId/hasWaveform

      // 不自动播放：保持暂停图标，等待用户主动点击试听
      setIsPlayingTrial(false);

    } catch (err) {
      console.error('隐藏式生成失败:', err);
      alert(t('superIP.alerts.trialFail'));
    } finally {
      setIsGeneratingTrial(false);
    }
  };

  // 播放 hex 字符串形式的试听音频
  const playHexAudio = (hexString) => {
    try {
      // 如果当前正在播放，先停止
      if (trialAudioRef.current) {
        trialAudioRef.current.pause();
        trialAudioRef.current = null;
      }

      const bytes = new Uint8Array(hexString.length / 2);
      for (let i = 0; i < hexString.length; i += 2) {
        bytes[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
      }
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      
      // 保存音频引用和设置事件监听器
      trialAudioRef.current = audio;
      setIsPlayingTrial(true);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setIsPlayingTrial(false);
        trialAudioRef.current = null;
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setIsPlayingTrial(false);
        trialAudioRef.current = null;
        alert(t('superIP.alerts.playFail'));
      };
      
      audio.play();
    } catch (err) {
      console.error('播放hex音频失败', err);
      setIsPlayingTrial(false);
      alert(t('superIP.alerts.playFail'));
    }
  };

  // 音频播放控制：切换播放时更换图标
  const audioRef = useRef(null);
  const [playingAudio, setPlayingAudio] = useState(''); // 当前播放中的音频URL

  const stopAudio = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    } finally {
      setPlayingAudio('');
    }
  };

  const playAudioUrl = (url) => {
    try {
      // 停止试听音频播放（如果正在播放）
      if (isPlayingTrial && trialAudioRef.current) {
        trialAudioRef.current.pause();
        trialAudioRef.current = null;
        setIsPlayingTrial(false);
      }

      // 如果正在播放同一个，执行停止
      if (playingAudio && playingAudio === url) {
        stopAudio();
        return;
      }
      // 若有其他播放，先停掉
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      setPlayingAudio(url);
      audio.play();
      audio.onended = () => stopAudio();
      audio.onerror = () => { stopAudio(); alert(t('superIP.alerts.playFail')); };
    } catch (err) {
      console.error('播放音频URL失败', err);
      alert(t('superIP.alerts.playFail'));
    }
  };

  // 最终合成音频并保存到历史（/api/audio/synthesize）
  const handleGenerateVoice = async () => {
    // 文本必须存在
    if (!voiceText || voiceText.trim() === '') return;
    // 需要有可用的 voice_id（来源：选择音色 overrideVoiceId 或 试听生成 voiceId）
    const effectiveVoiceId = overrideVoiceId || voiceId || (selectedVoice && selectedVoice.voice_id) || '';
    if (!effectiveVoiceId) {
      alert(t('superIP.alerts.needVoiceId'));
      return;
    }
    setIsGenerating(true);
    try {
  const token = localStorage.getItem('token');
  // 新规则：来源类型基于“是否来自选择音色面板”
  // 有 overrideVoiceId 表示来自选择音色（记为 system 以应用20积分）；
  // 否则使用波形生成得到的 voiceId（记为 waveform 以应用3000积分）
  const isFromSelection = !!overrideVoiceId;
  const source_type = isFromSelection ? 'system' : 'waveform';
  const requestBody = { text: voiceText, voice_id: effectiveVoiceId, source_type };
      const response = await axios.post(API_ENDPOINTS.audio.synthesize, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = response.data;
      // 解析返回的音频URL或二进制
      let audioUrl = null;
      if (result && result.data && result.data.audio) audioUrl = result.data.audio;
      else if (result && result.audio) audioUrl = result.audio;
      else if (result && result.url) audioUrl = result.url;

      if (audioUrl) {
        setGeneratedAudio(audioUrl);
        // 同步到“上传音色”框，使其显示为已上传可复用的音频
        setVoiceFileUrl(audioUrl);
        setVoiceFile('generated_audio.mp3');
        
        // 获取音频时长
        setIsCalculatingDuration(true);
        try {
          const d = await getAudioDuration(audioUrl);
          console.log(`📊 生成音频时长: ${d}秒`);
          setAudioDuration(d);
        } finally {
          setIsCalculatingDuration(false);
        }

        // 保存到历史记录并上传到supabase（使用 contentManager）
        await saveToHistory(audioUrl, 'audio', { prompt: analyzedPrompt || '', text: voiceText }, result);
        // 更新本地历史（补充 timestamp 字段，便于渲染）
        const newItem = { id: Date.now(), audio_url: audioUrl, text: voiceText, created_at: new Date().toISOString(), timestamp: new Date() };
        setVoiceHistory(prev => [newItem, ...prev]);
      } else {
        alert(t('superIP.alerts.genFail'));
      }
    } catch (error) {
      console.error('合成音频失败:', error);
      alert(t('superIP.alerts.genFail'));
    } finally {
      setIsGenerating(false);
      // 生成后刷新一次 required_credits，以便按钮从“1次免费”切换到“3000积分”
      refreshWaveformCost();
    }
  };

  const handleClearVideo = () => {
    setVideoPrompt('');
    // 同时清空生成结果小框
    setGeneratedVideo(null);
    // 清除生成的视频预览
    setPreviewVideoUrl('');
    setIsVideoPreviewOpen(false);
    // 清除任务面板中的结果
    if (superipTasks && superipTasks.length > 0) {
      superipTasks.forEach(t => removeTask('superip', t.id));
    }
    // 清除导航栏中的视频缩略图
    setVideoFile('');
    setVideoFileUrl(null);
  };

  // 生成视频：改为通过 TaskManager 提提交任务（page: 'superip'），由 TaskPanel 统一轮询与并发管理
  const handleGenerateVideo = async () => {
    // 并发上限：SuperIP 页面最多同时运行 3 个任务
    const runningCount = Number(activeCountByPage?.superip || 0);
    if (runningCount >= 3) {
      alert('最多同时运行 3 个任务');
      return;
    }
  const imgFileName = characterFileNameRH || characterFileUrl; // 优先使用 RunningHub fileName；回退公共URL
    const audFileName = voiceFileUrl;     // RunningHub fileName
    if (!imgFileName || !audFileName) {
      alert(t('superIP.alerts.needCharacterImage'));
      return;
    }

    // 检查用户权限和积分
    if (!user) {
      alert(t('superIP.alerts.pleaseLogin') || '请先登录');
      return;
    }

    // Free用户不能使用此功能
    if (user.tier === 'Free') {
      alert(t('superIP.alerts.upgradeRequired') || '此功能需要升级到Creator计划或更高');
      return;
    }

    // 积分结算改为按运行时长在后端进行，不再基于音频时长进行前置拦截

    // 默认提示词
  const defaultPrompt = "Ultra-realistic live-action style. A professional male doctor in his late 50s, speaking confidently into a microphone. Medium close-up shot at eye level, with a softly blurred clean background. Lighting is natural and balanced, highlighting facial details.Performance: His expressions and gestures flow smoothly and naturally, synchronized with his speech...";

    // 如果用户在工作台文本框写了提示词，使用用户的提示词；否则使用默认提示词
    const finalPrompt = videoPrompt && videoPrompt.trim() ? videoPrompt.trim() : defaultPrompt;

    // 通过 TaskManager 提交任务，统一由 TaskPanel 展示进度与结果
    // 防抖：提交开始后立刻加锁，避免短时间内重复点击导致并发提交
    setIsGeneratingVideo(true);
    try {
      const params = {
        image_file_name: imgFileName,
        audio_file_name: audFileName,
        prompt: finalPrompt,
        duration: audioDuration,
      };
      await startTask({ page: 'superip', prompt: finalPrompt, params });
      // 轻量提示：结果将出现在下方任务面板中
      setIsGeneratingVideo(false);
    } catch (err) {
      console.error('提交 SuperIP 任务失败:', err);
      alert(err?.message || t('superIP.alerts.genFail'));
      setIsGeneratingVideo(false);
    }
  };

  // 顶部导航“发送”按钮：默认提示词并用上传的图像+音频生成视频
  const handleQuickSend = async () => {
    // 并发上限：SuperIP 页面最多同时运行 3 个任务
    const runningCount = Number(activeCountByPage?.superip || 0);
    if (runningCount >= 3) {
      alert('最多同时运行 3 个任务');
      return;
    }
    // 取消基于“正在计算音频时长”的前置阻塞，后端按运行时长结算
    const imgUrl = characterFileUrl;
    const audUrl = voiceFileUrl;
    if (!imgUrl || !audUrl) {
      alert(t('superIP.alerts.needCharacterImage'));
      return;
    }

    // 音频时长上限校验（仅限制用于生成视频，不影响音频本身生成）
    const MAX_VIDEO_AUDIO_DURATION = 600; // 秒
    if (audioDuration && audioDuration > MAX_VIDEO_AUDIO_DURATION) {
      alert(`Audio duration ${audioDuration}s exceeds ${MAX_VIDEO_AUDIO_DURATION}s. Video generation failed.`);
      return;
    }

    // 检查用户权限和积分
    if (!user) {
      alert(t('superIP.alerts.pleaseLogin') || '请先登录');
      return;
    }

    // Free用户不能使用此功能
    if (user.tier === 'Free') {
      alert(t('superIP.alerts.upgradeRequired') || '此功能需要升级到Creator计划或更高');
      return;
    }

    // 积分结算改为按运行时长在后端进行，不再基于音频时长进行前置拦截

    const defaultPrompt = "Ultra-realistic live-action style. A professional male doctor in his late 50s, speaking confidently into a microphone. Medium close-up shot at eye level, with a softly blurred clean background. Lighting is natural and balanced, highlighting facial details.Performance: His expressions and gestures flow smoothly and naturally, synchronized with his speech...";
    
    // 使用 TaskManager 提交异步任务
    setNavVideoLoading(true);
    try {
      const params = {
        image_file_name: (characterFileNameRH || imgUrl),
        audio_file_name: audUrl,
        prompt: defaultPrompt,
        duration: audioDuration,
        source: 'quickSend'
      };
      
      await startTask({ page: 'superip', prompt: defaultPrompt, params });
      
      // 任务已提交，后续状态由 TaskPanel 和 useEffect 自动处理
      
    } catch (err) {
      console.error('快速发送生成失败:', err);
      alert(err?.message || t('superIP.alerts.genFail'));
    } finally {
      setNavVideoLoading(false);
    }
  };

  // 监听 TaskManager 中 superip 成功任务，自动把最新成功结果回填到导航状态框和 RESULT 展示区域
  useEffect(() => {
    try {
      if (!Array.isArray(superipTasks)) return;
      const succeeded = superipTasks.filter(t => t.status === 'success');
      if (!succeeded.length) return;
      // 选择最近创建的成功任务
      const latest = succeeded.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
      const url = latest.supabaseUrl || latest.resultUrl;
      if (url && typeof url === 'string') {
        // 更新结果预览
        setVideoFileUrl(url);
        setGeneratedVideo(url);
        if (!videoFile) setVideoFile('generated_video.mp4');

        // 立即更新右侧历史列表（无需刷新）
        // 去重：如果已存在同一URL则跳过
        const exists = videoHistory.some(item => item.videoUrl === url);
        if (!exists) {
          const newItem = {
            id: latest.recordId || Date.now(),
            videoUrl: url,
            prompt: latest.prompt || '',
            created_at: new Date().toISOString(),
            timestamp: new Date()
          };
          setVideoHistory(prev => [newItem, ...prev]);
          // 同步缓存，避免下一次读取仍旧是旧数据
          setHistoryCache(prev => {
            const next = new Map(prev);
            const cacheKey = 'superip_video_history';
            const current = next.get(cacheKey);
            const items = Array.isArray(current?.items) ? current.items : [];
            next.set(cacheKey, { items: [newItem, ...items] });
            return next;
          });
        }
      }
    } catch {}
  }, [superipTasks]);



  return (
    <div className="super-ip-container">
      {/* 页面标题 */}
      <div className="super-ip-header">
        <h1 className="super-ip-title">{t('superIP.title')}</h1>
        <p className="super-ip-subtitle">{t('superIP.subtitle')}</p>
      </div>

      {/* 顶部导航栏 */}
      <nav className="super-ip-nav">
        <div className="nav-tabs">
          {/* 选择角色 */}
          <div className="nav-group">
            <button
              onClick={() => setActiveTab('character')}
              className={`nav-tab ${activeTab === 'character' ? 'active' : ''}`}
            >
              <svg className="nav-icon1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {t('superIP.nav.chooseCharacter')}
            </button>

            <div className="upload-box-wrapper">
              <input
                type="file"
                id="character-upload"
                className="upload-input"
                onChange={(e) => handleFileChange(e, 'character')}
                accept="image/*"
                ref={characterInputRef}
              />
              <label
                htmlFor="character-upload"
                className={`upload-box ${characterFile ? 'uploaded' : ''} ${selectedImage ? 'has-preview' : ''}`}
                title={characterFile}
                style={selectedImage ? {
                  backgroundImage: `url(${selectedImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {}}
              >
                {imageUploading ? (
                  <>
                    <div className="spinner-small"></div>
                    <span className="upload-text">...</span>
                  </>
                ) : characterFile && !selectedImage ? (
                  <>
                    <svg className="check-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="upload-text">{truncateFileName(characterFile, 12)}</span>
                  </>
                ) : !selectedImage ? (
                  <>
                    <svg className="upload-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="upload-text">{t('superIP.nav.uploadCharacter')}</span>
                  </>
                ) : null}
              </label>
              {characterFile && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setCharacterFile('');
                    setCharacterFileUrl(null);
                    // 清除 RunningHub fileName，避免后续仍引用上一张图片的响应数据
                    setCharacterFileNameRH(null);
                    setSelectedImage(null);
                    // 清理分析/试听状态，允许重新上传并重新分析
                    setAnalyzedPrompt('');
                    setModalPrompt('');
                    setTrialAudio('');
                    setVoiceId('');
                    setHasWaveform(false);
                    if (characterInputRef.current) characterInputRef.current.value = '';
                  }}
                  className="remove-btn"
                  title="取消上传"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 选择音色 */}
          <div className="nav-group">
            <button
              onClick={() => setActiveTab('voice')}
              className={`nav-tab ${activeTab === 'voice' ? 'active' : ''}`}
            >
              <svg className="nav-icon1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
              {t('superIP.nav.chooseVoice')}
            </button>

            <div className="upload-box-wrapper">
              <input
                type="file"
                id="voice-upload"
                className="upload-input"
                onChange={(e) => handleFileChange(e, 'voice')}
                accept="audio/*"
                ref={voiceInputRef}
              />
              <label
                htmlFor="voice-upload"
                className={`upload-box ${voiceFile ? 'uploaded' : ''} ${voiceFileUrl ? 'has-preview' : ''}`}
                title={voiceFile}
              >
                {voiceFile ? (
                  <>
                    <svg className="check-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="upload-text">{truncateFileName(voiceFile, 12)}</span>
                  </>
                ) : (
                  <React.Fragment>
                    <svg className="upload-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                    <span className="upload-text">{t('superIP.nav.uploadVoice')}</span>
                  </React.Fragment>
                )}
              </label>
              {voiceFile && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setVoiceFile('');
                    setVoiceFileUrl(null);
                    setAudioDuration(5);
                    if (voiceInputRef.current) voiceInputRef.current.value = '';
                  }}
                  className="remove-btn"
                  title="取消上传"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 生成视频 */}
          <div className="nav-group">
            <button
              onClick={() => setActiveTab('generate')}
              className={`nav-tab ${activeTab === 'generate' ? 'active' : ''}`}
            >
              <svg className="nav-icon1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              {t('superIP.nav.generateVideoTab')}
            </button>

            <div className={`upload-box ${videoFileUrl ? 'uploaded' : ''} video-status`}>
              {(() => {
                // 检查是否有正在运行的任务（优先显示最新任务的状态）
                const latestTask = superipTasks && superipTasks.length > 0 
                  ? [...superipTasks].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0] 
                  : null;
                const isRunning = latestTask && (latestTask.status === 'queued' || latestTask.status === 'running' || (latestTask.status === 'success' && !latestTask.supabaseUrl));
                
                if (navVideoLoading || isRunning) {
                  return (
                    <div className="loading-box">
                      <div className="spinner-small"></div>
                      <span className="loading-text">{t('superIP.work.loadingShort') || '生成中...'}</span>
                    </div>
                  );
                }
                
                if (videoFileUrl) {
                  return (
                    <div
                      className={`video-thumb-wrapper ${isNavThumbHover ? 'hovered' : ''}`}
                      title={t('superIP.work.playVideo')}
                      onClick={() => videoFileUrl && (setPreviewVideoUrl(videoFileUrl), setIsVideoPreviewOpen(true))}
                      onMouseEnter={() => setIsNavThumbHover(true)}
                      onMouseLeave={() => setIsNavThumbHover(false)}
                    >
                      <video src={videoFileUrl} preload="metadata" muted playsInline className="video-thumb-video" />
                      <div className="video-thumb-overlay"></div>
                      <div className="video-thumb-actions">
                        <button
                          className="video-thumb-play"
                          onClick={(e) => { e.stopPropagation(); if (videoFileUrl) { setPreviewVideoUrl(videoFileUrl); setIsVideoPreviewOpen(true); } }}
                          aria-label={t('superIP.work.playVideo')}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </button>
                      </div>
                      <div className="video-thumb-toolbar">
                        <button
                          onClick={(e) => { e.stopPropagation(); if (videoFileUrl) window.open(videoFileUrl, '_blank'); }}
                          className="video-thumb-download"
                          title={t('superIP.work.download')}
                        >{t('superIP.work.download')}</button>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <>
                    <svg className="upload-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    <span className="upload-text">{t('superIP.nav.videoStatus')}</span>
                  </>
                );
              })()}
            </div>
          </div>

          {/* 发送按钮（导航栏末尾） */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <button
              className="nav-tab"
              onClick={handleQuickSend}
              title={
                !user 
                  ? (t('superIP.alerts.pleaseLogin') || '请先登录')
                  : user.tier === 'Free'
                  ? (t('superIP.alerts.upgradeRequired') || '此功能需要升级到Creator计划或更高')
                  : !characterFileUrl || !voiceFileUrl
                  ? (t('superIP.alerts.needCharacterImage') || '请先上传角色图像和音频')
                  : (audioDuration && audioDuration > 600)
                  ? `Audio duration ${audioDuration}s exceeds 600s. Video generation failed.`
                  : (user.tier !== 'Enterprise' && user.credits < (30 * audioDuration))
                  ? `积分不足，需要 ${30 * audioDuration} 积分`
                  : (Number(activeCountByPage?.superip || 0) >= 3)
                  ? '最多同时运行 3 个任务'
                  : t('superIP.nav.quickSendTitle')
              }
              disabled={
                isGeneratingVideo || 
                navVideoLoading || 
                !user || 
                user.tier === 'Free' || 
                !characterFileUrl || 
                !voiceFileUrl ||
                (audioDuration && audioDuration > 600) ||
                (user.tier !== 'Enterprise' && user.credits < (30 * audioDuration)) ||
                (Number(activeCountByPage?.superip || 0) >= 3)
              }
              style={{
                opacity: (
                  isGeneratingVideo || 
                  navVideoLoading || 
                  !user || 
                  user.tier === 'Free' || 
                  !characterFileUrl || 
                  !voiceFileUrl ||
                  (audioDuration && audioDuration > 600) ||
                  (user.tier !== 'Enterprise' && user.credits < (30 * audioDuration)) ||
                  (Number(activeCountByPage?.superip || 0) >= 3)
                ) ? 0.5 : 1,
                cursor: (
                  isGeneratingVideo || 
                  navVideoLoading || 
                  !user || 
                  user.tier === 'Free' || 
                  !characterFileUrl || 
                  !voiceFileUrl ||
                  (audioDuration && audioDuration > 600) ||
                  (user.tier !== 'Enterprise' && user.credits < (30 * audioDuration)) ||
                  (Number(activeCountByPage?.superip || 0) >= 3)
                ) ? 'not-allowed' : 'pointer'
              }}
            >
              <svg className="nav-icon1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              {(isGeneratingVideo || navVideoLoading) ? (t('superIP.work.generatingVideo') || '生成中...') : t('superIP.nav.send')}
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <div className="super-ip-content">
        {activeTab === 'character' && (
          <div className="content-grid">
            {/* 工作区域 */}
            <div className="work-area">
              <div className="work-section">
                <h4 className="section-label">{t('superIP.work.chooseImage')}</h4>
                <button
                  className="gallery-btn"
                  onClick={() => {
                    console.log('🎯 打开历史图库弹窗');
                    console.log('📊 当前 historyImages 数量:', historyImages.length);
                    console.log('🔄 loadingHistory 状态:', loadingHistory);
                    setIsDialogOpen(true);
                    if (!loadingHistory && (!historyImages || historyImages.length === 0)) {
                      loadHistoryImages(true);
                    }
                  }}
                >
                  <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span>{t('superIP.work.openGallery')}</span>
                </button>
              </div>
              <div className="work-section">
                <h4 className="section-label">{t('superIP.work.inputPrompt')}</h4>
                <textarea
                  placeholder={t('superIP.work.promptPlaceholder')}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="textarea"
                />
                {/* 画幅比例选择已移除，保留下方按钮组布局 */}
              </div>

              <div className="button-group">
                <button onClick={handleClear} className="btn btn-secondary">
                  {t('superIP.work.clear')}
                </button>
                <button
                  onClick={handleGenerate}
                  className="btn btn-primary"
                  disabled={!textInput || !textInput.trim() || isGenerating}
                >
                  <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  {isGenerating ? t('superIP.work.generatingImage') : t('superIP.work.generateImage')}
                  {getCreditDisplay('superip_image_gen')}
                </button>
              </div>
            </div>

            {/* 结果展示区域 */}
            <div className="result-area">
              {isGenerating ? (
                <div className="result-placeholder">
                  <div className="spinner"></div>
                  <p className="generating-text">{t('superIP.work.generatingImage')}</p>
                </div>
              ) : generatedImage ? (
                <div className="result-content">
                  <h3 className="result-title">{t('superIP.work.result')}</h3>
                  <div className="result-image-wrapper">
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="result-image"
                      onClick={() => setEnlargedImage(generatedImage)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="result-placeholder">
                  <h3 className="placeholder-title">{t('superIP.placeholders.result')}</h3>
                  <p className="placeholder-text">{t('superIP.work.resultPlaceholderImage')}</p>
                </div>
              )}
            </div>

            {/* 历史记录（固定容器 + 滚动，最新在上）*/}
            <div className="history-area">
              <h3 className="history-title">{t('superIP.work.history')}</h3>
              <div className={`history-list ${isImageScrolling ? 'scrolling' : ''}`} onScroll={handleImageScroll}>
                {historyImages.length === 0 ? (
                  <p className="history-empty">{t('superIP.work.historyEmpty')}</p>
                ) : (
                  historyImages.map((record) => (
                    <div
                      key={record.id}
                      className="history-item"
                      onClick={() => {
                        // 仅放入上传框，不展示到结果区域
                        setSelectedImage(record.file_url);
                        setCharacterFile('selected_character.png');
                        setCharacterFileUrl(record.file_url);
                        // 历史点击时清除旧的 RunningHub fileName，确保双轨迹重新绑定
                        setCharacterFileNameRH(null);
                      }}
                    >
                      <img
                        src={record.file_url}
                        alt={record.prompt || 'History'}
                        className="history-image"
                      />
                      {record.prompt && (
                        <div className="history-item-prompt-overlay">
                          <p className="history-item-prompt">{record.prompt.substring(0, 20)}...</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="content-grid">
            {/* 工作区域 */}
            <div className="work-area">
              <div className="work-section">
                <h4 className="section-label">{t('superIP.work.waveform')}</h4>
                <div className="waveform-container">
                  <div className="waveform-canvas-wrapper">
                    {(isGeneratingTrial || hasWaveform) ? (
                      <canvas ref={canvasRef} width={400} height={40} className="waveform-canvas" />
                    ) : (
                      // 保持高度防止布局跳动
                      <div style={{ height: 40 }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={handleStartRecording}
                      disabled={(() => {
                        // 互斥：当选择音色或波形/试听存在时，禁用波形播放/录制
                        if (isGeneratingTrial) return true;
                        const hasSelection = !!selectedVoice || !!overrideVoiceId;
                        const hasClone = !!cloneFileId || !!cloneAudioUrl;
                        if (hasSelection || hasClone) return true;
                        return !trialAudio;
                      })()}
                      className="btn btn-primary btn-icon-only"
                      title={(() => {
                        if (selectedVoice || overrideVoiceId) return '已选择音色，需清除后才能播放试听';
                        if (cloneFileId || cloneAudioUrl) return '已存在克隆音色，需清除后才能播放波形试听';
                        return trialAudio ? (isPlayingTrial ? '暂停试听' : '播放试听') : '等待生成试听音频后可播放';
                      })()}
                    >
                      {isPlayingTrial ? (
                        <Pause size={18} />
                      ) : (
                        <Play size={18} />
                      )}
                    </button>
                    {/* 新增清除按钮：清除当前 voiceId 或选中音色 */}
                    <button
                      onClick={handleClearCurrentVoiceSource}
                      disabled={!(hasWaveform || trialAudio)}
                      className="btn btn-primary btn-icon-only"
                      title="清除试听结果"
                      aria-label="清除试听结果"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    {/* 使用“生成”按钮打开弹窗进行分析 + 生成试听；当已选择系统/自定义音色时禁用 */}
                    <button
                      onClick={async () => {
                        // 隐藏式流程：不打开弹窗，后台自动分析并生成试听然后播放
                        await handleHiddenGenerate();
                      }}
                      disabled={(() => {
                        // 互斥：当选择音色或克隆来源存在时，禁用分析/试听生成
                        if (isAnalyzing || isGenerating || isGeneratingTrial) return true;
                        if (!characterFileUrl) return true;
                        const hasSelection = !!selectedVoice || !!overrideVoiceId;
                        const hasClone = !!cloneFileId || !!cloneAudioUrl;
                        return hasSelection || hasClone;
                      })()}
                      className="btn btn-primary btn-icon-only"
                      title={(() => {
                        if (selectedVoice || overrideVoiceId) return '已选择音色，需清除后才能重新分析';
                        if (cloneFileId || cloneAudioUrl) return '已存在克隆音色，需清除后才能重新分析';
                        return '';
                      })()}
                    >
                      {isAnalyzing ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : isGeneratingTrial ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        t('superIP.work.generate')
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="work-section">
                <h4 className="section-label">{t('superIP.work.selectVoice')}</h4>
                <div style={{ position: 'relative' }}>
                  <button
                    className="voice-select-btn"
                    onClick={() => setIsVoiceDialogOpen(true)}
                    style={{ width: '100%' }}
                    disabled={(() => {
                      // 互斥：当波形/试听或克隆来源存在时，禁用选择音色（仅依据 hasWaveform/trialAudio，不以 voiceId 作为波形的代理）
                      const hasWave = !!trialAudio || !!hasWaveform;
                      const hasClone = !!cloneFileId || !!cloneAudioUrl;
                      return hasWave || hasClone;
                    })()}
                    title={(() => {
                      if (voiceId || trialAudio || hasWaveform) return '已有试听音色或波形，清除后才能选择系统/自定义音色';
                      if (cloneFileId || cloneAudioUrl) return '已有克隆音色，清除后才能选择系统/自定义音色';
                      return '';
                    })()}
                  >
                    <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    <span>{selectedVoice ? (selectedVoice.voice_name || selectedVoice.name) : t('superIP.work.selectVoice')}</span>
                  </button>
                  {selectedVoice && (
                    <button
                      onClick={handleUnselectVoice}
                      title={t('superIP.work.clearVoice')}
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#ccc',
                        fontSize: 16,
                        cursor: 'pointer'
                      }}
                      aria-label="清除音色"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* 声线复刻 */}
              <div className="work-section">
                <h4 className="section-label">{t('superIP.sections.voiceClone')}</h4>
                
                {/* 隐藏的文件输入 */}
                <input 
                  type="file" 
                  id="clone-upload-input"
                  accept=".mp3,.m4a,.wav" 
                  onChange={handleCloneFileChange} 
                  style={{ display: 'none' }}
                  ref={cloneInputRef}
                />

                {/* 主操作栏：模仿 Select Voice 样式 */}
                <div className={`clone-interface-box ${cloneFileId ? 'has-file' : ''}`}>
                  {/* 左侧：文件信息或上传提示 */}
                  <div 
                    className="clone-file-area" 
                    onClick={() => {
                      // 互斥：当选择音色或波形/试听存在时，禁止开始克隆上传
                      if (cloneFileId) return;
                      if (selectedVoice || overrideVoiceId || voiceId || trialAudio || hasWaveform) return;
                      // 重置 input 的值，确保可以选择同一个文件再次上传
                      if (cloneInputRef.current) cloneInputRef.current.value = '';
                      document.getElementById('clone-upload-input')?.click();
                    }}
                    title={(() => {
                      if (cloneFile) return cloneFile.name;
                      if (selectedVoice || overrideVoiceId) return '已选择音色，需清除后才能使用克隆';
                      if (voiceId || trialAudio || hasWaveform) return '已有波形/试听结果，需清除后才能使用克隆';
                      return '点击上传音频';
                    })()}
                    style={{ cursor: (selectedVoice || overrideVoiceId || voiceId || trialAudio || hasWaveform) ? 'not-allowed' : 'pointer' }}
                  >
                    {cloneUploading ? (
                      <div className="clone-status">
                        <Loader2 size={14} className="animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    ) : cloneFile ? (
                      <div className="clone-status">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18V5l12-2v13"></path>
                          <circle cx="6" cy="18" r="3"></circle>
                          <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                        <span className="file-name">{truncateFileName(cloneFile.name, 18)}</span>
                      </div>
                    ) : (
                      <div className="clone-status placeholder">
                        <Upload size={16} />
                        <span>{t('superIP.clone.selectFile')} (mp3/wav/m4a)</span>
                      </div>
                    )}
                  </div>

                  {/* 右侧：操作按钮组 (仅当有文件时显示) */}
                  {cloneFileId && (
                    <div className="clone-actions">
                      {/* 预览/重新生成按钮 */}
                      <button 
                        className="btn-icon-action" 
                        onClick={(e) => { e.stopPropagation(); doVoiceClone(); }} 
                        disabled={(() => {
                          // 放开在已存在克隆试听/voiceId 的情况下的重新生成，避免需要额外清理
                          // 仍保持与“已选择系统/自定义音色”互斥，以及正在克隆的加载态
                          if (isCloning) return true;
                          if (selectedVoice || overrideVoiceId) return true;
                          // 允许在 trial/voiceId/hasWaveform 存在时继续触发克隆的重新生成
                          return false;
                        })()}
                        title={cloneAudioUrl ? "重新生成" : "Preview Clone"}
                      >
                        {isCloning ? (
                          <Loader2 size={14} className="animate-spin"/> 
                        ) : cloneAudioUrl ? (
                          <RefreshCw size={14} />
                        ) : (
                          <Play size={14} />
                        )}
                      </button>

                      {/* 设置按钮 (齿轮) */}
                      <button 
                        className={`btn-icon-action ${isCloneSettingsOpen ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setCloneSettingsOpen(!isCloneSettingsOpen); }}
                        title={t('superIP.clone.settingsTitle')}
                      >
                        <Settings size={14} />
                      </button>

                      {/* 清除按钮 */}
                      <button 
                        className="btn-icon-action danger" 
                        onClick={(e) => { e.stopPropagation(); clearClone(); }}
                        title="清除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  {/* 设置弹窗 (绝对定位) */}
                  {isCloneSettingsOpen && (
                    <div className="clone-settings-popover" onClick={(e) => e.stopPropagation()}>
                      <div className="popover-header">
                        <span>{t('superIP.clone.customVoiceId')}</span>
                        <button className="popover-close" onClick={() => setCloneSettingsOpen(false)}>
                          <X size={12}/>
                        </button>
                      </div>
                      <div className="popover-body">
                        <p className="popover-desc">
                          {t('superIP.clone.settingsTitle')}：{t('superIP.clone.customVoiceId')}。
                          {lang === 'zh' 
                            ? '默认系统分配。如需自定义，请使用字母开头，仅限字母/数字/-/_ (8-256字符)。'
                            : lang === 'zh-TW' 
                              ? '默認系統分配。如需自定義，請使用字母開頭，僅限字母/數字/-/_ (8-256字元)。'
                              : lang === 'en' 
                                ? 'Default is system-assigned. To customize, start with a letter and use only letters/numbers/-/_ (8-256 characters).'
                                : 'Por defecto asignado por el sistema. Para personalizar, comienza con una letra y usa solo letras/números/-/_ (8-256 caracteres).'}
                        </p>
                        <div className="popover-input-row">
                          <input 
                            className="popover-input" 
                            value={cloneVoiceIdInput} 
                            onChange={e => { setCloneVoiceIdInput(e.target.value); setCloneNameError(''); }} 
                            placeholder={t('superIP.clone.autoNamePlaceholder')}
                          />
                          <button 
                            className="btn-primary btn-compact" 
                            onClick={() => { 
                              const trimmed = (cloneVoiceIdInput || '').trim();
                              const isValid = trimmed.length >= 8 && trimmed.length <= 256 && /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(trimmed);
                              if (trimmed && !isValid) {
                                setCloneNameError(lang === 'zh' ? '⚠️ 命名格式不符合规则，将使用系统默认命名' 
                                  : lang === 'zh-TW' ? '⚠️ 命名格式不符合規則，將使用系統預設命名'
                                  : lang === 'en' ? '⚠️ Invalid format, will use system default name'
                                  : '⚠️ Formato inválido, se usará el nombre predeterminado');
                              } else {
                                setCloneNameError('');
                              }
                              setCloneAllowEditName(!!cloneVoiceIdInput); 
                              setCloneSettingsOpen(false); 
                            }}
                          >
                            {lang === 'zh' ? '确定' : lang === 'zh-TW' ? '確定' : lang === 'en' ? 'Confirm' : 'Confirmar'}
                          </button>
                        </div>
                        {/* 实时验证提示 - 在弹窗内显示 */}
                        {cloneVoiceIdInput && (() => {
                          const trimmed = (cloneVoiceIdInput || '').trim();
                          const isValid = trimmed.length >= 8 && trimmed.length <= 256 && /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(trimmed);
                          if (!isValid) {
                            return (
                              <p style={{ color: '#ff4d4f', fontSize: 10, marginTop: 6, fontWeight: 'bold' }}>
                                {lang === 'zh' ? '⚠️ 格式不符: 需8-256字符，字母开头，仅限字母/数字/-/_' 
                                  : lang === 'zh-TW' ? '⚠️ 格式不符: 需8-256字元，字母開頭，僅限字母/數字/-/_'
                                  : lang === 'en' ? '⚠️ Invalid: 8-256 chars, start with letter, only letters/numbers/-/_'
                                  : '⚠️ Inválido: 8-256 caracteres, comenzar con letra, solo letras/números/-/_'}
                              </p>
                            );
                          }
                          return (
                            <p style={{ color: '#52c41a', fontSize: 10, marginTop: 6, fontWeight: 'bold' }}>
                              {lang === 'zh' ? '符合命名规范，点击确定保存voice_id' 
                                : lang === 'zh-TW' ? '符合命名規範，點擊確定保存voice_id'
                                : lang === 'en' ? 'Valid format, click Confirm to save voice_id' 
                                : 'Formato válido, haz clic en Confirmar para guardar voice_id'}
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* 试听播放器 (生成后显示) */}
                {cloneAudioUrl && (
                  <div className="clone-player-wrapper">
                    <CustomAudioPlayer src={cloneAudioUrl} />
                  </div>
                )}
                
                {/* 红字警告: 命名不符合规则 */}
                {cloneNameError && (
                  <p style={{ color: '#ff4d4f', fontSize: 11, marginTop: 6, marginLeft: 4, fontWeight: 'bold' }}>
                    ⚠️ {cloneNameError}
                  </p>
                )}
                
                <p style={{ color: '#666', fontSize: 11, marginTop: 6, marginLeft: 4 }}>
                  {t('superIP.clone.supportFormats')} mp3/m4a/wav{lang === 'zh' ? '，10s~300s，≤20MB' : lang === 'zh-TW' ? '，10s~300s，≤20MB' : lang === 'en' ? ', 10s~300s, ≤20MB' : ', 10s~300s, ≤20MB'}
                </p>
              </div>

              <div className="work-section">
                <h4 className="section-label">{t('superIP.work.inputText')}</h4>
                <textarea
                  placeholder={t('superIP.work.inputTextPlaceholder')}
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  className="textarea"
                  maxLength={3500}
                />
                <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',marginTop:6}}>
                  <small style={{color:'#999'}}>{voiceText.length}/3500</small>
                </div>
              </div>

              {/* 试听文本独立编辑区已移除，按照最新需求改为通过其他入口修改 */}

              <div className="button-group">
                <button onClick={handleClearVoice} className="btn btn-secondary">
                  {t('superIP.work.clear')}
                </button>
                <button
                  onClick={handleGenerateVoice}
                  className="btn btn-primary"
                  disabled={(() => {
                    // 必须文本和 voice_id
                    if (isGenerating || !voiceText || !(overrideVoiceId || voiceId)) return true;
                    // 登录与套餐限制
                    if (!user) return true;
                    if (user.tier === 'Free') return true; // Free 不可用
                    if (user.tier === 'Enterprise') return false; // 企业无限制
                    // Creator/Business：根据来源计算所需积分
                    const isFromSelection = !!overrideVoiceId; // 选择音色 => 动态计费
                    const units = (() => {
                      const n = voiceText.length || 0;
                      if (n <= 400) return 1;
                      if (n <= 800) return 2;
                      if (n <= 1200) return 3;
                      if (n <= 1600) return 4;
                      if (n <= 2000) return 5;
                      if (n <= 2400) return 6;
                      if (n <= 2800) return 7;
                      return 8; // 2800-3000
                    })();
                    const cost = isFromSelection ? (20 * units) : 3000;   // 波形/自定义 => 3000 积分
                    // Business 首次免费：前端无法精确判断，放行由后端最终校验
                    if (user.tier === 'Business' && !isFromSelection) {
                      // 若用户积分不足也允许点击，由后端决定是否享受首次免费
                      return false;
                    }
                    return (user.credits || 0) < cost;
                  })()}
                  title={(() => {
                    if (!user) return t('superIP.alerts.pleaseLogin') || '请先登录';
                    if (user.tier === 'Free') return t('superIP.alerts.upgradeRequired') || '此功能需要升级到Creator计划或更高';
                    const isFromSelection = !!overrideVoiceId;
                    const units = (() => {
                      const n = voiceText.length || 0;
                      if (n <= 400) return 1;
                      if (n <= 800) return 2;
                      if (n <= 1200) return 3;
                      if (n <= 1600) return 4;
                      if (n <= 2000) return 5;
                      if (n <= 2400) return 6;
                      if (n <= 2800) return 7;
                      return 8;
                    })();
                    const cost = isFromSelection ? (20 * units) : 3000;
                    if (user.tier === 'Enterprise') return '';
                    if (user.tier === 'Business' && !isFromSelection) {
                      // 首次免费提示
                      if ((user.credits || 0) < cost) return 'Business 首次免费，若已使用则需 3000 积分';
                      return '';
                    }
                    if ((user.credits || 0) < cost) {
                      return lang === 'zh' ? `积分不足，需要 ${cost} 积分` : lang === 'zh-TW' ? `積分不足，需要 ${cost} 積分` : lang === 'en' ? `Insufficient credits, need ${cost}` : `Créditos insuficientes, necesita ${cost}`;
                    }
                    return '';
                  })()}
                  style={{
                    cursor: (() => {
                      // 与 disabled 保持一致的视觉反馈
                      const disabled = (() => {
                        if (isGenerating || !voiceText || !(overrideVoiceId || voiceId)) return true;
                        if (!user) return true;
                        if (user.tier === 'Free') return true;
                        if (user.tier === 'Enterprise') return false;
                        const isFromSelection = !!overrideVoiceId;
                        const units = (() => {
                          const n = voiceText.length || 0;
                          if (n <= 400) return 1;
                          if (n <= 800) return 2;
                          if (n <= 1200) return 3;
                          if (n <= 1600) return 4;
                          if (n <= 2000) return 5;
                          if (n <= 2400) return 6;
                          if (n <= 2800) return 7;
                          return 8;
                        })();
                        const cost = isFromSelection ? (20 * units) : 3000;
                        if (user.tier === 'Business' && !isFromSelection) return 'pointer';
                        return (user.credits || 0) < cost ? 'not-allowed' : 'pointer';
                      })();
                      return disabled === true || disabled === 'not-allowed' ? 'not-allowed' : 'pointer';
                    })()
                  }}
                >
                  <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  {isGenerating ? t('superIP.work.generatingVoice') : t('superIP.work.generateVoice')}
                  {getDynamicVoiceCreditDisplay()}
                </button>
              </div>
            </div>

            {/* 结果展示区域 */}
            <div className="result-area">
              {generatedAudio ? (
                <div className="result-content">
                  <h3 className="result-title">{t('superIP.work.result')}</h3>
                  <div className="audio-result">
                    <div className="audio-visual">{t('superIP.work.generate')}</div>
                    <div className="audio-info">
                      <p className="audio-meta">音色: {selectedVoice?.name || overrideVoiceId || voiceId}</p>
                      <p className="audio-meta">文本: {voiceText.substring(0, 50)}{voiceText.length > 50 ? '...' : ''}</p>
                    </div>
                    <button className="btn btn-primary btn-full" onClick={() => playAudioUrl(generatedAudio)}>
                      {playingAudio === generatedAudio ? (
                        <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                      ) : (
                        <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      )}
                      {t('superIP.work.playAudio')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="result-placeholder">
                  <h3 className="placeholder-title">{t('superIP.placeholders.result')}</h3>
                  <p className="placeholder-text">{t('superIP.work.resultPlaceholderAudio')}</p>
                </div>
              )}
            </div>

            {/* 历史记录 */}
            <div className="history-area">
              <h3 className="history-title">{t('superIP.work.history')}</h3>
              <div className={`history-list ${isVoiceScrolling ? 'scrolling' : ''}`} onScroll={handleVoiceScroll}>
                {voiceHistory.length === 0 ? (
                  <p className="history-empty">{t('superIP.work.historyEmpty')}</p>
                ) : (
                  voiceHistory.map((item) => (
                    <div
                      key={item.id}
                      className={`voice-history-item ${voiceFileUrl === item.audio_url ? 'selected' : ''}`}
                      onClick={() => handleVoiceSelect(item.audio_url)}
                    >
                      <div className="voice-history-header" style={{ justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          </svg>
                          <span className="voice-name">{item.voiceName || selectedVoice?.name || overrideVoiceId || voiceId}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {item.audio_url && (
                            <button
                              className="voice-history-play-btn"
                              onClick={(e) => { e.stopPropagation(); playAudioUrl(item.audio_url); }}
                              title={playingAudio === item.audio_url ? '暂停' : '播放此音频'}
                            >
                              {playingAudio === item.audio_url ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="6" y="4" width="4" height="16"></rect>
                                  <rect x="14" y="4" width="4" height="16"></rect>
                                </svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              )}
                            </button>
                          )}
                          <button
                            className="voice-history-play-btn"
                            onClick={(e) => handleDeleteVoiceHistory(item.id, item.audio_url, e)}
                            title="删除此音频"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="voice-text" title={item.text}>{item.text}</p>
                      <p className="voice-time">{safeFormatTime(item)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="content-grid">
            {/* 工作区域 */}
            <div className="work-area">
              <div className="work-section">
                <h4 className="section-label">{t('superIP.work.inputPrompt')}</h4>
                <textarea
                  placeholder={t('superIP.work.generateTabPrompt')}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="text-input"
                  style={{ minHeight: '180px' }}
                />
              </div>

              <div className="button-group">
                <button onClick={handleClearVideo} className="btn btn-secondary">
                  {t('superIP.work.clear')}
                </button>
                <button
                  onClick={handleGenerateVideo}
                  className="btn btn-primary"
                  disabled={(() => {
                    if (!videoPrompt || !characterFileUrl || !voiceFileUrl) return true;
                    if (isGeneratingVideo || navVideoLoading) return true;
                    const running = Number(activeCountByPage?.superip || 0);
                    return running >= 3;
                  })()}
                  style={{
                    opacity: (() => {
                      if (!videoPrompt || !characterFileUrl || !voiceFileUrl) return 0.5;
                      if (isGeneratingVideo || navVideoLoading) return 0.5;
                      const running = Number(activeCountByPage?.superip || 0);
                      return running >= 3 ? 0.5 : 1;
                    })(),
                    cursor: (() => {
                      if (!videoPrompt || !characterFileUrl || !voiceFileUrl) return 'not-allowed';
                      if (isGeneratingVideo || navVideoLoading) return 'not-allowed';
                      const running = Number(activeCountByPage?.superip || 0);
                      return running >= 3 ? 'not-allowed' : 'pointer';
                    })()
                  }}
                >
                  <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  {(isGeneratingVideo || navVideoLoading) ? t('superIP.work.generatingVideo') : t('superIP.nav.generateVideoTab')}
                  {getCreditDisplay('superip_video_gen')}
                </button>
              </div>
            </div>

            {/* 结果展示区域 */}
            <div className="result-area superip-result-panel">
              {(!superipTasks || superipTasks.filter(t => t.status !== 'canceled' && !(t.status === 'failed' && !t.supabaseUrl && !t.resultUrl)).length === 0) && (
                <div className="result-placeholder">
                  <h3 className="placeholder-title">{t('superIP.placeholders.result') || 'RESULT'}</h3>
                  <p className="placeholder-text">{t('superIP.work.resultPlaceholderVideo') || 'Generated video will appear here'}</p>
                </div>
              )}
              {/* 将任务面板嵌入到生成结果区域，展示最新一张卡片（样式仅在 SuperIP 作用域内覆盖） */}
              <TaskPanel page={'superip'} />
            </div>

            {/* 历史记录 */}
            <div className="history-area video-history">
              <h3 className="history-title">{t('superIP.work.history')}</h3>
              <div className={`history-list ${isVideoScrolling ? 'scrolling' : ''}`} onScroll={handleVideoScroll}>
                {/* 运行中/排队中/持久化中的旧任务：嵌入到历史栏顶部 */}
                <TaskPanel page={'superip'} variant="history-list" />

                {videoHistory.length === 0 ? (
                  <p className="history-empty">{t('superIP.work.historyEmpty')}</p>
                ) : (
                  videoHistory.map((item) => (
                    <div
                      key={item.id}
                      className="video-history-item"
                      onClick={() => { if (item.videoUrl) { setPreviewVideoUrl(item.videoUrl); setIsVideoPreviewOpen(true); } }}
                    >
                      <VideoThumbnail src={item.videoUrl} className="video-history-thumbnail" />
                      <div className="video-history-overlay">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                      <button
                        className="video-history-delete"
                        title={t('superIP.dialogs.delete') || '删除'}
                        onClick={(e) => handleDeleteVideoHistory(item.id, item.videoUrl, e)}
                        aria-label="删除历史视频"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                      <div className="video-history-time">{safeFormatTime(item)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* 任务面板已在结果区域内展示（避免重复），如需恢复可在此处重新挂载 */}
          </div>
        )}

        {/* 移除底部的统一任务面板，避免与结果区域重复展示 */}
      </div>

      {/* 图库对话框 - 显示用户历史生成的图片 */}
      {/* 视频预览对话框：播放不影响结果区域 */}
      {isVideoPreviewOpen && (
        <div className="dialog-overlay" onClick={() => { setIsVideoPreviewOpen(false); setPreviewVideoUrl(''); }}>
          <div className="dialog-content" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">{t('superIP.work.playVideo')}</h3>
              <button className="dialog-close" onClick={() => { setIsVideoPreviewOpen(false); setPreviewVideoUrl(''); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <video src={previewVideoUrl || ''} controls autoPlay className="preview-video" />
            </div>
          </div>
        </div>
      )}

      {/* 图库对话框 - 显示用户历史生成的图片 */}
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">{t('superIP.dialogs.galleryTitle')}</h3>
              <button className="dialog-close" onClick={() => setIsDialogOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            {loadingHistory ? (
              <div className="gallery-loading">
                <div className="spinner"></div>
                <p>{t('superIP.dialogs.loading')}</p>
              </div>
            ) : historyImages.length === 0 ? (
              <div className="gallery-empty">
                <p>{t('superIP.dialogs.empty')}</p>
              </div>
            ) : (
              <div className="gallery-grid">
                {historyImages.map((record, index) => (
                  <div
                    key={record.id || index}
                    onClick={() => handleImageSelect(record.file_url)}
                    className={`gallery-item ${record.isTemp ? 'gallery-item-temp' : ''}`}
                  >
                    <img
                      src={record.file_url}
                      alt={record.prompt || `历史图片 ${index + 1}`}
                      className="gallery-image"
                    />
                    {record.isTemp && (
                      <div className="gallery-item-saving-badge">
                        <div className="spinner-tiny"></div>
                        <span>{t('superIP.dialogs.saving')}</span>
                      </div>
                    )}
                    {!record.isTemp && (
                      <button
                        className="gallery-item-delete"
                        onClick={(e) => handleDeleteHistoryImage(record.id, record.file_url, e)}
                        title={t('superIP.dialogs.delete') || '删除'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    )}
                    {record.prompt && !record.isTemp && (
                      <div className="gallery-item-overlay">
                        <p className="gallery-item-prompt">{record.prompt.substring(0, 30)}...</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 大图查看弹窗 */}
      {enlargedImage && (
        <div className="dialog-overlay enlarged-overlay" onClick={() => setEnlargedImage(null)}>
          <div className="enlarged-content" onClick={(e) => e.stopPropagation()}>
            <button className="dialog-close enlarged-close" onClick={() => setEnlargedImage(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img src={enlargedImage} alt="放大查看" className="enlarged-image" />
          </div>
        </div>
      )}

      {/* 音色选择对话框（恢复原样式），数据优先来自 /api/all_audio */}
      {isVoiceDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsVoiceDialogOpen(false)}>
          <div className="dialog-content voice-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">{t('superIP.dialogs.selectVoiceTitle')}</h3>
              <button className="dialog-close" onClick={() => setIsVoiceDialogOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* 导航标签 */}
            <div className="voice-nav-tabs">
              <button 
                className={`voice-nav-tab ${voiceDialogTab === 'system' ? 'active' : ''}`}
                onClick={() => setVoiceDialogTab('system')}
              >
                {t('superIP.dialogs.systemVoices')}
              </button>
              <button 
                className={`voice-nav-tab ${voiceDialogTab === 'custom' ? 'active' : ''}`}
                onClick={() => setVoiceDialogTab('custom')}
              >
                {t('superIP.dialogs.customVoices')}
              </button>
              <button 
                className={`voice-nav-tab ${voiceDialogTab === 'clone' ? 'active' : ''}`}
                onClick={() => setVoiceDialogTab('clone')}
              >
                {t('superIP.dialogs.cloneVoices')}
              </button>
            </div>
            
            <div className="voice-options">
              {/* 系统音色 */}
              {voiceDialogTab === 'system' && (
                <div className="voice-section">
                  <div className="voice-grid">
                    {((availableVoices?.system_voice && Array.isArray(availableVoices.system_voice)) ? availableVoices.system_voice : systemVoices).map((v) => {
                      const voice = {
                        ...v,
                        id: v.id || v.voice_id,
                        name: v.name || v.voice_name,
                        voice_id: v.voice_id || v.id
                      };
                      const isOwned = (availableVoices?.custom || []).some(cv => (cv.voice_id || cv.id) === voice.voice_id);
                      return (
                        <div
                          key={voice.id}
                          onClick={() => handleSelectVoice(voice)}
                          className={`voice-option ${selectedVoice?.id === voice.id || selectedVoice?.voice_id === voice.voice_id ? 'selected' : ''}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          </svg>
                          <span>{voice.name}</span>
                          {isOwned && <span className="voice-badge-mine">Mine</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* 自定义音色 */}
              {voiceDialogTab === 'custom' && (
                <div className="voice-section">
                  <div className="voice-grid">
                    {(Array.isArray(availableVoices?.custom) ? availableVoices.custom : []).map((v) => {
                      const voice = {
                        ...v,
                        id: v.id || v.voice_id,
                        name: v.voice_name || v.name || v.voice_id,
                        voice_id: v.voice_id || v.id,
                        created_time: v.created_time || v.createdAt || v.time || ''
                      };
                      return (
                        <div
                          key={voice.voice_id}
                          onClick={() => handleSelectVoice(voice)}
                          className={`voice-option ${selectedVoice?.voice_id === voice.voice_id ? 'selected' : ''} voice-option-custom`}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, width: '100%' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 18V5l12-2v13"></path>
                              <circle cx="6" cy="18" r="3"></circle>
                              <circle cx="18" cy="16" r="3"></circle>
                            </svg>
                            <span style={{ fontWeight: 500 }}>{voice.name}</span>
                            {voice.created_time && <em className="voice-time-label" style={{ marginTop: 2 }}>{voice.created_time}</em>}
                          </div>
                          <span className="voice-badge-mine">Mine</span>
                        </div>
                      );
                    })}
                  </div>
                  {(!availableVoices?.custom || availableVoices.custom.length === 0) && (
                    <div style={{ padding: '32px 12px', textAlign: 'center', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      暂无自定义音色。请先使用“生成”按钮并保存返回的 ttv-voice-* 作为自己的音色。
                    </div>
                  )}
                </div>
              )}
              {/* 克隆音色（仅展示当前用户拥有的 clone 列表） */}
              {voiceDialogTab === 'clone' && (
                <div className="voice-section">
                  <div className="voice-grid">
                    {(Array.isArray(availableVoices?.clone) ? availableVoices.clone : []).map((v) => {
                      const voice = {
                        ...v,
                        id: v.id || v.voice_id,
                        name: v.voice_name || v.name || v.voice_id,
                        voice_id: v.voice_id || v.id,
                        created_time: v.created_time || v.createdAt || v.time || ''
                      };
                      return (
                        <div
                          key={voice.voice_id}
                          onClick={() => handleSelectVoice(voice)}
                          className={`voice-option ${selectedVoice?.voice_id === voice.voice_id ? 'selected' : ''} voice-option-custom`}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, width: '100%' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 18V5l12-2v13"></path>
                              <circle cx="6" cy="18" r="3"></circle>
                              <circle cx="18" cy="16" r="3"></circle>
                            </svg>
                            <span style={{ fontWeight: 500 }}>{voice.name}</span>
                            {voice.created_time && <em className="voice-time-label" style={{ marginTop: 2 }}>{voice.created_time}</em>}
                          </div>
                          <span className="voice-badge-mine">Mine</span>
                        </div>
                      );
                    })}
                  </div>
                  {(!availableVoices?.clone || availableVoices.clone.length === 0) && (
                    <div style={{ padding: '32px 12px', textAlign: 'center', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      暂无克隆音色。请先在“Voice Clone”中生成，并完成一次合成即可加入列表。
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* 生成试听弹窗（由“生成”按钮打开） */}
        {isAnalyzeModalOpen && (
          <div className="dialog-overlay" onClick={() => setIsAnalyzeModalOpen(false)}>
            <div className="dialog-content voice-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <h3 className="dialog-title">{t('superIP.dialogs.analyzeTitle')}</h3>
                <button className="dialog-close" onClick={() => setIsAnalyzeModalOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div style={{ padding: '12px 16px' }}>
                {isAnalyzing || !analyzedPrompt ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
                    <p style={{ color: '#ccc', fontSize: 14 }}>{t('superIP.dialogs.analyzing') || '正在分析角色图片生成音色提示词，请稍候...'}</p>
                  </div>
                ) : (
                  <React.Fragment>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', marginBottom: 6 }}>{t('superIP.dialogs.analyzePrompt')}</label>
                      <textarea
                        value={modalPrompt}
                        onChange={(e) => setModalPrompt(e.target.value)}
                        className="textarea"
                        rows={3}
                        disabled={isAnalyzing}
                      />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', marginBottom: 6 }}>{t('superIP.dialogs.trialText')}</label>
                      <input
                        type="text"
                        value={trialText}
                        onChange={(e) => setTrialText(e.target.value)}
                        className="input"
                        disabled={isAnalyzing}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setTrialText('你好呀，今天我很高兴，你呢')}
                        disabled={isAnalyzing}
                      >{t('superIP.dialogs.resetTrialText')}</button>
                      <button
                        className="btn btn-icon"
                        title={t('superIP.dialogs.refreshAnalyze')}
                        onClick={() => analyzeVoiceFromCharacter(modalPrompt)}
                        disabled={isAnalyzing || !characterFileUrl}
                        aria-label="刷新分析"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 1 1-3-6.7"></path>
                          <polyline points="21 3 21 9 15 9"></polyline>
                        </svg>
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={async () => {
                          setIsAnalyzeModalOpen(false);
                          await generateTrialAudio(modalPrompt);
                        }}
                        disabled={isGeneratingTrial || isAnalyzing || !(modalPrompt || analyzedPrompt)}
                      >
                        {isGeneratingTrial ? (
                          <Loader2 className="animate-spin" size={16} style={{ marginRight: '6px' }} />
                        ) : null}
                        {isGeneratingTrial ? t('superIP.dialogs.generateTrialProcessing') : t('superIP.dialogs.generateTrial')}
                      </button>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

