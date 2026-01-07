/**
 * API配置中心
 * 统一管理所有API地址，避免硬编码
 */

// 从环境变量获取API基础URL，如果未配置则使用本地开发地址
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

// 导出完整的API端点
export const API_ENDPOINTS = {
  // 认证相关
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    google: `${API_BASE_URL}/auth/google`,
  },
  
  // 视频相关
  video: {
    extractScript: `${API_BASE_URL}/api/video/extract-script`,
    sceneAnalysis: `${API_BASE_URL}/api/video/scene-analysis`,
    enhance: `${API_BASE_URL}/api/video/enhance`,
  },
  
  // 脚本相关
  script: {
    rewrite: `${API_BASE_URL}/api/script/rewrite`,
  },
  
  // Sora视频生成
  sora: {
    textToVideo: `${API_BASE_URL}/api/sora/text-to-video`,
    watermarkFree: `${API_BASE_URL}/api/sora/watermark-free`,
    poll: (id) => `${API_BASE_URL}/api/sora/poll/${id}`,
  },
  
  // Avatar相关
  avatar: {
    generateImage: `${API_BASE_URL}/api/avatar/generate-image`,
    shiting: `${API_BASE_URL}/api/avatar/shiting`,
    wavespeedInfinitetalk: `${API_BASE_URL}/api/avatar/wavespeed-infinitetalk`,
  },

  // SuperIP专用
  superip: {
    generateImage: `${API_BASE_URL}/api/superip/generate-image`,
  },
  
  // 语音相关
  voice: {
    design: `${API_BASE_URL}/api/voice/design`,
    allAudio: `${API_BASE_URL}/api/all_audio`,
    custom: `${API_BASE_URL}/api/voices/custom`,
    clone: {
      upload: `${API_BASE_URL}/api/voice/clone/upload`,
      preview: `${API_BASE_URL}/api/voice/clone/preview`,
    }
  },
  
  // 音频合成
  audio: {
    synthesize: `${API_BASE_URL}/api/audio/synthesize`,
  },
  
  // 积分/计费
  credits: {
    balance: `${API_BASE_URL}/api/credits/balance`,
    check: `${API_BASE_URL}/api/credits/check`,
    deduct: `${API_BASE_URL}/api/credits/deduct`,
    pricing: `${API_BASE_URL}/api/credits/pricing`,
  },
  
  // 任务轮询
  task: {
    poll: (id) => `${API_BASE_URL}/api/task/poll/${id}`,
  },
  
  // 生成记录
  records: {
    create: `${API_BASE_URL}/api/generation-records`,
  },
  
  // 历史记录
  history: {
    base: `${API_BASE_URL}/api/history`,
    save: `${API_BASE_URL}/api/history/save`,
    list: `${API_BASE_URL}/api/history/list`,
    record: (id) => `${API_BASE_URL}/api/history/record/${id}`,
    stats: `${API_BASE_URL}/api/history/stats`,
  },

  // 文件上传（统一到后端，再转存 Supabase）
  files: {
    upload: `${API_BASE_URL}/api/files/upload`,
  },
};

export default API_ENDPOINTS;
