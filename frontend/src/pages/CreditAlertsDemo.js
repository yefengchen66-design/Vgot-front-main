import React, { useState } from 'react';
import {
  InsufficientCreditsAlert,
  UpgradeRequiredAlert,
  DailyLimitReachedAlert
} from '../components/CreditAlerts';

/**
 * 积分提醒测试页面
 * 用于预览和测试所有积分提醒组件
 */
export default function CreditAlertsDemo() {
  const [activeAlert, setActiveAlert] = useState(null);

  return (
    <div className="page" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      <div className="page-header">
        <h1 className="page-title">积分提醒测试</h1>
        <p className="page-subtitle">预览所有积分相关提醒弹窗效果</p>
      </div>

      <div className="demo-grid">
        {/* 积分不足 */}
        <div className="demo-card">
          <div className="demo-icon">💳</div>
          <h3>积分不足提醒</h3>
          <p>当用户积分余额不足时显示</p>
          <button
            className="demo-button insufficient"
            onClick={() => setActiveAlert('insufficient')}
          >
            预览效果
          </button>
          <div className="demo-details">
            <strong>HTTP 402</strong>
            <span>• 显示剩余积分</span>
            <span>• 引导充值</span>
          </div>
        </div>

        {/* 需要升级 */}
        <div className="demo-card">
          <div className="demo-icon">👑</div>
          <h3>需要升级提醒</h3>
          <p>当功能需要更高等级时显示</p>
          <button
            className="demo-button upgrade"
            onClick={() => setActiveAlert('upgrade')}
          >
            预览效果
          </button>
          <div className="demo-details">
            <strong>HTTP 403</strong>
            <span>• 推荐升级等级</span>
            <span>• 展示新功能</span>
          </div>
        </div>

        {/* 每日限制 */}
        <div className="demo-card">
          <div className="demo-icon">⏰</div>
          <h3>每日限制提醒</h3>
          <p>当免费用户达到每日上限时显示</p>
          <button
            className="demo-button daily"
            onClick={() => setActiveAlert('daily')}
          >
            预览效果
          </button>
          <div className="demo-details">
            <strong>HTTP 429</strong>
            <span>• 显示已用次数</span>
            <span>• 重置倒计时</span>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="usage-section">
        <h2>💡 使用指南</h2>
        <div className="code-block">
          <h3>方法1: 使用 apiClient（推荐）</h3>
          <pre>{`import { api } from '../services/apiClient';

const handleAction = async () => {
  try {
    const response = await api.post('/api/endpoint', data);
    // 积分错误自动处理，无需手动捕获 402/403/429
  } catch (error) {
    // 处理其他错误
  }
};`}</pre>
        </div>

        <div className="code-block">
          <h3>方法2: 手动处理</h3>
          <pre>{`import { handleCreditError } from '../components/CreditAlerts';

const [alertComponent, setAlertComponent] = useState(null);

try {
  // ... 发起请求
} catch (error) {
  handleCreditError(error, setAlertComponent);
}

return <div>{alertComponent}</div>;`}</pre>
        </div>
      </div>

      {/* 渲染选中的提醒 */}
      {activeAlert === 'insufficient' && (
        <InsufficientCreditsAlert
          remainingCredits={150}
          onTopup={() => {
            setActiveAlert(null);
            alert('跳转到充值页面');
          }}
          onClose={() => setActiveAlert(null)}
        />
      )}

      {activeAlert === 'upgrade' && (
        <UpgradeRequiredAlert
          currentTier="Free"
          feature="AI视频生成"
          onUpgrade={() => {
            setActiveAlert(null);
            alert('跳转到订阅页面');
          }}
          onClose={() => setActiveAlert(null)}
        />
      )}

      {activeAlert === 'daily' && (
        <DailyLimitReachedAlert
          limit={50}
          resetTime="8小时30分钟后"
          onClose={() => setActiveAlert(null)}
        />
      )}

      <style jsx>{`
        .demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .demo-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .demo-card:hover {
          border-color: rgba(168, 85, 247, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.2);
        }

        .demo-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .demo-card h3 {
          color: #ffffff;
          font-size: 20px;
          margin-bottom: 12px;
        }

        .demo-card p {
          color: #9ca3af;
          font-size: 14px;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .demo-button {
          width: 100%;
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 16px;
        }

        .demo-button.insufficient {
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: #ffffff;
        }

        .demo-button.upgrade {
          background: linear-gradient(135deg, #a855f7, #ec4899);
          color: #ffffff;
        }

        .demo-button.daily {
          background: linear-gradient(135deg, #f59e0b, #eab308);
          color: #ffffff;
        }

        .demo-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }

        .demo-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 13px;
        }

        .demo-details strong {
          color: #a855f7;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .demo-details span {
          color: #9ca3af;
          text-align: left;
        }

        .usage-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 32px;
        }

        .usage-section h2 {
          color: #ffffff;
          font-size: 24px;
          margin-bottom: 24px;
        }

        .code-block {
          margin-bottom: 24px;
        }

        .code-block h3 {
          color: #a855f7;
          font-size: 16px;
          margin-bottom: 12px;
        }

        .code-block pre {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
          color: #e5e7eb;
          font-size: 13px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
