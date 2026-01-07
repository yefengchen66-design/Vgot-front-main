import axios from 'axios';
import { API_BASE_URL } from '../config/api';

class HistoryService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api/history`;
  }

  /**
   * Get authentication headers with token from localStorage
   */
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Save generated content to history
   * @param {Object} contentData - The content data to save
   * @param {string} contentData.content_type - 'image', 'video', or 'audio'
   * @param {string} [contentData.content_subtype] - Detailed subtype: 'text_to_video', 'image_to_video', 'digital_human_video', etc.
   * @param {string} contentData.source_page - 'VideoGeneration' or 'Digtalhumanflow'
   * @param {string|bytes} contentData.file_data - URL, base64, or file data
   * @param {string} [contentData.prompt] - Generation prompt
   * @param {Object} [contentData.generation_params] - Generation parameters
   * @param {string} [contentData.api_endpoint] - API endpoint used
   * @param {Object} [contentData.api_response_data] - Full API response
   * @param {number} [contentData.duration] - Duration for video/audio (seconds)
   * @param {string} [contentData.dimensions] - Dimensions like "1920x1080"
   * @param {string} [contentData.custom_filename] - Custom filename
   * @returns {Promise<Object>} - The saved history record
   */
  async saveGeneratedContent(contentData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/save`,
        contentData,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving generated content:', error);
      throw new Error(error.response?.data?.detail || 'Failed to save content to history');
    }
  }

  /**
   * Delete a history record by file URL (best-effort cleanup)
   * Backend should support DELETE /api/history?file_url=...
   */
  async deleteByFileUrl(fileUrl) {
    if (!fileUrl) return;
    try {
      const resp = await axios.delete(`${this.baseURL}`, {
        params: { file_url: fileUrl },
        headers: this.getAuthHeaders(),
      });
      return resp.data;
    } catch (error) {
      console.error('Error deleting history by file url:', error);
      throw new Error(error.response?.data?.detail || 'Failed to delete history by file url');
    }
  }

  /**
   * Get user's generation history with optional filters
   * @param {Object} filters - Filter options
   * @param {string} [filters.content_type] - Filter by content type
   * @param {string} [filters.source_page] - Filter by source page
   * @param {number} [filters.limit=50] - Maximum records to return
   * @param {number} [filters.offset=0] - Records to skip
   * @returns {Promise<Array>} - Array of history records
   */
  async getUserHistory(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.content_type) {
        params.append('content_type', filters.content_type);
      }
      if (filters.source_page) {
        params.append('source_page', filters.source_page);
      }
      if (filters.limit !== undefined) {
        params.append('limit', filters.limit.toString());
      }
      if (filters.offset !== undefined) {
        params.append('offset', filters.offset.toString());
      }

      console.log('📡 请求历史记录:', `${this.baseURL}/list?${params.toString()}`);
      console.log('🔑 请求头:', this.getAuthHeaders());

      const response = await axios.get(
        `${this.baseURL}/list?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      
      console.log('✅ 历史记录响应:', response.data);
      
      // 确保返回数组，即使后端返回了其他类型
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('❌ Error getting user history:', error);
      console.error('❌ 错误详情:', error.response?.data);
      // 返回空数组而不是抛出异常，避免前端崩溃
      return [];
    }
  }

  /**
   * Get a specific history record by ID
   * @param {number} recordId - The record ID
   * @returns {Promise<Object>} - The history record
   */
  async getHistoryRecord(recordId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/record/${recordId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting history record:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch history record');
    }
  }

  /**
   * Delete a history record by ID
   * @param {number} recordId - The record ID to delete
   * @returns {Promise<Object>} - Success message
   */
  async deleteHistoryRecord(recordId) {
    try {
      const response = await axios.delete(
        `${this.baseURL}/record/${recordId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting history record:', error);
      throw new Error(error.response?.data?.detail || 'Failed to delete history record');
    }
  }

  /**
   * Get user's history statistics
   * @returns {Promise<Object>} - Statistics object with counts
   */
  async getHistoryStats() {
    try {
      const response = await axios.get(
        `${this.baseURL}/stats`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting history stats:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch history statistics');
    }
  }

  /**
   * Cleanup user's history older than N days (default 3)
   * Deletes DB rows and Supabase Storage objects on the backend.
   * @param {number} days
   * @returns {Promise<Object>} { deleted, days }
   */
  async cleanupOld(days = 3) {
    try {
      const response = await axios.delete(
        `${this.baseURL}/cleanup`,
        {
          params: { days },
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error cleaning up old history:', error);
      throw new Error(error.response?.data?.detail || 'Failed to cleanup old history');
    }
  }

  /**
   * Helper method to save image content
   * @param {string} imageData - Image URL or base64 data
   * @param {string} sourcePage - Source page name
   * @param {string} prompt - Generation prompt
   * @param {Object} params - Generation parameters
   * @param {Object} apiResponse - API response data
   * @returns {Promise<Object>} - Saved history record
   */
  async saveImageContent(imageData, sourcePage, prompt = '', params = {}, apiResponse = {}) {
    return this.saveGeneratedContent({
      content_type: 'image',
      source_page: sourcePage,
      file_data: imageData,
      prompt,
      generation_params: params,
      api_response_data: apiResponse
    });
  }

  /**
   * Helper method to save video content
   * @param {string} videoData - Video URL or base64 data
   * @param {string} sourcePage - Source page name
   * @param {string} prompt - Generation prompt
   * @param {Object} params - Generation parameters
   * @param {Object} apiResponse - API response data
   * @param {number} duration - Video duration in seconds
   * @param {string} dimensions - Video dimensions
   * @returns {Promise<Object>} - Saved history record
   */
  async saveVideoContent(videoData, sourcePage, prompt = '', params = {}, apiResponse = {}, duration = null, dimensions = null) {
    return this.saveGeneratedContent({
      content_type: 'video',
      source_page: sourcePage,
      file_data: videoData,
      prompt,
      generation_params: params,
      api_response_data: apiResponse,
      duration,
      dimensions
    });
  }

  /**
   * Helper method to save audio content
   * @param {string} audioData - Audio URL or base64 data
   * @param {string} sourcePage - Source page name
   * @param {string} prompt - Generation prompt
   * @param {Object} params - Generation parameters
   * @param {Object} apiResponse - API response data
   * @param {number} duration - Audio duration in seconds
   * @returns {Promise<Object>} - Saved history record
   */
  async saveAudioContent(audioData, sourcePage, prompt = '', params = {}, apiResponse = {}, duration = null) {
    return this.saveGeneratedContent({
      content_type: 'audio',
      source_page: sourcePage,
      file_data: audioData,
      prompt,
      generation_params: params,
      api_response_data: apiResponse,
      duration
    });
  }

  /**
   * Get history filtered by content type
   * @param {string} contentType - 'image', 'video', or 'audio'
   * @param {number} limit - Maximum records to return
   * @returns {Promise<Array>} - Filtered history records
   */
  async getHistoryByType(contentType, limit = 50) {
    return this.getUserHistory({ content_type: contentType, limit });
  }

  /**
   * Get history filtered by source page
   * @param {string} sourcePage - 'VideoGeneration' or 'Digtalhumanflow'
   * @param {number} limit - Maximum records to return
   * @returns {Promise<Array>} - Filtered history records
   */
  async getHistoryByPage(sourcePage, limit = 50) {
    return this.getUserHistory({ source_page: sourcePage, limit });
  }
}

// Create and export a singleton instance
const historyService = new HistoryService();
export default historyService;