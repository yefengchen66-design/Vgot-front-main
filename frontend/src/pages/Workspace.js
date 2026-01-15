import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiVideo, FiMessageSquare} from 'react-icons/fi';
import { FaChild } from "react-icons/fa";
import './Workspace.css';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function Workspace() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const videoRefs = useRef([]);
  const [inspirations, setInspirations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从 localStorage 获取缓存的数据
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem('hot_inspirations');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // 检查缓存是否过期（5分钟）
        const now = Date.now();
        const CACHE_DURATION = 5 * 60 * 1000; // 5分钟
        if (now - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.error('读取缓存失败:', error);
    }
    return null;
  };

  // 将数据保存到 localStorage
  const setCachedData = (data) => {
    try {
      localStorage.setItem('hot_inspirations', JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('保存缓存失败:', error);
    }
  };

  // 从后端 API 获取热门灵感数据
  const fetchInspirations = async () => {
    try {
      // 先尝试使用缓存数据
      const cachedData = getCachedData();
      if (cachedData && cachedData.length > 0) {
        setInspirations(cachedData);
        setLoading(false);
        // 后台静默更新
        fetchFromAPI();
        return;
      }

      // 如果没有缓存，直接从 API 获取
      await fetchFromAPI();
    } catch (error) {
      console.error('获取热门灵感失败:', error);
      setLoading(false);
    }
  };

  // 从 API 获取数据
  const fetchFromAPI = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hot-inspirations`);
      if (response.ok) {
        const data = await response.json();
        setInspirations(data);
        setCachedData(data);
        setLoading(false);
      } else {
        console.error('API 请求失败:', response.status);
        setLoading(false);
      }
    } catch (error) {
      console.error('API 请求错误:', error);
      setLoading(false);
    }
  };

  // 复制提示词到剪贴板
  const copyPromptToClipboard = (prompt, event) => {
    event.stopPropagation(); // 防止触发视频播放
    navigator.clipboard.writeText(prompt).then(() => {
      toast.success(t('workspace.promptCopied') || '提示词已复制到剪贴板');
    }).catch(err => {
      console.error('复制失败:', err);
      toast.error(t('workspace.copyFailed') || '复制失败，请重试');
    });
  };

  useEffect(() => {
    // 初始加载数据
    fetchInspirations();

    // 设置定时刷新（每5分钟）
    const interval = setInterval(() => {
      fetchFromAPI();
    }, 5 * 60 * 1000); // 5分钟

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handlePlay = (event) => {
      event.target.parentElement.classList.add('video-playing');
    };

    const handlePause = (event) => {
      event.target.parentElement.classList.remove('video-playing');
    };

    const handleMouseEnter = (event) => {
      event.currentTarget.classList.add('video-hover');
    };

    const handleMouseLeave = (event) => {
      event.currentTarget.classList.remove('video-hover');
    };

    const videoElements = videoRefs.current;
    videoElements.forEach(video => {
      if (video) {
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.parentElement.addEventListener('mouseenter', handleMouseEnter);
        video.parentElement.addEventListener('mouseleave', handleMouseLeave);
      }
    });

    return () => {
      videoElements.forEach(video => {
        if (video) {
          video.removeEventListener('play', handlePlay);
          video.removeEventListener('pause', handlePause);
          if (video.parentElement) {
            video.parentElement.removeEventListener('mouseenter', handleMouseEnter);
            video.parentElement.removeEventListener('mouseleave', handleMouseLeave);
          }
        }
      });
    };
  }, []);

  return (
    <div className="page workspace-page">
      <div className="page-header">
        <h1 className="page-title">{t('workspace.title')}</h1>
      </div>

      <div className="action-cards grid grid-3">
        <div className="action-card" onClick={() => navigate('/video-generation')}>
          <div className="action-icon video-icon">
            <FiVideo />
          </div>
          <div className="action-content">
            <h3 className="action-title">{t('workspace.cards.generateTitle')}</h3>
            <p className="action-description">{t('workspace.cards.generateDesc')}</p>
          </div>
          {/* Removed Sora 2 badge per request */}
        </div>

        <div className="action-card" onClick={() => navigate('/video-analysis')}>
          <div className="action-icon analysis-icon">
            <FiMessageSquare />
          </div>
          <div className="action-content">
            <h3 className="action-title">{t('workspace.cards.analyzeTitle')}</h3>
            <p className="action-description">{t('workspace.cards.analyzeDesc')}</p>
          </div>
        </div>
    
          <div className="action-card" onClick={() => navigate('/super-ip')}>
          <div className="action-icon digitalhuman-icon">
            <FaChild />
          </div>
          <div className="action-content">
            <h3 className="action-title">{t('workspace.cards.digitalTitle')}</h3>
            <p className="action-description">{t('workspace.cards.digitalDesc')}</p>
          </div>
        </div>
      </div>

      <div className="powered-by">{t('workspace.poweredBy')}</div>

      {/* 爆款灵感 section */}
      <div className="viral-inspiration-section">
        <h2 className="section-title">{t('workspace.viralInspirationTitle')}</h2>
        <div className="video-grid">
          {loading ? (
            // 加载状态
            Array(8).fill(0).map((_, index) => (
              <div key={index} className="video-frame-placeholder loading">
                <div className="loading-spinner"></div>
              </div>
            ))
          ) : (
            // 显示视频内容
            inspirations.length > 0 ? (
              inspirations.map((inspiration, index) => (
                <div key={inspiration.id} className="video-frame-placeholder">
                  <div 
                    className="copy-prompt-tag" 
                    onClick={(e) => copyPromptToClipboard(inspiration.prompt, e)}
                    style={{ cursor: 'pointer' }}
                  >
                    {t('workspace.copyPrompt')}
                  </div>
                  <video 
                    ref={el => videoRefs.current[index] = el} 
                    src={inspiration.video_url} 
                    controls 
                    className="video-player"
                  ></video>
                </div>
              ))
            ) : (
              // 如果没有数据，显示空占位符
              Array(8).fill(0).map((_, index) => (
                <div key={index} className="video-frame-placeholder"></div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Workspace;

