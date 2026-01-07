import axios from 'axios';
import { 
  InsufficientCreditsAlert, 
  UpgradeRequiredAlert, 
  DailyLimitReachedAlert 
} from '../components/CreditAlerts';
import { createRoot } from 'react-dom/client';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// 请求拦截器 - 自动添加 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 显示积分提醒的容器
let alertContainer = null;
let alertRoot = null;

const showCreditAlert = (AlertComponent) => {
  // 创建容器（如果不存在）
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.id = 'credit-alert-container';
    document.body.appendChild(alertContainer);
    alertRoot = createRoot(alertContainer);
  }

  // 渲染提醒组件
  alertRoot.render(AlertComponent);
};

const closeCreditAlert = () => {
  if (alertRoot && alertContainer) {
    alertRoot.render(null);
  }
};

// 响应拦截器 - 自动处理积分相关错误
apiClient.interceptors.response.use(
  (response) => {
    // 自动保存用户积分信息到 localStorage
    if (response.data?.remaining_credits !== undefined) {
      localStorage.setItem('userCredits', response.data.remaining_credits);
    }
    
    // 自动保存用户等级信息
    if (response.data?.data?.tier) {
      localStorage.setItem('userTier', response.data.data.tier);
    }
    
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(error);
    }

    const status = error.response.status;
    const detail = error.response.data?.detail || '';

    // 402 - 积分不足
    if (status === 402) {
      // 后端判定为积分不足时，避免显示旧的本地积分，统一显示为 0 并同步本地存储
      try { localStorage.setItem('userCredits', '0'); } catch {}
      showCreditAlert(
        <InsufficientCreditsAlert
          remainingCredits={0}
          onTopup={() => {
            closeCreditAlert();
            window.location.href = '/credits';
          }}
          onClose={closeCreditAlert}
        />
      );
    }
    // 403 - 需要升级
    else if (status === 403) {
      showCreditAlert(
        <UpgradeRequiredAlert
          currentTier={localStorage.getItem('userTier') || 'Free'}
          feature={extractFeatureName(detail)}
          onUpgrade={() => {
            closeCreditAlert();
            window.location.href = '/subscription';
          }}
          onClose={closeCreditAlert}
        />
      );
    }
    // 429 - 每日限制
    else if (status === 429) {
      const limitMatch = detail.match(/\((\d+)\/(\d+)\)/);
      const limit = limitMatch ? parseInt(limitMatch[2]) : 50;
      
      showCreditAlert(
        <DailyLimitReachedAlert
          limit={limit}
          resetTime={getNextResetTime()}
          onClose={closeCreditAlert}
        />
      );
    }

    return Promise.reject(error);
  }
);

// 辅助函数
const extractFeatureName = (detail) => {
  if (detail.includes('脚本')) return '脚本功能';
  if (detail.includes('图片')) return '图片生成';
  if (detail.includes('语音')) return '语音生成';
  if (detail.includes('视频')) return '视频生成';
  return '此功能';
};

const getNextResetTime = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diffMs = tomorrow - now;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}小时${minutes}分钟后`;
};

export default apiClient;

// 导出便捷方法
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
};
