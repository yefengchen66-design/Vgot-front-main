import React from 'react';
import { AlertCircle, TrendingUp, Zap, Crown, X } from 'lucide-react';
import './CreditAlerts.css';

/**
 * 积分不足提醒组件
 */
export const InsufficientCreditsAlert = ({ onTopup, onClose, remainingCredits = 0 }) => {
  return (
    <div className="credit-alert-overlay" onClick={onClose}>
      <div className="credit-alert-modal" onClick={(e) => e.stopPropagation()}>
        <button className="credit-alert-close" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="credit-alert-icon insufficient">
          <AlertCircle size={48} />
        </div>
        <h2 className="credit-alert-title">积分不足</h2>
        <p className="credit-alert-message">
          当前剩余积分：<strong>{remainingCredits}</strong>
          <br />
          本次操作所需积分不足，请充值后继续使用
        </p>
        <div className="credit-alert-actions">
          <button className="credit-alert-btn-secondary" onClick={onClose}>
            稍后再说
          </button>
          <button className="credit-alert-btn-primary" onClick={onTopup}>
            <Zap size={18} />
            立即充值
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 需要升级提醒组件
 */
export const UpgradeRequiredAlert = ({ onUpgrade, onClose, currentTier = 'Free', feature = '' }) => {
  const getTierRecommendation = () => {
    if (currentTier === 'Free') return 'Creator';
    if (currentTier === 'Creator') return 'Business';
    return 'Enterprise';
  };

  const recommendedTier = getTierRecommendation();

  return (
    <div className="credit-alert-overlay" onClick={onClose}>
      <div className="credit-alert-modal" onClick={(e) => e.stopPropagation()}>
        <button className="credit-alert-close" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="credit-alert-icon upgrade">
          <Crown size={48} />
        </div>
        <h2 className="credit-alert-title">功能需要升级</h2>
        <p className="credit-alert-message">
          {feature && <><strong>{feature}</strong> 功能需要升级到 <strong>{recommendedTier}</strong> 计划才能使用</>}
          {!feature && <>当前功能需要升级到 <strong>{recommendedTier}</strong> 计划</>}
          <br />
          <br />
          升级后可解锁更多功能和更高的积分配额
        </p>
        <div className="credit-alert-features">
          {currentTier === 'Free' && (
            <>
              <div className="feature-item">✨ 无限脚本分析和改写</div>
              <div className="feature-item">🎨 SuperIP 图片/语音/视频生成</div>
              <div className="feature-item">🎬 Sora AI 视频生成</div>
              <div className="feature-item">⚡ 30,000 积分/月</div>
            </>
          )}
          {currentTier === 'Creator' && (
            <>
              <div className="feature-item">🎨 无限图片生成</div>
              <div className="feature-item">🎁 首次语音生成免费</div>
              <div className="feature-item">👥 团队协作功能</div>
              <div className="feature-item">⚡ 120,000 积分/月</div>
            </>
          )}
        </div>
        <div className="credit-alert-actions">
          <button className="credit-alert-btn-secondary" onClick={onClose}>
            暂不升级
          </button>
          <button className="credit-alert-btn-gradient" onClick={onUpgrade}>
            <TrendingUp size={18} />
            立即升级到 {recommendedTier}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 每日限制达到提醒组件
 */
export const DailyLimitReachedAlert = ({ onClose, limit = 50, resetTime = '明天00:00' }) => {
  return (
    <div className="credit-alert-overlay" onClick={onClose}>
      <div className="credit-alert-modal" onClick={(e) => e.stopPropagation()}>
        <button className="credit-alert-close" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="credit-alert-icon daily-limit">
          <Zap size={48} />
        </div>
        <h2 className="credit-alert-title">今日免费次数已用完</h2>
        <p className="credit-alert-message">
          您今日的免费使用次数已达到上限
          <br />
          <strong>({limit}/{limit})</strong>
          <br />
          <br />
          将在 <strong>{resetTime}</strong> 重置
        </p>
        <div className="credit-alert-tip">
          💡 <strong>提示：</strong>升级到 Creator 计划可享受无限次数使用
        </div>
        <div className="credit-alert-actions">
          <button className="btn-secondary" onClick={onClose}>
            我知道了
          </button>
          <button className="btn-primary" onClick={() => window.location.href = '/subscription'}>
            <Crown size={18} />
            查看升级方案
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 通用积分错误处理函数
 */
export const handleCreditError = (error, setAlertComponent) => {
  if (!error.response) {
    console.error('Network error:', error);
    return;
  }

  const status = error.response.status;
  const detail = error.response.data?.detail || '';

  // 402 - 积分不足
  if (status === 402) {
    setAlertComponent(
      <InsufficientCreditsAlert
        remainingCredits={0}
        onTopup={() => {
          window.location.href = '/credits';
        }}
        onClose={() => setAlertComponent(null)}
      />
    );
  }
  // 403 - 需要升级
  else if (status === 403) {
    setAlertComponent(
      <UpgradeRequiredAlert
        currentTier={localStorage.getItem('userTier') || 'Free'}
        feature={extractFeatureName(detail)}
        onUpgrade={() => {
          window.location.href = '/subscription';
        }}
        onClose={() => setAlertComponent(null)}
      />
    );
  }
  // 429 - 每日限制
  else if (status === 429) {
    const limitMatch = detail.match(/\((\d+)\/(\d+)\)/);
    const limit = limitMatch ? parseInt(limitMatch[2]) : 50;
    
    setAlertComponent(
      <DailyLimitReachedAlert
        limit={limit}
        resetTime={getNextResetTime()}
        onClose={() => setAlertComponent(null)}
      />
    );
  }
};

// 辅助函数：从错误信息中提取功能名称
const extractFeatureName = (detail) => {
  if (detail.includes('Creator')) return '此功能';
  if (detail.includes('Business')) return '此功能';
  return '';
};

// 辅助函数：计算下次重置时间
const getNextResetTime = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const hours = tomorrow.getHours();
  const minutes = tomorrow.getMinutes();
  
  return `明天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
