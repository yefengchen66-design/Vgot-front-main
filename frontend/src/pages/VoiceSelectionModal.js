// VoiceSelectionModal.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSupabaseUpload } from '../hooks/useSupabaseUpload';
import './VoiceSelectionModal.css';

// 从环境变量获取API基础URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const VoiceSelectionModal = ({ isOpen, onClose, onSelectVoice, voices, selectedVoiceId }) => {
  // 初始化Supabase上传hook
  const { uploadFile, uploading, progress, error, resetError } = useSupabaseUpload('lixibin');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [textDescription, setTextDescription] = useState('');
  const [isTextFocused, setIsTextFocused] = useState(false);
  const [trialText, setTrialText] = useState('');
  const [voiceDescription, setVoiceDescription] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [trialAudio, setTrialAudio] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [isGeneratingTrial, setIsGeneratingTrial] = useState(false);

  // 滚动条显示控制：在滚动时为列表添加 .scrolling 类，停止滚动后延迟移除
  const voiceListRef = useRef(null);
  useEffect(() => {
    const el = voiceListRef.current;
    if (!el) return;

    let hideTimer = null;
    const onScrollActivity = () => {
      el.classList.add('scrolling');
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        el.classList.remove('scrolling');
      }, 700); // 与 SuperIP 侧边栏一致的感受
    };

    el.addEventListener('scroll', onScrollActivity, { passive: true });
    el.addEventListener('wheel', onScrollActivity, { passive: true });

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      el.removeEventListener('scroll', onScrollActivity);
      el.removeEventListener('wheel', onScrollActivity);
    };
  }, [isOpen, activeTab]);

  // Extract categories from voices data
  const categories = [
    { key: 'all', label: '全部音色' },
    { key: 'system_voice', label: '系统音色' },
    { key: 'voice_generation', label: '生成音色' },
    { key: 'custom', label: '自定义' }
  ];

  // Filter voices based on search term and category
  const filteredVoices = Object.keys(voices).flatMap(category => {
    if (selectedCategory !== 'all' && selectedCategory !== category) return [];

    return voices[category].filter(voice => {
      const matchesSearch = voice.voice_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           voice.voice_id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  });

  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
    onSelectVoice(voice);
  };

  const handlePlayVoice = (e, voice) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
    console.log('Playing voice:', voice.voice_name);
  };

  const handlePlayTrialAudio = (e) => {
    e.stopPropagation();
    if (!trialAudio) {
      alert('请先生成试听音频');
      return;
    }

    if (isPlaying) {
      // 停止播放
      setIsPlaying(false);
      if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
      }
    } else {
      // 播放hex音频
      try {
        // 将hex字符串转换为ArrayBuffer
        const hexString = trialAudio;
        const bytes = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
          bytes[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
        }

        // 创建Blob并生成音频URL
        const blob = new Blob([bytes], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);

        // 创建音频对象并播放
        const audio = new Audio(audioUrl);
        audio.play();
        window.currentAudio = audio;
        setIsPlaying(true);

        // 播放结束处理
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          window.currentAudio = null;
        };

        // 错误处理
        audio.onerror = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          window.currentAudio = null;
          alert('音频播放失败');
        };
      } catch (error) {
        console.error('播放音频失败:', error);
        alert('播放音频失败');
      }
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 清除之前的错误
    resetError();

    try {
      // 创建本地预览URL
      const localUrl = URL.createObjectURL(file);
      setUploadedImage(file);
      setImageUrl(localUrl);

      // 使用Supabase上传文件到voice_prompt文件夹
      const uploadResult = await uploadFile(file, 'voice_prompt');

      if (uploadResult.success) {
        console.log('Image uploaded successfully:', uploadResult.url);

        // 上传完成后调用音色设计接口
        await generateVoiceDescription(uploadResult.url);
      } else {
        throw new Error(uploadResult.error);
      }

    } catch (error) {
      console.error('上传失败:', error);
      alert(`上传失败: ${error.message}`);
      // 上传失败时清除本地预览
      setImageUrl('');
      setUploadedImage(null);
    }
  };

  const generateVoiceDescription = async (imageUrl) => {
    setIsGeneratingDescription(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/voice/design`, {
        image_url: imageUrl
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = response.data;
      console.log('音色设计API响应:', result);
      console.log('=== 完整的JSON响应结构 ===');
      console.log('完整响应JSON:', JSON.stringify(result, null, 2));
      console.log('响应类型:', typeof result);
      console.log('==========================');

      if (result.choices && result.choices.length > 0) {
        const firstChoice = result.choices[0];
        console.log('choices[0]内容:', JSON.stringify(firstChoice, null, 2));

        if (firstChoice.message && firstChoice.message.content) {
          const generatedDescription = firstChoice.message.content;
          setVoiceDescription(generatedDescription);
          console.log('=== 音色描述生成调试 ===');
          console.log('图片生成的音色描述:', generatedDescription);
          console.log('用户当前文本描述:', textDescription.trim());
          console.log('========================');
        } else {
          console.log('message结构:', JSON.stringify(firstChoice.message, null, 2));
          throw new Error('响应中未找到消息内容');
        }
      } else {
        console.log('choices字段:', result.choices);
        console.log('所有响应字段:', Object.keys(result));
        throw new Error('响应格式不正确，缺少choices字段');
      }
    } catch (error) {
      console.error('生成音色描述失败:', error);
      if (error.response) {
        // 服务器响应了错误状态码
        console.error('错误状态码:', error.response.status);
        console.error('错误数据:', error.response.data);
        alert(`生成音色描述失败: ${error.response.status} - ${error.response.data?.message || '服务器错误'}`);
      } else if (error.request) {
        // 请求已发出但没有收到响应
        console.error('网络错误:', error.request);
        alert('生成音色描述失败: 网络连接错误，请检查网络连接');
      } else {
        // 其他错误
        console.error('其他错误:', error.message);
        alert(`生成音色描述失败: ${error.message}`);
      }
      // 发生错误时清除相关状态
      setVoiceDescription('');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const generateTrialAudio = async () => {
    // 优先使用文本描述，如果没有则使用图片生成的描述
    const effectivePrompt = textDescription.trim() || voiceDescription.trim();

    // 调试：打印音色提示词变量
    console.log('=== 音色生成调试信息 ===');
    console.log('用户输入的文本描述:', textDescription.trim());
    console.log('图片生成的音色描述:', voiceDescription.trim());
    console.log('使用的有效提示词:', effectivePrompt);
    console.log('试听文本:', trialText.trim());
    console.log('========================');

    if (!trialText.trim() || !effectivePrompt) {
      alert('请输入试听文本和音色描述');
      return;
    }

    setIsGeneratingTrial(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/avatar/shiting`, {
        prompt: effectivePrompt,
        text: trialText
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = response.data;
      console.log('试听音频API响应:', result);

      if (result.trial_audio) {
        setTrialAudio(result.trial_audio);
        console.log('试听音频生成成功');
      }
      if (result.voice_id) {
        setVoiceId(result.voice_id);
        console.log('音色ID获取成功:', result.voice_id);
      }
    } catch (error) {
      console.error('生成试听音频失败:', error);
      if (error.response) {
        // 服务器响应了错误状态码
        console.error('错误状态码:', error.response.status);
        console.error('错误数据:', error.response.data);
        alert(`生成试听音频失败: ${error.response.status} - ${error.response.data?.message || '服务器错误'}`);
      } else if (error.request) {
        // 请求已发出但没有收到响应
        console.error('网络错误:', error.request);
        alert('生成试听音频失败: 网络连接错误，请检查本地服务器是否运行在8000端口');
      } else {
        // 其他错误
        console.error('其他错误:', error.message);
        alert(`生成试听音频失败: ${error.message}`);
      }
    } finally {
      setIsGeneratingTrial(false);
    }
  };

  const handleImageRemove = () => {
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    setUploadedImage(null);
    setImageUrl('');
  };

  if (!isOpen) return null;

  const renderTabContent = () => {
    if (activeTab === 'custom') {
      return (
        <div className="custom-content">
          <div className="custom-left">
            <div className="custom-form">
              <h3>自定义音色配置</h3>
              <div className="form-group">
                <label>试听文本</label>
                <textarea
                  placeholder="请输入试听文本"
                  value={trialText}
                  onChange={(e) => setTrialText(e.target.value)}
                  style={{
                    minHeight: '80px',
                    resize: 'none'
                  }}
                ></textarea>
              </div>
              <div className="image-upload-section">
                <div className="image-upload-container">
                  <div
                    className={`image-preview ${textDescription.length > 0 ? 'disabled' : ''}`}
                    onClick={() => {
                      if (textDescription.length === 0) {
                        document.getElementById('image-upload').click();
                      }
                    }}
                    style={{ cursor: textDescription.length > 0 ? 'not-allowed' : 'pointer' }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="image-upload"
                      disabled={textDescription.length > 0}
                    />
                    {imageUrl ? (
                      <>
                        <img src={imageUrl} alt="上传的图像" />
                        {voiceDescription && !isGeneratingDescription && (
                          <button
                            className="image-delete-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageRemove();
                            }}
                          >
                            ×
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="placeholder">
                        <p>点击选择图片</p>
                      </div>
                    )}
                  </div>
                  <div className="image-upload-info">
                    <p>上传参考图像</p>
                    <small>支持JPG、PNG格式，最大5MB</small>
                    {uploading && (
                      <div className="upload-progress">
                        <div
                          className="upload-progress-bar"
                          style={{ width: `${progress}%` }}
                        ></div>
                        <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                          上传中... {progress}%
                        </div>
                      </div>
                    )}
                    {error && (
                      <div style={{ marginTop: '8px', color: '#f44336', fontSize: '12px' }}>
                        上传失败: {error}
                      </div>
                    )}
                    {isGeneratingDescription && (
                      <div style={{ marginTop: '8px', color: '#4CAF50', fontSize: '12px' }}>
                        解析中的音效效果...
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>或</label>
                <textarea
                  placeholder="描述音色特征"
                  disabled={uploading || imageUrl}
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                  onFocus={() => setIsTextFocused(true)}
                  onBlur={() => setIsTextFocused(false)}
                  style={{
                    cursor: uploading || imageUrl ? 'not-allowed' : 'text',
                    opacity: uploading || imageUrl ? 0.6 : 1
                  }}
                ></textarea>
              </div>
                <button
                  className="create-button"
                  onClick={generateTrialAudio}
                  disabled={(!trialText.trim() || !(textDescription.trim() || voiceDescription.trim())) || isGeneratingTrial}
                  style={{
                    background: (!trialText.trim() || !(textDescription.trim() || voiceDescription.trim())) || isGeneratingTrial ? '#ccc' : '#4CAF50',
                    cursor: (!trialText.trim() || !(textDescription.trim() || voiceDescription.trim())) || isGeneratingTrial ? 'not-allowed' : 'pointer',
                    opacity: (!trialText.trim() || !(textDescription.trim() || voiceDescription.trim())) || isGeneratingTrial ? 0.6 : 1
                  }}
                >
                  {isGeneratingTrial ? '生成中...' : '预览音色生成'}
                </button>
            </div>
          </div>
          <div className="custom-right">
            <div className="preview-panel">
              <h3>音色预览</h3>
              <div className="preview-area">
                <button className="preview-play-button" onClick={handlePlayTrialAudio}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <p>试听</p>
              </div>
              <div className="preview-info">
                <p>
                  {trialAudio ? '音效已生成，点击试听' :
                   (textDescription.trim() || voiceDescription.trim()) ?
                   '输入试听文本后可预览音色效果' :
                   '请输入音色描述或上传图片后预览效果'}
                </p>
              </div>
            </div>
            <button
              className="create-button"
              onClick={() => {
                if (voiceId) {
                  onSelectVoice({
                    voice_id: voiceId,
                    voice_name: '自定义音色',
                    description: [textDescription.trim() || voiceDescription.trim() || '自定义音色'],
                    custom: true
                  });
                  onClose();
                }
              }}
              disabled={!voiceId}
              style={{
                background: voiceId ? '#4CAF50' : '#ccc',
                cursor: voiceId ? 'pointer' : 'not-allowed',
                opacity: voiceId ? 1 : 0.6
              }}
            >
              选择音色
            </button>
          </div>
        </div>
      );
    }

    // 其他标签页的内容
    return (
      <>
        <div className="search-container">
          <input
            type="text"
            placeholder="搜索音色..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

  <div className="voice-list" ref={voiceListRef}>
          {filteredVoices.length > 0 ? (
            filteredVoices.map(voice => (
              <div
                key={voice.voice_id}
                className={`voice-item ${selectedVoice?.voice_id === voice.voice_id || selectedVoiceId === voice.voice_id ? 'selected' : ''}`}
                onClick={() => handleVoiceSelect(voice)}
              >
                <button
                  className="voice-play-button"
                  onClick={(e) => handlePlayVoice(e, voice)}
                >
                  {isPlaying && selectedVoice?.voice_id === voice.voice_id ? '⏸' : '▶'}
                </button>
                <div className="voice-info">
                  <h3>{voice.voice_name || '未命名音色'}</h3>
                  <p className="voice-description">{voice.description && voice.description.length > 0 ? voice.description[0] : '暂无描述'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-voices">未找到音色</div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="tab-container">
            {categories.map(category => (
              <button
                key={category.key}
                className={`tab-button ${activeTab === category.key ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(category.key);
                  setSelectedCategory(category.key);
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
   );
};

export default VoiceSelectionModal;