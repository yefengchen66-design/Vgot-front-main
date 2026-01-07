import React, { useState } from 'react';
import axios from 'axios';
import { handleCreditError } from '../components/CreditAlerts';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

/**
 * 使用示例：脚本分析页面
 * 展示如何集成积分错误处理
 */
export default function ScriptAnalysisExample() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [alertComponent, setAlertComponent] = useState(null);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [remainingCredits, setRemainingCredits] = useState(null);

  const handleExtractScript = async () => {
    if (!videoUrl.trim()) {
      alert('请输入视频URL');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/video/extract-script`,
        { video_url: videoUrl },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // 处理成功响应
      setResult(response.data);
      
      // 显示积分使用信息
      if (response.data.credits_used !== undefined) {
        setCreditsUsed(response.data.credits_used);
        setRemainingCredits(response.data.remaining_credits);
      }

    } catch (error) {
      console.error('Error extracting script:', error);

      // 使用通用错误处理函数
      handleCreditError(error, setAlertComponent);

      // 如果不是积分相关错误，显示通用错误
      if (!error.response || ![402, 403, 429].includes(error.response.status)) {
        alert('提取脚本失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      {/* 积分提醒弹窗 */}
      {alertComponent}

      <div className="page-header">
        <h1 className="page-title">视频脚本提取</h1>
        <p className="page-subtitle">输入视频URL，自动提取视频字幕和脚本</p>
      </div>

      {/* 积分显示 */}
      {remainingCredits !== null && (
        <div className="credit-info-banner">
          <span>本次消耗: {creditsUsed} 积分</span>
          <span>剩余积分: {remainingCredits}</span>
        </div>
      )}

      <div className="input-section">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="输入视频URL..."
          className="url-input"
          disabled={loading}
        />
        <button
          onClick={handleExtractScript}
          disabled={loading}
          className="extract-button"
        >
          {loading ? '提取中...' : '提取脚本'}
        </button>
      </div>

      {result && (
        <div className="result-section">
          <h3>提取结果</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <style jsx>{`
        .credit-info-banner {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1));
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
          padding: 16px 24px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
          font-size: 14px;
        }

        .credit-info-banner span {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-section {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .url-input {
          flex: 1;
          padding: 14px 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          font-size: 15px;
        }

        .url-input:focus {
          outline: none;
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
        }

        .extract-button {
          padding: 14px 32px;
          background: linear-gradient(135deg, #a855f7, #8b5cf6);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .extract-button:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.6);
          transform: translateY(-2px);
        }

        .extract-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .result-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
        }

        .result-section h3 {
          color: #ffffff;
          margin-bottom: 16px;
        }

        .result-section pre {
          background: rgba(0, 0, 0, 0.3);
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          color: #e5e7eb;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
