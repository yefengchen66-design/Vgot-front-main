import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FiImage, FiVideo, FiUpload, FiZap } from 'react-icons/fi';
import './VideoGeneration.css';
import { useSupabaseUpload } from '../hooks/useSupabaseUpload';
import { useEffect } from 'react';
import historyService from '../services/historyService';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import SystemSelect from '../components/SystemSelect';
import { useTaskManager } from '../contexts/TaskManagerContext';
import TaskPanel from '../components/tasks/TaskPanel';
import '../components/tasks/TaskPanel.css';

// 从环境变量获取API基础URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function VideoGeneration() {
  const { t, lang } = useLanguage();
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('text-to-video');
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [taskId, setTaskId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { canStartTask, startTask, PAGE_LIMITS, activeCountByPage, totalActiveCount } = useTaskManager();
  const [videoFallbackAttempted, setVideoFallbackAttempted] = useState(false);
  // Enhance 上传时长限制（加入轻微容差，避免浮点/采样误差导致 15.0s 被判超）
  const MAX_VIDEO_DURATION = 15; // seconds
  const DURATION_EPS = 0.25;     // allow up to 250ms tolerance
  // 防止清空后异步上传结果“回填”导致视频又出现
  const videoUploadSeqRef = useRef(0);
  
  // 文生视频参数
  const [model, setModel] = useState('sora-2');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [hd, setHd] = useState(false);
  const [duration, setDuration] = useState('10');
  
  // 图生视频参数（使用不同的API规范）
  const [imgModel, setImgModel] = useState('sora-2');
  const [imgAspectRatio, setImgAspectRatio] = useState('9:16');
  const [imgDuration, setImgDuration] = useState(10);
  const [imgSize, setImgSize] = useState('small');
  
  // 图片上传相关
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { uploadFile, uploading, progress } = useSupabaseUpload();
  // Helper: always open selector (clears value to allow re-selecting the same file)
  const openImagePicker = () => {
    if (fileInputRef.current) {
      // 清空 value，确保选择同一文件也能触发 onChange
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Video picker opener (for enhance tab)
  const openVideoPicker = () => {
    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
      videoFileInputRef.current.click();
    }
  };

  // Helper: save generation result to history
  const saveToHistory = async (fileUrl, contentType = 'video', generationParams = {}, apiResponseData = {}) => {
    try {
      console.log('🔄 VideoGeneration - 正在保存到历史记录...', {
        fileUrl,
        contentType,
        generationParams,
        apiResponseData
      });
      
      // 确定子类型
      let contentSubtype = null;
      if (contentType === 'video') {
        if (generationParams.apiType === 'text-to-video') {
          contentSubtype = 'text_to_video';
        } else if (generationParams.apiType === 'image-to-video') {
          contentSubtype = 'image_to_video';
        }
        
        // 检测是否是高清视频
        if (hd) {
          contentSubtype = 'video_enhance';
        }
      }
      
      const result = await historyService.saveGeneratedContent({
        content_type: contentType,
        content_subtype: contentSubtype,  // 添加子类型
        source_page: 'VideoGeneration',
        file_data: fileUrl,
        prompt: prompt || '',
        generation_params: {
          activeTab,
          model: activeTab === 'text-to-video' ? model : imgModel,
          aspect_ratio: activeTab === 'text-to-video' ? aspectRatio : imgAspectRatio,
          duration: activeTab === 'text-to-video' ? duration : imgDuration,
          hd: hd,
          ...generationParams
        },
        api_response_data: apiResponseData,
        duration: activeTab === 'text-to-video' ? parseInt(duration) : imgDuration,
        dimensions: activeTab === 'text-to-video' ? aspectRatio : imgAspectRatio
      });
      
      console.log('✅ VideoGeneration - 历史记录保存成功:', result);
    } catch (error) {
      console.error('❌ VideoGeneration - 历史记录保存失败:', error);
      // Don't throw error - history saving should not break the main flow
    }
  };

  // Helper: persist generation record to backend (legacy)
  const persistGenerationRecord = async ({ promptText, requestUrl, responseUrl, apiType }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/generation-records`, {
        prompt: promptText,
        request_url: requestUrl || null,
        response_url: responseUrl || null,
        api_type: apiType || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.warn('[persistGenerationRecord] failed', err?.message || err);
    }
  };

  // 视频增强相关
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [uploadedVideoDuration, setUploadedVideoDuration] = useState(null); // 秒
  const [videoUrl, setVideoUrl] = useState('');
  // Resolution removed per new API
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const videoFileInputRef = useRef(null);

  // 获取积分显示文本的辅助函数（按次计费）
  const getCreditDisplay = (feature) => {
    if (!user || !user.tier) {
      console.log(`💳 SORA2 - 无法获取用户信息:`, { user });
      return '';
    }
    
    const tier = user.tier;
    console.log(`💳 SORA2 - 获取积分显示: feature=${feature}, tier=${tier}, lang=${lang}`);
    
    const creditCosts = {
      'sora_text_to_video': { 'Free': 150, 'Creator': 150, 'Business': 150, 'Enterprise': 0 },
      'sora_image_to_video': { 'Free': 150, 'Creator': 150, 'Business': 150, 'Enterprise': 0 },
      // 前端显示用的别名（后端实际扣款 action 是 sora_video_to_video）
      'sora_watermark_free': { 'Free': 150, 'Creator': 150, 'Business': 150, 'Enterprise': 0 },
      'video_enhance': { 'Free': -1, 'Creator': 800, 'Business': 500, 'Enterprise': 0 }
    };

    const cost = creditCosts[feature]?.[tier];
    console.log(`💳 SORA2 - 积分成本: cost=${cost}`);
    
    if (cost === undefined) return '';
    if (cost === 0) return '';
    
    // 根据语言返回不同格式
    if (cost === -1) {
      // 不支持
      if (lang === 'zh') return ' (不支持)';
      if (lang === 'zh-TW') return ' (不支持)';
      if (lang === 'ja') return '（非対応）';
      if (lang === 'en') return ' (Not Supported)';
      if (lang === 'es') return ' (No Soportado)';
      return ' (Not Supported)';
    }
    
    // 按次计费（文生视频、图生视频、以及视频增强的 Creator/Business 固定价）
    if (lang === 'zh') return ` (${cost}积分)`;
    if (lang === 'zh-TW') return ` (${cost}積分)`;
    if (lang === 'ja') return `（${cost} クレジット）`;
    if (lang === 'en') return ` (${cost} credits)`;
    if (lang === 'es') return ` (${cost} créditos)`;
    return ` (${cost} credits)`;
  };

  // 监测用户登录状态
  useEffect(() => {
    console.log('👤 SORA2 - 用户状态更新:', {
      user: user,
      tier: user?.tier,
      monthly_credits: user?.monthly_credits
    });
  }, [user]);

  // 清除所有内容
  const handleClear = () => {
    setPrompt('');
    setImageUrl('');
    setTaskId('');
    setResult(null);
    setModel('sora-2');
    setAspectRatio('16:9');
    setHd(false);
    setDuration('10');
    setImgModel('sora-2');
    setImgAspectRatio('9:16');
    setImgDuration(10);
    setImgSize('small');
    setUploadedImage(null);
    setUploadedVideo(null);
  setUploadedVideoDuration(null);
    setVideoUrl('');
    // resolution removed
    setLoading(false);
    setPolling(false);
    setIsGenerating(false);
    setVideoFallbackAttempted(false);
    // 递增序号，作废进行中的上传回调
    videoUploadSeqRef.current += 1;
    // 重置文件上传input，确保可以重新选择相同文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
    }
  };

  // 图片上传处理：立即本地预览，后台直传
  const handleImageUpload = async (file) => {
    if (!file) return;
    console.log('📤 [handleImageUpload] 预览并后台上传:', file.name, file.size);

    // 本地预览：瞬间显示
    const localPreview = URL.createObjectURL(file);
    setUploadedImage({ file, preview: localPreview, url: null });

    // 后台直传到 Supabase Storage
    try {
      const result = await uploadFile(file, 'images', {
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxSize: 20 * 1024 * 1024,
      });
      console.log('📤 [handleImageUpload] 上传结果:', result);
      if (result.success) {
        console.log('✅ [handleImageUpload] 上传成功，URL:', result.url);
        // 更新上传后的公共 URL，不影响本地预览
        setUploadedImage((prev) => prev ? { ...prev, url: result.url } : { file, preview: localPreview, url: result.url });
        setImageUrl(result.url);
      } else {
        console.error('❌ [handleImageUpload] 上传失败:', result.error);
        alert(result.error || t('videoGeneration.alerts.uploadImageFail'));
      }
    } catch (err) {
      console.error('❌ [handleImageUpload] 直传异常:', err);
      alert(t('videoGeneration.alerts.uploadImageFail'));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    console.log('📁 [handleFileSelect] 文件选择:', file?.name);
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      alert(t('videoGeneration.alerts.needImageFile'));
    }
  };

  // 检查视频时长的函数
  const checkVideoDuration = (file) => {
    console.log('🔍 [checkVideoDuration] 开始检查文件:', file.name);
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        console.log('📊 [checkVideoDuration] 获取到视频metadata:', {
          duration: video.duration,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight
        });
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = (e) => {
        console.error('❌ [checkVideoDuration] 无法加载视频metadata:', e);
        URL.revokeObjectURL(video.src);
        resolve(null); // 如果无法获取时长，返回null（将在上层阻止上传）
      };
      
      video.src = URL.createObjectURL(file);
      console.log('🔗 [checkVideoDuration] 创建临时URL:', video.src);
    });
  };

  // 视频上传处理：立即预览 + 后台直传
  const handleVideoUpload = async (file) => {
    if (!file) return;
    console.log('📤 [handleVideoUpload] 预览并后台上传:', file.name, file.size);
    const mySeq = ++videoUploadSeqRef.current;
    
    // 检查视频时长
    console.log('🔍 [handleVideoUpload] 开始检查视频时长...');
    const duration = await checkVideoDuration(file);
    console.log('⏱️ [handleVideoUpload] 视频时长:', duration, '秒');

    // 无法读取时长或超过限制，均阻止
    if (duration == null || !isFinite(duration) || isNaN(duration)) {
      console.log('❌ [handleVideoUpload] 无法读取视频时长，阻止上传');
      alert(t('videoGeneration.alerts.videoDurationUnknown', 'Unable to read video duration. Please upload MP4/WEBM/MOV up to 15s.'));
      return;
    }
    if (duration - MAX_VIDEO_DURATION > DURATION_EPS) {
      console.log('❌ [handleVideoUpload] 视频时长超过15秒，阻止上传');
      alert(t('videoGeneration.alerts.videoDurationExceeded', 'Video duration must be 15 seconds or less'));
      return;
    }
    
    console.log('✅ [handleVideoUpload] 视频时长检查通过，继续上传');
    
    // 先生成本地预览，立即显示
    const localPreview = URL.createObjectURL(file);
    setUploadedVideo({ file, preview: localPreview, url: null });
    setUploadedVideoDuration(duration);

    try {
      const result = await uploadFile(file, 'videos', {
        allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
        maxSize: 100 * 1024 * 1024, // 100MB
      });
      console.log('📤 [handleVideoUpload] 上传结果:', result);
      // 若期间用户点击了清空，丢弃这次上传结果
      if (mySeq !== videoUploadSeqRef.current) {
        console.log('↩️ [handleVideoUpload] 忽略过期的上传结果');
        try { URL.revokeObjectURL(localPreview); } catch {}
        return;
      }
      if (result.success) {
        setUploadedVideo(prev => prev ? { ...prev, url: result.url } : { file, preview: localPreview, url: result.url });
        setVideoUrl(result.url);
        console.log('✅ [handleVideoUpload] 上传成功，URL:', result.url);
      } else {
        console.error('❌ [handleVideoUpload] 上传失败:', result.error);
        alert(result.error || t('videoGeneration.alerts.uploadVideoFail'));
      }
    } catch (err) {
      console.error('❌ [handleVideoUpload] 异常:', err);
      alert(t('videoGeneration.alerts.uploadVideoFail'));
    }
  };

  const handleVideoFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) await handleVideoUpload(file);
  };

  const handleVideoDragOver = (e) => { e.preventDefault(); setIsDraggingVideo(true); };
  const handleVideoDragLeave = (e) => { e.preventDefault(); setIsDraggingVideo(false); };
  const handleVideoDrop = async (e) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      await handleVideoUpload(file);
    } else {
      alert(t('videoGeneration.alerts.needVideoFile'));
    }
  };

  // 视频增强提交处理
  const handleVideoEnhance = async () => {
    if (uploadedVideoDuration == null || !isFinite(uploadedVideoDuration) || isNaN(uploadedVideoDuration)) {
      alert(t('videoGeneration.alerts.videoDurationUnknown', 'Unable to read video duration. Please upload MP4/WEBM/MOV up to 15s.'));
      return;
    }
    if (uploadedVideoDuration - MAX_VIDEO_DURATION > DURATION_EPS) {
      alert(t('videoGeneration.alerts.videoDurationExceeded', 'Video duration must be 15 seconds or less'));
      return;
    }
    if (!uploadedVideo?.file) {
      alert(t('videoGeneration.alerts.needVideoFirst'));
      return;
    }
    if (!canStartTask('enhance')) {
      const limit = PAGE_LIMITS?.enhance || 3;
      alert(`最多同时运行 ${limit} 个任务`);
      return;
    }
    setLoading(true);
    try {
      // Prefer passing uploaded Supabase URL to avoid large multipart uploads in production
      await startTask({
        page: 'enhance',
        prompt: '',
        params: { url: videoUrl, file: uploadedVideo.file },
      });
      // 刷新用户以同步扣费后的积分显示
      try { await refreshUser?.(); } catch {}
    } catch (error) {
      if (error.response && [402, 403, 429].includes(error.response.status)) return;
      const serverMsg = error?.response?.data?.detail || error.message;
      alert(t('videoGeneration.alerts.enhanceFail').replace('{msg}', serverMsg));
    } finally {
      setLoading(false);
    }
  };

  // 文生视频提交处理
  const handleTextToVideo = async () => {
    if (!prompt.trim()) return;
    if (!canStartTask('text')) {
      const limit = PAGE_LIMITS?.text || 5;
      alert(`最多同时运行 ${limit} 个任务`);
      return;
    }
    setLoading(true);
    try {
      await startTask({
        page: 'text',
        prompt,
        params: {
          prompt,
          aspect_ratio: aspectRatio,
          duration: Number(duration),
          model,
          hd,
        },
      });
      // 扣费在后端完成，这里刷新一次用户信息以更新积分显示
      try { await refreshUser?.(); } catch {}
    } catch (e) {
      // Skip alert for credit/auth errors handled by global interceptor
      if (e.response && [402, 403, 429].includes(e.response.status)) return;

      const serverMsg = e?.response?.data?.detail || e.message;
      alert(t('videoGeneration.alerts.generateFailWithMsg').replace('{msg}', serverMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleImageToVideo = async () => {
    // 按接口说明，prompt 为必填，url 为可选（可通过上传得到 url 或不传）
    if (!prompt.trim()) {
      alert(t('videoGeneration.alerts.needPrompt'));
      return;
    }
    
    console.log('🎬 [handleImageToVideo] 开始执行');
    console.log('📊 当前状态:', {
      imageUrl,
      'uploadedImage?.file': uploadedImage?.file?.name,
      'uploadedImage?.url': uploadedImage?.url
    });
    
    setLoading(true);
    setIsGenerating(true);
    try {
      let finalUrl = null;
      
      // 优先使用 uploadedImage（文件上传产生的URL）
      if (uploadedImage?.url) {
        console.log('✅ 使用已上传的图片URL:', uploadedImage.url);
        finalUrl = uploadedImage.url;
      } 
      // 其次使用 imageUrl（输入框填写的URL）
      else if (imageUrl && !imageUrl.includes('placeholder')) {
        console.log('✅ 使用imageUrl输入框URL:', imageUrl);
        finalUrl = imageUrl;
      }
      // 如果都没有，检查是否需要上传文件
      else if (uploadedImage?.file) {
        console.log('📤 检测到本地文件但无URL，开始上传:', uploadedImage.file.name);
        const uploadRes = await uploadFile(uploadedImage.file, 'images', {
          allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maxSize: 20 * 1024 * 1024,
        });
        console.log('📤 上传结果:', uploadRes);
        if (!uploadRes.success) {
          alert(t('videoGeneration.alerts.imageUploadRetry') + ': ' + (uploadRes.error || ''));
          setLoading(false);
          setIsGenerating(false);
          return;
        }
        finalUrl = uploadRes.url;
        setImageUrl(finalUrl);
        console.log('✅ 上传成功，URL:', finalUrl);
      }

      // 后端示例要求 image_url 字段存在且 duration 为字符串
      if (!finalUrl) {
        alert(t('videoGeneration.alerts.needImageOrUrl'));
        setLoading(false);
        setIsGenerating(false);
        return;
      }
      if (!canStartTask('image')) {
        const limit = PAGE_LIMITS?.image || 5;
        alert(`最多同时运行 ${limit} 个任务`);
        setIsGenerating(false);
        setLoading(false);
        return;
      }

      await startTask({
        page: 'image',
        prompt,
        params: {
          prompt,
          url: finalUrl,
          aspect_ratio: imgAspectRatio,
          duration: Number(imgDuration),
          size: imgSize,
        },
      });
      // 刷新用户以同步扣费后的积分显示
      try { await refreshUser?.(); } catch {}
    } catch (error) {
      // Skip alert for credit/auth errors handled by global interceptor
      if (error.response && [402, 403, 429].includes(error.response.status)) return;

      const serverMsg = error?.response?.data?.detail || error.message;
      alert(t('videoGeneration.alerts.generateFailWithMsg').replace('{msg}', JSON.stringify(serverMsg)));
    } finally {
      setLoading(false);
    }
  };

  // 当 video 元素加载失败时，尝试通过 fetch 下载为 blob 并用 objectURL 回退
  const handleVideoError = async (evt) => {
    if (videoFallbackAttempted) return; // 仅尝试一次回退
    setVideoFallbackAttempted(true);
    try {
      if (!result?.fileUrl) return;
      console.warn('[VideoGeneration] <video> load failed, attempting blob fallback', {
        src: result.fileUrl,
        error: evt?.message || evt?.type || 'unknown'
      });
      const resp = await fetch(result.fileUrl, { mode: 'cors' });
      if (!resp.ok) throw new Error(`fetch failed status=${resp.status}`);
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      // 替换为 blob URL 以绕过不支持 range 的问题或 Content-Disposition
      setResult({ fileUrl: blobUrl, _isBlob: true });
    } catch (err) {
      console.error('[VideoGeneration] blob fallback failed:', err);
      // 显示可点击原始链接，便于用户手动打开
      setResult((r) => ({ ...(r || {}), raw: { videoLoadError: String(err) } }));
    }
  };


  const startPolling = async (id) => {
    setPolling(true);
    const token = localStorage.getItem('token');
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/task/poll/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === 0 && response.data.data) {
          setResult(response.data.data[0]);
          setPolling(false);
          clearInterval(interval);
        }
      } catch (error) {
      }
    }, 3000);

    setTimeout(() => {
      clearInterval(interval);
      setPolling(false);
    }, 300000);
  };

  const startSoraPolling = async (id) => {
    setPolling(true);
    setIsGenerating(true);
    const token = localStorage.getItem('token');
    let errorCount = 0;
    const maxConsecutiveErrors = 5; // 连续失败几次后才停止轮询
    let serverSilentCount = 0; // 后端无效响应计数
    const maxServerSilent = 3; // 若连续多次后端未返回有效状态，则认为后端停止

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/sora/poll/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // 调试日志：打印原始响应，便于定位后端返回格式
        console.log('[startSoraPolling] response:', response.data);
        errorCount = 0; // 成功响应则重置错误计数
        serverSilentCount = 0; // 收到有效响应则重置后端静默计数

        const statusRaw = ((response.data && (response.data.status || response.data.state)) || '').toString().toLowerCase();

        if (statusRaw.includes('success') || statusRaw.includes('succeed') || statusRaw.includes('completed')) {
          // 优先使用后端持久化到 Supabase 的稳定地址 stored_url，避免上游临时链接 404
          const dataObj = response.data?.data || {};
          const fileUrl = dataObj.stored_url || dataObj.output || dataObj.outputUrl || dataObj.results?.[0]?.url;
          if (fileUrl) {
            setResult({ fileUrl });
            // Save to new history system
            saveToHistory(fileUrl, 'video', { apiType: 'text-to-video' }, response.data?.data);
            // persist record (text-to-video) - legacy
            persistGenerationRecord({ promptText: prompt, requestUrl: imageUrl || null, responseUrl: fileUrl, apiType: 'text-to-video' });
            // 生成成功后再刷新一次，确保月累计等字段及时更新
            try { await refreshUser?.(); } catch {}
          } else {
            // 如果没有文件地址但状态是成功，仍然把整个 data 写入 result 以便调试
            setResult({ data: response.data.data });
          }
          setPolling(false);
          setIsGenerating(false);
          clearInterval(interval);
        } else if (statusRaw.includes('fail') || statusRaw.includes('failed') || statusRaw === 'failed') {
          // 优先展示后端返回的具体 error 字段，其次才是 failure_reason
          const dataObj = response.data?.data || response.data || {};
          const errorDetail = dataObj.error || dataObj.failure_reason || dataObj.message || dataObj.msg;
          if (errorDetail) {
            alert(`${t('videoGeneration.alerts.generateFail')}: ${errorDetail}`);
          } else {
            alert(t('videoGeneration.alerts.generateFail'));
          }
          setPolling(false);
          setIsGenerating(false);
          clearInterval(interval);
        }
        // 否则视为仍在运行，继续轮询
      } catch (error) {
        console.error('[startSoraPolling] error:', error);
        errorCount++;
        // 如果后端返回 200 但没有有效数据，或者请求抛错过多次，则判断为后端已停止或不可达
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          // 客户端请求错误（如 404/410）可视为终止
          console.warn('[startSoraPolling] client error response, stopping:', error.response.status);
          clearInterval(interval);
          setPolling(false);
          setIsGenerating(false);
          setTaskId('');
          alert(t('videoGeneration.alerts.notFoundStopped'));
          return;
        }
        // 只有在连续多次错误后才停止，避免单次网络波动导致停止
        if (errorCount >= maxConsecutiveErrors) {
          clearInterval(interval);
          setPolling(false);
          setIsGenerating(false);
          setTaskId('');
          alert(t('videoGeneration.alerts.pollingFail'));
        }
      }
    }, 5000);

    // 最大轮询时长（15 分钟）以防意外无限轮询
    setTimeout(() => {
      clearInterval(interval);
      setPolling(false);
      setIsGenerating(false);
    }, 900000);
  };

  // 图生视频专用轮询（新API格式）
  const startImageToVideoPolling = async (id) => {
    setPolling(true);
    const token = localStorage.getItem('token');
    let errorCount = 0;
    const maxConsecutiveErrors = 5;

    const interval = setInterval(async () => {
      try {
          // 现在后端提供 GET /api/sora/watermark-free/{task_id}，直接取后端返回的数据
          const response = await axios.get(`${API_BASE_URL}/api/sora/watermark-free/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('[startImageToVideoPolling] response:', response.data);
          errorCount = 0;

          const resp = response.data || {};
          // 支持多种返回结构：优先查找标准字段 results 或 data.results
          const data = resp.data || resp;
          const status = (data.status || resp.status || '').toString().toLowerCase();

          if (status.includes('succeed') || status.includes('success') || status.includes('succeeded') || status.includes('completed')) {
            const url = data?.results?.[0]?.url || resp?.results?.[0]?.url || data?.output || data?.url;
            if (url) {
                setResult({ fileUrl: url });
                // Save to new history system
                saveToHistory(url, 'video', { apiType: 'image-to-video', imageUrl: imageUrl }, data);
                // persist record (image-to-video) - legacy
                persistGenerationRecord({ promptText: prompt, requestUrl: imageUrl || null, responseUrl: url, apiType: 'image-to-video' });
                // 生成成功后刷新用户信息
                try { await refreshUser?.(); } catch {}
            } else {
              setResult({ data });
            }
            setPolling(false);
            setIsGenerating(false);
            clearInterval(interval);
          } else if (status.includes('fail') || status.includes('failed')) {
            // 调整优先级：error 优先于 failure_reason，以显示更精确的错误信息
            const errorMsg = data.error || data.failure_reason || resp.msg || t('videoGeneration.alerts.generateFail');
            alert(`${t('videoGeneration.alerts.generateFail')}: ${errorMsg}`);
            setPolling(false);
            setIsGenerating(false);
            clearInterval(interval);
          } 
      } catch (error) {
        console.error('[startImageToVideoPolling] error:', error);
        errorCount++;
        if (errorCount >= maxConsecutiveErrors) {
          clearInterval(interval);
          setPolling(false);
          alert(t('videoGeneration.alerts.i2vPollingFail'));
        }
      }
    }, 5000);

    // 最大轮询时长 15 分钟
    setTimeout(() => {
    clearInterval(interval);
    setPolling(false);
    setIsGenerating(false); // 确保生成状态被重置
  }, 900000);
};

  return (
    <div className="page video-generation-page">
      <div className="page-header">
        <h1 className="page-title">{t('videoGeneration.headerTitle')}</h1>
        <p className="page-subtitle">{t('videoGeneration.headerSubtitle')}</p>
      </div>

      <div className="generation-tabs">
        <button
          className={`tab-button ${activeTab === 'text-to-video' ? 'active' : ''}`}
          onClick={() => setActiveTab('text-to-video')}
        >
          <FiVideo className="tab-icon" aria-hidden="true" />
          {t('videoGeneration.tabs.t2v')}
        </button>
        <button
          className={`tab-button ${activeTab === 'image-to-video' ? 'active' : ''}`}
          onClick={() => setActiveTab('image-to-video')}
        >
          <FiImage className="tab-icon" aria-hidden="true" />
          {t('videoGeneration.tabs.i2v')}
        </button>
        <button
          className={`tab-button ${activeTab === 'enhance' ? 'active' : ''}`}
          onClick={() => setActiveTab('enhance')}
        >
          <FiZap className="tab-icon" aria-hidden="true" />
          {t('videoGeneration.tabs.enhance')}
        </button>
      </div>

      {activeTab === 'enhance' && (
        <div className="compare-container">
          <div className="compare-video-wrapper compare-left">
            <div className="compare-label">{t('videoGeneration.compare.original')}</div>
            <video
              src="https://segmind-resources.s3.amazonaws.com/input/da981ec9-cb58-4a1d-b56f-49f4e0f38ac7-flash_720.mp4"
              autoPlay
              playsInline
              preload="auto"
              className="compare-video"
              muted
              loop
            />
          </div>
          <div className="compare-video-wrapper compare-right">
            <div className="compare-label">{t('videoGeneration.compare.enhanced')}</div>
            <video
              src="https://gqkdylnbgzxpbhdklgbx.supabase.co/storage/v1/object/public/lixibin/videos/extend.mp4"
              autoPlay
              playsInline
              preload="auto"
              className="compare-video"
              muted
              loop
            />
          </div>
        </div>
      )}

      <div className="generation-content">
        <div className="gen-left">
          {activeTab === 'text-to-video' && (
            <div className="generation-form">
              <div className="form-group">
                <label>{t('videoGeneration.form.promptLabel')}</label>
                <textarea
                  className="textarea"
                  placeholder={t('videoGeneration.form.promptT2VPlaceholder')}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              <div className="controls-row">
                {/* 模型选择已移除，默认使用 sora-2 */}

                <div className="form-group control-item">
                  <label>{t('videoGeneration.form.ratioLabel')} </label>
                  <SystemSelect
                    className="select-input"
                    value={aspectRatio}
                    onChange={(val) => setAspectRatio(val)}
                    options={[
                      { value: '16:9', label: '16:9' },
                      { value: '9:16', label: '9:16' }
                    ]}
                  />
                </div>

                <div className="form-group control-item">
                  <label>{t('videoGeneration.form.durationLabel')} </label>
                  <SystemSelect
                    className="select-input"
                    value={duration}
                    onChange={(val) => setDuration(String(val))}
                    options={[
                      { value: '10', label: t('videoGeneration.form.seconds').replace('{sec}', '10') },
                      { value: '15', label: t('videoGeneration.form.seconds').replace('{sec}', '15') },
                      ...(model === 'sora-2-pro' ? [{ value: '25', label: t('videoGeneration.form.seconds').replace('{sec}', '25') }] : [])
                    ]}
                  />
                </div>
              </div>

              {model === 'sora-2-pro' && duration !== '25' && (
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={hd}
                      onChange={(e) => setHd(e.target.checked)}
                    />
                    <span>{t('videoGeneration.form.hdMode')}</span>  
                  </label>
               
                </div>
              )}

              <div className="button-group">
                <button
                  className="button button-secondary"
                  onClick={handleClear}
                  disabled={loading || polling}
                >
                  {t('videoGeneration.form.clear')}
                </button>
                <button
                  className="button button-primary"
                  onClick={handleTextToVideo}
                  disabled={loading || polling || !prompt.trim() || !canStartTask('text')}
                >
                  {loading ? t('videoGeneration.form.submitting') : polling ? t('videoGeneration.form.generating') : t('videoGeneration.form.submit')}
                  {!loading && !polling && getCreditDisplay('sora_text_to_video')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'image-to-video' && (
            <div className="generation-form">
              <div className="form-group">
                <label>{t('videoGeneration.form.uploadImageLabel')}</label>
                <div 
                  className={`image-upload-area ${isDragging ? 'dragging' : ''} ${uploadedImage ? 'has-image' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={openImagePicker}
                  title={uploadedImage ? '点击更换图片' : undefined}
                  role="button"
                >
                  {!uploadedImage ? (
                    <div className="upload-placeholder">
                      <FiUpload className="upload-icon" />
                      <p className="upload-text">{t('videoGeneration.form.uploadImageDrop')}</p>
                    </div>
                  ) : (
                    <div className="uploaded-image-preview">
                      <img src={uploadedImage.preview} alt="Preview" />
                      <button 
                        type="button"
                        className="clear-preview-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          // 释放本地预览 URL 资源
                          try { if (uploadedImage?.preview) URL.revokeObjectURL(uploadedImage.preview); } catch {}
                          setUploadedImage(null);
                          setImageUrl('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        aria-label="移除"
                      >✕</button>
                    </div>
                  )}
                  {/* Hide upload progress for cleaner UX */}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>
              
              <div className="form-group">
                <label>{t('videoGeneration.form.promptLabel')}</label>
                <textarea
                  className="textarea"
                  placeholder={t('videoGeneration.form.promptI2VPlaceholder')}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              <div className="controls-row">
                {/* 图生视频模型选择已移除，默认使用 sora-2 */}

                <div className="form-group control-item">
                  <label>{t('videoGeneration.form.ratioLabel')}</label>
                  <SystemSelect
                    className="select-input"
                    value={imgAspectRatio}
                    onChange={(val) => setImgAspectRatio(val)}
                    options={[
                      { value: '9:16', label: '9:16' },
                      { value: '16:9', label: '16:9' }
                    ]}
                  />
                </div>

                <div className="form-group control-item">
                  <label>{t('videoGeneration.form.durationLabel')} </label>
                  <SystemSelect
                    className="select-input"
                    value={String(imgDuration)}
                    onChange={(val) => setImgDuration(Number(val))}
                    options={[
                      { value: '10', label: t('videoGeneration.form.seconds').replace('{sec}', '10') },
                      { value: '15', label: t('videoGeneration.form.seconds').replace('{sec}', '15') }
                    ]}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('videoGeneration.form.sizeLabel')}</label>
                <SystemSelect
                  className="select-input"
                  value={imgSize}
                  onChange={(val) => setImgSize(val)}
                  options={[
                    { value: 'small', label: t('videoGeneration.form.sizeSmall') },
                    { value: 'large', label: t('videoGeneration.form.sizeLarge') }
                  ]}
                />
              </div>

              <div className="button-group">
                <button
                  className="button button-secondary"
                  onClick={handleClear}
                  disabled={loading || polling}
                >
                  {t('videoGeneration.form.clear')}
                </button>
                <button
                  className="button button-primary"
                  onClick={handleImageToVideo}
                  // 允许使用已上传但尚未同步到 imageUrl 的 URL，避免必须手动点击提示词框触发刷新
                  disabled={
                    loading ||
                    polling ||
                    !(uploadedImage?.url || imageUrl) ||
                    !prompt.trim() ||
                    !canStartTask('image')
                  }
                >
                  {loading ? t('videoGeneration.form.submitting') : polling ? t('videoGeneration.form.generating') : t('videoGeneration.form.submit')}
                  {!loading && !polling && getCreditDisplay('sora_watermark_free')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'enhance' && (
            <div className="generation-form">
              <div className="form-group">
                <label>{t('videoGeneration.form.uploadVideoLabel')}</label>
                <div 
                  className={`image-upload-area ${isDraggingVideo ? 'dragging' : ''} ${uploadedVideo ? 'has-image' : ''}`}
                  onDragOver={handleVideoDragOver}
                  onDragLeave={handleVideoDragLeave}
                  onDrop={handleVideoDrop}
                  onClick={openVideoPicker}
                  title={uploadedVideo ? '点击更换视频' : undefined}
                  role="button"
                >
                  {!uploadedVideo ? (
                    <div className="upload-placeholder">
                      <FiUpload className="upload-icon" />
                      <p className="upload-text">{t('videoGeneration.form.uploadVideoDrop')}</p>
                    </div>
                  ) : (
                    <div className="uploaded-image-preview" style={{ position: 'relative' }}>
                      {uploadedVideoDuration != null && !isNaN(uploadedVideoDuration) && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: 'rgba(0,0,0,0.6)',
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: 6,
                            fontSize: 12,
                            lineHeight: 1.4
                          }}
                          title="检测到的视频时长"
                        >
                          ⏱ {Math.round(uploadedVideoDuration * 10) / 10}s
                        </div>
                      )}
                      <video src={uploadedVideo.preview} controls style={{ maxWidth: '100%', maxHeight: '100%' }} />
                      <button 
                        type="button"
                        className="clear-preview-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          try { if (uploadedVideo?.preview) URL.revokeObjectURL(uploadedVideo.preview); } catch {}
                          setUploadedVideo(null);
                          setUploadedVideoDuration(null);
                          setVideoUrl('');
                          if (videoFileInputRef.current) videoFileInputRef.current.value = '';
                        }}
                        aria-label="移除"
                      >✕</button>
                    </div>
                  )}
                  {/* Hide upload progress for cleaner UX */}
                </div>
                <input
                  ref={videoFileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoFileSelect}
                  style={{ display: 'none' }}
                />
              </div>
              
              {/* Resolution selection removed as new API does not require it */}

              <div className="button-group">
                <button
                  className="button button-secondary"
                  onClick={handleClear}
                  disabled={loading}
                >
                  {t('videoGeneration.form.clear')}
                </button>
                <button
                  className="button button-primary"
                  onClick={handleVideoEnhance}
                  disabled={loading || !videoUrl}
                >
                  {loading ? t('videoGeneration.form.enhancing') : t('videoGeneration.form.enhanceSubmit')}
                  {!loading && getCreditDisplay('video_enhance')}
                </button>
              </div>
            </div>
          )}

          {/* 任务 ID 与生成进度模块已移除，右侧结果区在生成时显示加载动画 */}
        </div>

        <div className={`gen-right ${activeTab === 'enhance' ? 'enhance' : ''}`}>
          <div className="result-placeholder" style={{ width: '100%', height: '100%' }}>
            {activeTab === 'enhance' ? (
              // 增强页采用任务卡片网格，与图生视频一致
              <TaskPanel page={'enhance'} />
            ) : (
              // 文生/图生页面显示任务网格
              <TaskPanel page={activeTab === 'image-to-video' ? 'image' : 'text'} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoGeneration;

