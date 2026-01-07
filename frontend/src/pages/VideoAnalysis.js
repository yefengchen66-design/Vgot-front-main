import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Copy } from 'lucide-react';
import './VideoAnalysis.css';
import { useSupabaseUpload } from '../hooks/useSupabaseUpload';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { useUsage } from '../contexts/UsageContext';
import { API_ENDPOINTS } from '../config/api';

export default function VideoAnalysis() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisMode, setAnalysisMode] = useState('script'); // 'script', 'scene', 'rewrite'
  const [resultScrolling, setResultScrolling] = useState(false); // 控制滚动条显示动画
  // 本地预览 URL（仅在用户选择文件但尚未上传时使用）
  const [localPreviewUrl, setLocalPreviewUrl] = useState('');
  const scrollTimeoutRef = useRef(null);
  // 使用全局 UsageContext
  const { dailyUsage, loading: usageLoading, initialized: usageInitialized, updateActionUsage, refresh: refreshUsage } = useUsage();

  // 初始化上传 hook，使用 'lixibin' bucket (与 SuperIP 保持一致)
  const { uploadFile } = useSupabaseUpload('lixibin');
  const [rewriteText, setRewriteText] = useState('');
  const [rewriteImageFile, setRewriteImageFile] = useState(null);
  const [rewriteImageUrl, setRewriteImageUrl] = useState('');
  const fileInputRef = useRef(null);
  const rewriteFileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // 简单判断链接是否像可播放的公开视频链接（避免出现 0 秒空播放器）
  const isLikelyPlayableVideoUrl = (url) => {
    if (!url) return false;
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return false; // 必须是 http/https
    // 常见视频后缀或含有播放直链特征的查询参数
    const hasVideoExt = /(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(trimmed);
    const hasStreamHint = /\b(video|stream|play|mp4)\b/i.test(trimmed);
    return hasVideoExt || hasStreamHint;
  };

  // 初次进入页面且尚未初始化时尝试立即刷新（确保登录后无需手动刷新）
  // useEffect(() => {
  //   if (user?.tier === 'Free' && location.pathname === '/video-analysis' && !usageInitialized) {
  //     refreshUsage();
  //   }
  // }, [user?.id, user?.tier, location.pathname, usageInitialized, refreshUsage]);
  // 结果变化时触发一次后端刷新（使用全局 refresh）
  // useEffect(() => {
  //   if (result && user?.tier === 'Free') {
  //     const timer = setTimeout(() => refreshUsage(), 600);
  //     return () => clearTimeout(timer);
  //   }
  // }, [result, user?.tier, refreshUsage]);

  // 使用全局 optimistic 更新函数
  const updateDailyUsage = (actionType) => updateActionUsage(actionType);

  // 获取按钮提示文本
  const getButtonHint = () => {
    console.log('🔍 Getting button hint, user:', user?.tier, 'mode:', analysisMode);
    console.log('📊 Daily usage state:', dailyUsage);

    if (!user) {
      console.log('⚠️ No user, returning empty');
      return '';
    }

    const actionTypeMap = {
      'script': 'script_extraction',
      'scene': 'script_analysis',
      'rewrite': 'script_rewrite'
    };

    const actionType = actionTypeMap[analysisMode];
    console.log('🎯 Action type:', actionType);

    if (user.tier === 'Free') {
      const usage = dailyUsage[actionType];
      console.log('💡 Usage data:', usage);

      if (!usage) {
        console.log('⚠️ No usage data found');
        return '';
      }

      // 根据语言返回不同格式的使用次数提示
      let hint = '';
      if (lang === 'zh') {
        hint = ` (今日剩余: ${usage.remaining}/${usage.limit})`;
      } else if (lang === 'zh-TW') {
        hint = ` (今日剩餘: ${usage.remaining}/${usage.limit})`;
      } else if (lang === 'en') {
        hint = ` (Remaining: ${usage.remaining}/${usage.limit})`;
      } else if (lang === 'es') {
        hint = ` (Restante: ${usage.remaining}/${usage.limit})`;
      } else {
        hint = ` (Remaining: ${usage.remaining}/${usage.limit})`;
      }

      console.log('✅ Hint:', hint);
      return hint;
    }

    console.log('✅ Not Free tier, returning empty');
    return '';  // 其他用户不显示
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setVideoUrl(''); // 清空URL输入
      // 生成本地预览 URL
      try {
        const preview = URL.createObjectURL(file);
        setLocalPreviewUrl(preview);
      } catch (err) {
        console.warn('Failed to create preview URL', err);
        setLocalPreviewUrl('');
      }
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);
    if (url.trim()) {
      setUploadedFile(null); // 清空已上传文件
    }
  };

  const handleClearFile = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setUploadedFile(null);
    if (localPreviewUrl) {
      try { URL.revokeObjectURL(localPreviewUrl); } catch (_) { }
    }
    setLocalPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoUrl.trim()) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (videoUrl.trim()) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setUploadedFile(file);
        setVideoUrl('');
        try {
          const preview = URL.createObjectURL(file);
          setLocalPreviewUrl(preview);
        } catch (err) {
          console.warn('Failed to create preview URL', err);
          setLocalPreviewUrl('');
        }
      } else {
        alert(t('videoAnalysis.alerts.invalidFileType', '请上传视频文件'));
      }
    }
  };

  const handleModeChange = (mode) => {
    setAnalysisMode(mode);
    // Clear all inputs and results
    setVideoUrl('');
    setUploadedFile(null);
    setResult(null);
    setRewriteText('');
    setRewriteImageFile(null);
    setRewriteImageUrl('');
    if (localPreviewUrl) {
      try { URL.revokeObjectURL(localPreviewUrl); } catch (_) { }
    }
    setLocalPreviewUrl('');

    // Clear file input value if ref exists
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Also clear the rewrite image input if it exists
    if (rewriteFileInputRef.current) {
      rewriteFileInputRef.current.value = '';
    }
  };

  const handleExtractScript = async () => {
    // 支持：如果用户上传了本地文件，先上传到 Supabase 获取 URL；否则使用输入的 URL
    let finalVideoUrl = videoUrl.trim();

    if (uploadedFile) {
      setLoading(true);
      try {
        // 复用与场景分析一致的上传逻辑（bucket: lixibin, folder: videos）
        const uploadResult = await uploadFile(uploadedFile, 'videos');
        if (uploadResult.success && uploadResult.url) {
          finalVideoUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error || 'Upload failed');
        }
      } catch (e) {
        console.error('Script mode upload error:', e);
        alert('视频上传失败: ' + (e.message || '未知错误'));
        setLoading(false);
        return;
      }
    }

    if (!finalVideoUrl) {
      alert(t('videoAnalysis.alerts.needUrl'));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.video.extractScript, {
        video_url: finalVideoUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);

      // 更新使用次数
      updateDailyUsage('script_extraction');
    } catch (error) {
      console.error('Extract script error:', error);
      alert(t('videoAnalysis.alerts.extractFail'));
    } finally {
      setLoading(false);
    }
  };

  const handleSceneAnalysis = async () => {
    let finalVideoUrl = videoUrl.trim();

    // 如果用户上传了文件，先上传到Supabase
    if (uploadedFile) {
      setLoading(true);
      try {
        console.log('Uploading file via useSupabaseUpload:', uploadedFile.name);

        // 使用 useSupabaseUpload hook 上传
        // 注意：这里 bucketName 使用 'generated-content' 或保持默认，取决于后端配置
        // SuperIP 使用的是 'lixibin'，我们这里尝试用 'generated-content'
        const result = await uploadFile(uploadedFile, 'videos');

        if (result.success && result.url) {
          finalVideoUrl = result.url;
          console.log('Video uploaded successfully:', finalVideoUrl);
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        const errorMessage = error.message || '未知错误';

        alert('视频上传失败: ' + errorMessage + '\n\n建议直接使用URL输入方式');
        setLoading(false);
        return;
      }
    }

    if (!finalVideoUrl) {
      alert('请上传视频或输入视频URL');
      setLoading(false);
      return;
    }

    // 使用流式API进行场景分析
    setLoading(true);
    setResult({ text: '' }); // 初始化结果

    try {
      const token = localStorage.getItem('token');
      console.log('Starting scene analysis with URL:', finalVideoUrl);

      const response = await fetch(API_ENDPOINTS.video.sceneAnalysis, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          video_url: finalVideoUrl
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error('场景分析请求失败');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let chunkCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream ended, total chunks:', chunkCount);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log('Received chunk:', chunk);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();

            if (data === '[DONE]') {
              console.log('Received [DONE] signal');
              setLoading(false);
              break;
            }

            try {
              const parsed = JSON.parse(data);
              console.log('Parsed data:', parsed);
              if (parsed.content) {
                chunkCount++;
                accumulatedText += parsed.content;
                setResult({ text: accumulatedText });
                console.log('Accumulated text length:', accumulatedText.length);
              } else if (parsed.error) {
                alert('分析出错: ' + parsed.error);
                setLoading(false);
                break;
              }
            } catch (e) {
              console.warn('JSON parse error:', e, 'Data:', data);
            }
          }
        }
      }

      console.log('Final accumulated text:', accumulatedText);

      // 更新使用次数
      if (accumulatedText) {
        updateDailyUsage('script_analysis');
      }
    } catch (error) {
      console.error('Scene analysis error:', error);
      alert('场景分析失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (analysisMode === 'rewrite') {
      if (!rewriteText.trim()) {
        alert(t('videoAnalysis.alerts.needRewriteText', '请输入需要改写的脚本内容'));
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        // 如果用户上传了图片，将其上传到 Supabase 并取得公网 URL
        let imageUrl = '';
        if (rewriteImageFile) {
          try {
            const uploadResult = await uploadFile(rewriteImageFile, 'superip/characters');
            if (uploadResult.success && uploadResult.url) {
              imageUrl = uploadResult.url;
              console.log('Image uploaded successfully:', imageUrl);
            } else {
              console.warn('Rewrite image upload failed, proceeding without image:', uploadResult.error);
              alert('图片上传失败，将不使用图片进行改写');
            }
          } catch (e) {
            console.error('Rewrite image upload error:', e);
            alert('图片上传出错，将不使用图片进行改写');
          }
        }

        const response = await axios.post(API_ENDPOINTS.script.rewrite, {
          script_text: rewriteText,
          image_url: imageUrl || undefined
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 处理响应数据，提取改写后的文本（后端会返回 { text: ... }）
        let rewrittenText = '';
        console.log('Response data:', response.data);
        if (response.data && response.data.text) {
          rewrittenText = response.data.text;
        } else if (response.data && response.data.output && Array.isArray(response.data.output)) {
          // 兼容直接把后端原始结果透传的情况
          for (const out of response.data.output) {
            if (out.type === 'message' && Array.isArray(out.content)) {
              for (const c of out.content) {
                if (c.type === 'output_text' && c.text) {
                  rewrittenText = c.text;
                  break;
                }
              }
            }
            if (rewrittenText) break;
          }
        } else if (response.data && typeof response.data === 'string') {
          rewrittenText = response.data;
        } else {
          rewrittenText = `无法解析响应格式: ${JSON.stringify(response.data, null, 2)}`;
        }

        setResult({ text: rewrittenText || '脚本改写完成，但未能获取结果内容' });
        updateDailyUsage('script_rewrite');
      } catch (error) {
        alert(t('videoAnalysis.alerts.rewriteFail', '脚本改写失败'));
        console.error('Script rewrite error:', error);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (analysisMode === 'scene') {
      await handleSceneAnalysis();
      return;
    }

    if (!uploadedFile && !videoUrl.trim()) {
      alert(t('videoAnalysis.alerts.needInput'));
      return;
    }
    setLoading(true);
    try {
      if (analysisMode === 'script') {
        await handleExtractScript();
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="page video-analysis-page">
      <div className="page-header">
        <h1 className="page-title">{t('videoAnalysis.title')}</h1>
        <p className="page-subtitle">{t('videoAnalysis.subtitle')}</p>
      </div>

      <div className="analysis-container">
        {/* 左侧容器 - 输入和选项 */}
        <div className="analysis-left">
          <div className="analysis-input-section glass-card">
            {analysisMode === 'rewrite' ? (
              // 脚本改写模式：显示文本输入框
              <div className="rewrite-block">
                <h3 className="rewrite-title">{t('videoAnalysis.optionRewriteTitle')}</h3>
                <div className="rewrite-columns">
                  <div className="rewrite-column rewrite-column-left">
                    <div className="textarea-container">
                      <textarea
                        className="rewrite-textarea"
                        placeholder={t('videoAnalysis.rewritePlaceholder', '输入产品信息')}
                        value={rewriteText}
                        onChange={(e) => setRewriteText(e.target.value)}
                        rows={6}
                      />
                      <div className="rewrite-actions">
                        <button
                          type="button"
                          className="button button-secondary"
                          onClick={() => setRewriteText('')}
                          disabled={!rewriteText}
                        >
                          {t('videoAnalysis.clearButton', '清除')}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rewrite-column rewrite-column-right">
                    {/* 使用与画面分析相同样式的上传区域（拖拽/点击） */}
                    <div
                      className={`upload-area ${rewriteImageFile ? 'has-file' : ''}`}
                      onClick={() => {
                        if (rewriteFileInputRef.current) {
                          rewriteFileInputRef.current.click();
                        }
                      }}
                    >
                      {/* 仅在未选择图片时显示图标与标题 */}
                      {!rewriteImageFile && (
                        <>
                          <div className="va-upload-icon">
                            <UploadCloud size={40} strokeWidth={1.5} />
                          </div>
                          <h3>{t('videoAnalysis.uploadImageTitle') || 'Drag & drop or click to upload'}</h3>
                        </>
                      )}
                      <input
                        id="rewrite-image-upload"
                        type="file"
                        accept="image/*"
                        className="file-input"
                        ref={rewriteFileInputRef}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setRewriteImageFile(f);
                            try { setRewriteImageUrl(URL.createObjectURL(f)); } catch (err) { setRewriteImageUrl(''); }
                          }
                        }}
                      />
                      {rewriteImageFile && (
                        <div className="file-info" style={{
                          marginTop: 0,
                          width: '100%',
                          height: '100%',
                          maxWidth: '100%',
                          maxHeight: '100%',
                          padding: 0,
                          border: 'none',
                          background: 'rgba(0,0,0,0.6)',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: '12px',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxSizing: 'border-box'
                        }}>
                          {rewriteImageUrl ? (
                            <img
                              src={rewriteImageUrl}
                              alt="Preview"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain',
                                objectPosition: 'center',
                                display: 'block'
                              }}
                            />
                          ) : (
                            <span>{rewriteImageFile.name}</span>
                          )}
                          <button
                            type="button"
                            className="clear-preview-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRewriteImageFile(null);
                              setRewriteImageUrl('');
                              if (rewriteFileInputRef.current) {
                                rewriteFileInputRef.current.value = '';
                              }
                            }}
                            title={t('videoAnalysis.clearFile')}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 其他模式：显示上传和URL输入
              <>
                <div
                  className={`upload-area ${uploadedFile ? 'has-preview' : 'empty'} ${isDragging ? 'dragging' : ''}`}
                  onClick={() => {
                    if (!videoUrl.trim() && fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{ cursor: videoUrl.trim() ? 'not-allowed' : 'pointer' }}
                  title={videoUrl.trim() ? (t('videoAnalysis.uploadDisabledTooltip') || '已填写URL，禁止本地上传') : undefined}
                >
                  {/* 空状态显示图标与标题：仅当没有本地文件时显示（URL 不触发预览） */}
                  {!uploadedFile && (
                    <>
                      <div className="va-upload-icon">
                        <UploadCloud size={48} strokeWidth={1.5} />
                      </div>
                      <h3>{t('videoAnalysis.uploadTitle')}</h3>
                    </>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="file-input"
                    id="file-upload"
                    ref={fileInputRef}
                    disabled={!!videoUrl.trim()} // 有URL时禁用上传
                  />
                  {/* 去掉“选择视频”按钮，点击整个区域触发选择 */}
                  {/* 已去除文件名显示，仅保留视频预览 */}
                  {/* 去除多余提示，仅保留上方主提示与按钮 */}
                  {/* 视频预览（本地文件或URL） */}
                  {uploadedFile && (
                    <div
                      className="video-preview-wrapper"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {uploadedFile && (
                        <button
                          type="button"
                          className="clear-preview-btn"
                          onClick={handleClearFile}
                          title={t('videoAnalysis.clearFile')}
                          aria-label={t('videoAnalysis.clearFile')}
                        >
                          ×
                        </button>
                      )}
                      <video
                        className="video-preview"
                        src={localPreviewUrl}
                        controls
                        playsInline
                        preload="metadata"
                      />
                    </div>
                  )}
                </div>

                <div className="url-input-section">
                  <label>{analysisMode === 'scene' ? t('videoAnalysis.urlLabelBasic') : t('videoAnalysis.urlLabel')}</label>
                  <input
                    type="text"
                    className="input"
                    placeholder={analysisMode === 'scene'
                      ? 'https://xxxxx/xxxx/xxxxxx/xxx/videos/1764299517559_106q6au.mp4'
                      : t('videoAnalysis.placeholder')}
                    value={videoUrl}
                    onChange={handleUrlChange}
                    disabled={!!uploadedFile}
                    title={uploadedFile ? (t('videoAnalysis.urlDisabledTooltip') || '已选择本地视频，URL输入已禁用') : undefined}
                    style={{ cursor: uploadedFile ? 'not-allowed' : 'text' }}
                  />
                </div>
              </>
            )}
          </div>

          <div className="analysis-options glass-card">
            <h3>{t('videoAnalysis.optionsTitle')}</h3>
            <div className="option-cards">
              <div
                className={`option-card ${analysisMode === 'script' ? 'active' : ''}`}
                onClick={() => handleModeChange('script')}
              >
                <h4>{t('videoAnalysis.optionScriptTitle')}</h4>
                <p>{t('videoAnalysis.optionScriptDesc')}</p>
              </div>
              <div
                className={`option-card ${analysisMode === 'scene' ? 'active' : ''}`}
                onClick={() => handleModeChange('scene')}
              >
                <h4>{t('videoAnalysis.optionSceneTitle')}</h4>
                <p>{t('videoAnalysis.optionSceneDesc')}</p>
              </div>
              <div
                className={`option-card ${analysisMode === 'rewrite' ? 'active' : ''}`}
                onClick={() => handleModeChange('rewrite')}
              >
                <h4>{t('videoAnalysis.optionRewriteTitle')}</h4>
                <p>{t('videoAnalysis.optionRewriteDesc')}</p>
              </div>
            </div>
          </div>

          <button
            className="button button-primary"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {(() => {
              if (loading) {
                return t('videoAnalysis.loadingText');
              }

              const actionType = analysisMode === 'script' ? 'script_extraction' : analysisMode === 'scene' ? 'script_analysis' : 'script_rewrite';
              const usageData = dailyUsage[actionType];

              // 根据语言显示"剩余"文本
              const getRemainingText = () => {
                if (lang === 'zh') return '剩余';
                if (lang === 'zh-TW') return '剩餘';
                if (lang === 'en') return 'Remaining';
                if (lang === 'es') return 'Restante';
                return 'Remaining';
              };

              return (
                <>
                  {t('videoAnalysis.startAnalyze')}
                  {user && dailyUsage && (
                    <span style={{ fontSize: '0.85em', opacity: 0.9 }}>
                      {usageLoading ? (
                        <> ...</>
                      ) : usageData ? (
                        <> ({getRemainingText()}: {usageData.remaining}/{usageData.limit})</>
                      ) : null}
                    </span>
                  )}
                </>
              );
            })()}
          </button>
        </div>

        {/* 右侧容器 - 结果显示 */}
        <div className={`analysis-right glass-card ${analysisMode === 'scene' ? 'scene-mode' : ''}`}>
          {loading ? (
            <div className="result-loading">
              <div className="spinner"></div>
              <p>{t('videoAnalysis.loadingText')}</p>
            </div>
          ) : result ? (
            <div className="result-section">
              <div className="result-header">
                <h3>{t('videoAnalysis.resultTitle')}</h3>
              </div>
              <div
                className={`result-merged ${resultScrolling ? 'scrolling' : ''}`}
                onScroll={() => {
                  if (!resultScrolling) setResultScrolling(true);
                  if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                  scrollTimeoutRef.current = setTimeout(() => setResultScrolling(false), 900);
                }}
              >
                {(() => {
                  // 优先使用后端直接返回的整体文本，否则将分句拼接
                  const merged = (result?.text && String(result.text).trim())
                    || (Array.isArray(result?.content)
                      ? result.content
                        .map(it => (it && it.text ? String(it.text).trim() : ''))
                        .filter(Boolean)
                        .join(' ')
                      : '');
                  return (
                    <div className="text-with-copy">
                      <p className="merged-text">{merged || t('videoAnalysis.resultPlaceholder')}</p>
                      {merged && (
                        <div className="result-actions" data-position="corner">
                          <button
                            type="button"
                            className="icon-button copy-button"
                            title={t('common.copy') || '复制'}
                            aria-label={t('common.copy') || '复制'}
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(merged);
                                alert(t('common.copied') || '已复制');
                              } catch (err) {
                                console.error('Failed to copy text: ', err);
                              }
                            }}
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              {/* 浮动清除按钮：位于结果区域外部右下角稍微往上 */}
              <button
                type="button"
                className="clear-result-floating"
                onClick={() => setResult(null)}
                title={t('common.clear') || '清除'}
              >
                {t('common.clear') || '清除'}
              </button>
            </div>
          ) : (
            <div className="result-placeholder">
              <h3>{t('videoAnalysis.resultTitle')}</h3>
              <p>{t('videoAnalysis.resultPlaceholder')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}