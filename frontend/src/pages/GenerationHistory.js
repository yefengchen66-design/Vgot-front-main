import React, { useState, useEffect } from 'react';
import { FiImage, FiVideo, FiMic, FiFilter, FiTrash2 } from 'react-icons/fi';
import { HiDownload } from 'react-icons/hi';
// Use themed stylesheet only (original CSS removed due to syntax errors)
import './GenerationHistory.theme.css';
import historyService from '../services/historyService';
import { useLanguage } from '../contexts/LanguageContext';

function GenerationHistory() {
  const { t, lang } = useLanguage();
  const [historyRecords, setHistoryRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'image', 'video', 'audio'
  const [stats, setStats] = useState({ total_records: 0, images: 0, videos: 0, audios: 0 });
  const [historyCache, setHistoryCache] = useState(new Map());

  useEffect(() => {
    // 清理超过3天的旧记录（后端会同时删除 Supabase Storage 和数据库）
    // 非阻塞：清理完成后再刷新列表与统计
    (async () => {
      try {
        await historyService.cleanupOld(3);
      } catch (e) {
        console.warn('Cleanup old history failed (ignored):', e?.message || e);
      } finally {
        fetchHistoryRecords();
        fetchHistoryStats();
      }
    })();
  }, [filterType]);

  const fetchHistoryRecords = async () => {
    const cacheKey = `${filterType}`;
    if (historyCache.has(cacheKey)) {
      setHistoryRecords(historyCache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const filters = { limit: 100 };
      if (filterType !== 'all') {
        filters.content_type = filterType;
      }
      // source page filter removed per design

      const records = await historyService.getUserHistory(filters);
      setHistoryRecords(records);
      setHistoryCache(new Map(historyCache.set(cacheKey, records)));
    } catch (error) {
      console.error('Failed to fetch history records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryStats = async () => {
    try {
      const statsData = await historyService.getHistoryStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch history stats:', error);
    }
  };

  // Removed copy-to-clipboard to avoid exposing direct storage links

  const downloadFile = async (url, filename, contentType) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;

      // Generate filename based on content type and timestamp
      const timestamp = new Date().getTime();
      const extension = contentType === 'image' ? 'png' : contentType === 'video' ? 'mp4' : 'mp3';
      link.download = filename || `vgot_${contentType}_${timestamp}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const deleteRecord = async (record) => {
    if (!record?.file_url) return;
    const ok = window.confirm(t('history.meta.deleteConfirm') || '确定要删除该生成记录吗？这将同时清理数据库记录和（如是 Supabase 存储）对象文件。');
    if (!ok) return;
    try {
      await historyService.deleteByFileUrl(record.file_url);
      // 从当前列表移除该卡片
      setHistoryRecords((prev) => prev.filter((r) => r.id !== record.id));
      // 刷新统计
      try { const statsData = await historyService.getHistoryStats(); setStats(statsData); } catch {}
    } catch (error) {
      console.error('Delete record failed:', error);
      alert(t('history.meta.deleteFail') || '删除失败，请稍后重试');
    }
  };

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case 'image': return <FiImage size={16} />;
      case 'video': return <FiVideo size={16} />;
      case 'audio': return <FiMic size={16} />;
      default: return <FiImage size={16} />;
    }
  };

  const getContentTypeName = (contentType) => {
    switch (contentType) {
      case 'image': return t('history.types.image');
      case 'video': return t('history.types.video');
      case 'audio': return t('history.types.audio');
      default: return t('history.types.unknown');
    }
  };

  const getContentSubtypeName = (contentSubtype) => {
    const subtypeMap = {
      'text_to_image': t('history.types.subtypes.text_to_image'),
      'image_to_image': t('history.types.subtypes.image_to_image'),
      'image_upscale': t('history.types.subtypes.image_upscale'),
      'text_to_video': t('history.types.subtypes.text_to_video'),
      'image_to_video': t('history.types.subtypes.image_to_video'),
      'digital_human_video': t('history.types.subtypes.digital_human_video'),
      'video_upscale': t('history.types.subtypes.video_upscale'),
      'video_enhance': t('history.types.subtypes.video_enhance'),
      'text_to_speech': t('history.types.subtypes.text_to_speech'),
      'voice_clone': t('history.types.subtypes.voice_clone'),
      'audio_enhance': t('history.types.subtypes.audio_enhance')
    };
    return subtypeMap[contentSubtype] || '';
  };

  if (loading) {
    return (
      <div className="page generation-history-page">
        <div className="page-header">
          <h1 className="page-title">{t('history.title')}</h1>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t('history.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page generation-history-page">
      <div className="page-header">
        <h1 className="page-title">{t('history.title')}</h1>
        <p className="page-subtitle">{t('history.subtitle')}</p>

        {/* 统计信息 */}
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{stats.total_records}</span>
            <span className="stat-label">{t('history.stats.total')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.images}</span>
            <span className="stat-label">{t('history.stats.images')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.videos}</span>
            <span className="stat-label">{t('history.stats.videos')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.audios}</span>
            <span className="stat-label">{t('history.stats.audios')}</span>
          </div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">
            <FiFilter size={16} />
            {t('history.filters.type')}
          </label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              {t('history.filters.all')}
            </button>
            <button
              className={`filter-btn ${filterType === 'image' ? 'active' : ''}`}
              onClick={() => setFilterType('image')}
            >
              <FiImage size={14} />
              {t('history.filters.image')}
            </button>
            <button
              className={`filter-btn ${filterType === 'video' ? 'active' : ''}`}
              onClick={() => setFilterType('video')}
            >
              <FiVideo size={14} />
              {t('history.filters.video')}
            </button>
            <button
              className={`filter-btn ${filterType === 'audio' ? 'active' : ''}`}
              onClick={() => setFilterType('audio')}
            >
              <FiMic size={14} />
              {t('history.filters.audio')}
            </button>
          </div>
        </div>

        {/* Source page filter removed as requested */}
      </div>

      {/* 历史记录列表 */}
      {historyRecords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>{t('history.empty.title')}</h3>
          <p>{t('history.empty.hint')}</p>
        </div>
      ) : (
        <div className="history-grid">
          {historyRecords.map((record) => (
            <div key={record.id} className="history-card">
              <div className="card-header">
                <div className="content-type-badge">
                  {getContentIcon(record.content_type)}
                  <span>
                    {getContentTypeName(record.content_type)}
                    {record.content_subtype && (
                      <small className="subtype-text"> · {getContentSubtypeName(record.content_subtype)}</small>
                    )}
                  </span>
                </div>
                <div className="source-badge">
                  {record.source_page === 'VideoGeneration'
                    ? t('history.filters.sourceVG')
                    : record.source_page === 'HyperSell'
                      ? 'HyperSell'
                      : t('history.filters.sourceDH')}
                </div>
              </div>

              <div className="card-media">
                {record.content_type === 'image' && record.file_url && (
                  <img
                    src={record.file_url}
                    alt={record.prompt || 'Generated image'}
                    loading="lazy"
                  />
                )}
                {record.content_type === 'video' && record.file_url && (
                  <video
                    src={record.file_url}
                    controls
                    preload="metadata"
                    playsInline
                    controlsList="nodownload noplaybackrate"
                  />
                )}
                {record.content_type === 'audio' && record.file_url && (
                  <div className="audio-player">
                    <div className="audio-icon">
                      <FiMic size={32} />
                    </div>
                    {/* Hide download control and harden UI against casual copying */}
                    <audio
                      controls
                      src={record.file_url}
                      controlsList="nodownload noplaybackrate"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                )}
              </div>

              <div className="card-content">
                <div className="card-prompt">
                  {record.prompt ? (
                    record.prompt.length > 100
                      ? record.prompt.substring(0, 100) + '...'
                      : record.prompt
                  ) : t('history.meta.noPrompt')}
                </div>

                <div className="card-meta">
                  {record.dimensions && (
                    <span className="meta-item">{t('history.meta.size')}: {record.dimensions}</span>
                  )}
                  {record.duration && (
                    <span className="meta-item">{t('history.meta.duration')}: {t('history.meta.seconds').replace('{sec}', String(record.duration))}</span>
                  )}
                </div>

                <div className="card-footer">
                  <div className="card-date">
                    {new Date(record.created_at).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  {/* 操作按钮（已移除复制） */}
                  <div className="card-actions">
                    <button
                      className="action-btn delete-btn"
                      onClick={() => deleteRecord(record)}
                      title={t('history.meta.deleteTitle') || '删除'}
                    >
                      <FiTrash2 />
                    </button>
                    {record.file_url && (
                      <>
                        <button
                          className="action-btn download-btn"
                          onClick={() => downloadFile(record.file_url, record.prompt, record.content_type)}
                          title={t('history.meta.downloadTitle') || 'Download'}
                        >
                          <HiDownload />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GenerationHistory;

