import { api } from './apiClient';

export const hypersellService = {
  startTextToVideo: (payload) => api.post('/api/hypersell/text-to-video', payload),
  startImageToVideo: (payload) => api.post('/api/hypersell/image-to-video', payload),
  getTaskStatus: (taskId) => api.get(`/api/hypersell/tasks/${taskId}`),
  finalizeTask: (taskId, body) => api.post(`/api/hypersell/tasks/${taskId}/finalize`, body),
  cancelTask: (taskId) => api.delete(`/api/hypersell/tasks/${taskId}`),
};

export default hypersellService;
