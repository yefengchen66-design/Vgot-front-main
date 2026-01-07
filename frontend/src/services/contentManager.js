// services/contentManager.js
// import { supabase } from '../lib/supabaseClient';
import historyService from './historyService';
import { enqueuePendingHistory } from './historySync';

/**
 * 内容管理服务 - 处理生成内容的完整流程
 * 1. 获取API响应（图片/音频/视频链接）
 * 2. 下载并上传到Supabase Storage  
 * 3. 保存历史记录到数据库
 */
class ContentManager {
  constructor() {
    this.bucketName = 'lixibin';
  }

  /**
   * 从URL下载文件并上传到Supabase Storage
   * @param {string} fileUrl - 文件的URL链接
   * @param {string} contentType - 内容类型 ('image', 'video', 'audio')
   * @param {string} filename - 自定义文件名（可选）
   * @returns {Promise<Object>} 上传结果
   */
  async downloadAndUpload(fileUrl, contentType, filename = null) {
    try {
      console.log(`📥 开始下载文件: ${fileUrl}`);
      
      // 下载文件
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`下载失败: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const fileSize = blob.size;
      
      // 生成文件名
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const extension = this.getFileExtension(contentType, response.headers.get('content-type'));
      const fileName = filename || `${contentType}_${timestamp}.${extension}`;
      const folder = `generated-content/${contentType}s`;
      const filePath = `${folder}/${fileName}`;
      
      console.log(`📤 开始上传到Storage: ${filePath}`);
      
      // 上传到Supabase Storage
      // const { data, error } = await supabase.storage
      //   .from(this.bucketName)
      //   .upload(filePath, blob, {
      //     cacheControl: '3600',
      //     upsert: false,
      //     contentType: blob.type
      //   });

      // if (error) {
      //   throw new Error(`Storage上传失败: ${error.message}`);
      // }

      // // 获取公开URL
      // const { data: { publicUrl } } = supabase.storage
      //   .from(this.bucketName)
      //   .getPublicUrl(data.path);

      // console.log(`✅ 上传成功: ${publicUrl}`);

      // 注意：当前前端未启用 Supabase 客户端上传，这里返回占位符会导致
      // 历史记录保存为无效地址。为避免该错误，这里将 success 设为 false，
      // 明确告知上层走“使用原始URL保存历史”的分支，彻底排除 placeholder 链接。
      return {
        success: false,
        error: 'storage upload disabled (placeholder suppressed)',
        fileName: fileName,
        fileSize: fileSize,
        originalUrl: fileUrl
      };
      
    } catch (error) {
      console.error(`❌ 下载上传失败:`, error);
      return {
        success: false,
        error: error.message,
        originalUrl: fileUrl
      };
    }
  }

  /**
   * 根据内容类型获取文件扩展名
   * @param {string} contentType - 内容类型
   * @param {string} mimeType - MIME类型
   * @returns {string} 文件扩展名
   */
  getFileExtension(contentType, mimeType) {
    if (mimeType) {
      const mimeExtensions = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'video/mp4': 'mp4',
        'video/webm': 'webm',
        'video/quicktime': 'mov',
        'audio/mpeg': 'mp3',
        'audio/wav': 'wav',
        'audio/mp4': 'm4a'
      };
      if (mimeExtensions[mimeType]) {
        return mimeExtensions[mimeType];
      }
    }
    
    // 后备扩展名
    const defaultExtensions = {
      'image': 'jpg',
      'video': 'mp4',
      'audio': 'mp3'
    };
    
    return defaultExtensions[contentType] || 'bin';
  }

  /**
   * 处理生成内容的完整流程
   * @param {Object} options - 选项
   * @param {string} options.fileUrl - 生成的文件URL
   * @param {string} options.contentType - 内容类型
   * @param {string} options.contentSubtype - 内容子类型
   * @param {string} options.sourcePage - 来源页面
   * @param {string} options.prompt - 生成提示
   * @param {Object} options.generationParams - 生成参数
   * @param {Object} options.apiResponse - API完整响应
   * @param {string} options.customFilename - 自定义文件名
   * @returns {Promise<Object>} 处理结果
   */
  async processGeneratedContent(options) {
    const {
      fileUrl,
      contentType,
      contentSubtype,
      sourcePage,
      prompt,
      generationParams = {},
      apiResponse = {},
      customFilename
    } = options;

    try {
      console.log(`🎯 开始处理生成内容: ${contentType} - ${fileUrl}`);
      
      // 步骤1: 下载并上传到Storage
      const uploadResult = await this.downloadAndUpload(fileUrl, contentType, customFilename);
      
      if (!uploadResult.success) {
        // 如果上传失败，仍然保存历史记录但使用原始URL
        console.warn(`⚠️ Storage上传失败，使用原始URL保存历史记录`);
        
        const historyData = {
          content_type: contentType,
          content_subtype: contentSubtype,
          source_page: sourcePage,
          file_data: fileUrl, // 使用原始URL
          prompt: prompt || '',
          generation_params: generationParams,
          api_response_data: apiResponse,
          custom_filename: customFilename
        };
        
        const historyResult = await historyService.saveGeneratedContent(historyData);
        
        return {
          success: false,
          uploadError: uploadResult.error,
          historyRecord: historyResult,
          originalUrl: fileUrl
        };
      }

      // 步骤2: 保存到历史记录（使用Storage URL）
      const historyData = {
        content_type: contentType,
        content_subtype: contentSubtype,
        source_page: sourcePage,
        file_data: uploadResult.url,
        prompt: prompt || '',
        generation_params: {
          ...generationParams,
          original_url: fileUrl,  // 保留原始URL以供参考
          storage_path: uploadResult.path
        },
        api_response_data: apiResponse,
        custom_filename: uploadResult.fileName,
        file_size: uploadResult.fileSize,  // 添加文件大小
        dimensions: this.extractDimensions(apiResponse),
        duration: this.extractDuration(apiResponse, contentType)
      };

      try {
        const historyRecord = await historyService.saveGeneratedContent(historyData);
        console.log(`✅ 内容处理完成 - 历史记录ID: ${historyRecord.id}`);
        return {
          success: true,
          storageUrl: uploadResult.url,
          storagePath: uploadResult.path,
          fileName: uploadResult.fileName,
          fileSize: uploadResult.fileSize,
          historyRecord,
          originalUrl: fileUrl
        };
      } catch (err) {
        // 未登录或网络错误时，加入本地待同步队列，前端仍返回成功（已上传到Storage）
        enqueuePendingHistory({
          ...historyData,
          file_size: uploadResult.fileSize
        });
        console.warn('⚠️ 历史记录未保存到后端，已加入待同步队列');
        return {
          success: true,
          storageUrl: uploadResult.url,
          storagePath: uploadResult.path,
          fileName: uploadResult.fileName,
          fileSize: uploadResult.fileSize,
          historyRecord: null,
          queued: true,
          originalUrl: fileUrl
        };
      }
      
    } catch (error) {
  console.error(`❌ 处理生成内容失败:`, error);
  throw new Error(`内容处理失败: ${error.message}`);
    }
  }

  /**
   * 从API响应中提取尺寸信息
   * @param {Object} apiResponse - API响应
   * @returns {string|null} 尺寸字符串
   */
  extractDimensions(apiResponse) {
    if (apiResponse?.width && apiResponse?.height) {
      return `${apiResponse.width}x${apiResponse.height}`;
    }
    return null;
  }

  /**
   * 从API响应中提取时长信息
   * @param {Object} apiResponse - API响应
   * @param {string} contentType - 内容类型
   * @returns {number|null} 时长（秒）
   */
  extractDuration(apiResponse, contentType) {
    if (contentType === 'video' || contentType === 'audio') {
      return apiResponse?.duration || apiResponse?.length || null;
    }
    return null;
  }

  /**
   * 批量处理多个生成内容
   * @param {Array} contentList - 内容列表
   * @returns {Promise<Array>} 处理结果列表
   */
  async processMultipleContents(contentList) {
    const results = [];
    
    for (const content of contentList) {
      try {
        const result = await this.processGeneratedContent(content);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          originalUrl: content.fileUrl
        });
      }
    }
    
    return results;
  }
}

export default new ContentManager();