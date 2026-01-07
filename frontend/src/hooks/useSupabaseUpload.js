// hooks/useSupabaseUpload.js
import { useState } from 'react'
// import { supabase } from '../lib/supabaseClient'

export const useSupabaseUpload = (bucketName = 'vgot') => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  // 基础文件上传
  const uploadFile = async (file, folder = 'public', options = {}) => {
    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      // 文件验证
      if (!file) {
        throw new Error('请选择文件')
      }

      // 支持的文件类型
      const allowedTypes = options.allowedTypes || [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a',
        'video/mp4', 'video/webm', 'video/quicktime'
      ]

      if (!allowedTypes.includes(file.type)) {
        const type = file.type.startsWith('image/') ? '图片' :
          file.type.startsWith('audio/') ? '音频' : '文件'
        throw new Error(`请选择有效的${type}文件`)
      }

      // 根据文件类型设置不同的大小限制
      const maxSize = options.maxSize || (
        file.type.startsWith('video/') ? 50 * 1024 * 1024 : // 50MB for video
          file.type.startsWith('image/') ? 5 * 1024 * 1024 :
            10 * 1024 * 1024 // 10MB for audio/others
      )
      if (file.size > maxSize) {
        const sizeMB = Math.round(maxSize / (1024 * 1024))
        throw new Error(`文件大小不能超过 ${sizeMB}MB`)
      }

  // 生成唯一文件名
  const fileExt = (file.name && file.name.includes('.')) ? file.name.split('.').pop() : 'bin'
  const unique = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const objectPath = `${folder}/${unique}.${fileExt}`

      // 优先：直传 Supabase（绕过无服务器体积限制 & CORS 问题）
      const SUPA_URL = process.env.REACT_APP_SUPABASE_URL
      const SUPA_ANON = process.env.REACT_APP_SUPABASE_ANON_KEY
      try {
        if (SUPA_URL && SUPA_ANON) {
          setProgress(10)
          const uploadUrl = `${SUPA_URL}/storage/v1/object/${bucketName}/${objectPath}?upsert=true`
          const resp = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SUPA_ANON}`,
              'apikey': SUPA_ANON,
              'Content-Type': file.type || 'application/octet-stream'
            },
            body: file
          })
          if (!resp.ok) {
            const text = await resp.text()
            throw new Error(text || `Supabase upload failed (${resp.status})`)
          }
          setProgress(100)
          const publicUrl = `${SUPA_URL}/storage/v1/object/public/${bucketName}/${objectPath}`
          return { success: true, url: publicUrl, path: objectPath }
        }
      } catch (directErr) {
        // 若直传失败，尝试走后端代理
        console.warn('[useSupabaseUpload] direct upload failed, fallback to backend proxy:', directErr?.message || directErr)
      }

      // 回退：通过后端代理上传 (/api/supabase/upload) —— 小文件适用
      try {
        const form = new FormData()
        form.append('file', file)
        form.append('folder', folder)
        if (bucketName) form.append('bucket', bucketName)

        setProgress(10)

        const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000'
        const resp = await fetch(`${API_BASE}/api/supabase/upload`, {
          method: 'POST',
          body: form
        })

        if (!resp.ok) {
          const text = await resp.text()
          throw new Error(text || 'Upload failed')
        }

        const data = await resp.json()
        if (!data || !data.success) {
          throw new Error(data?.detail || data?.error || 'Upload failed')
        }

        setProgress(100)
        return { success: true, url: data.url, path: data.path }
      } catch (uploadErr) {
        throw uploadErr
      }

    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setUploading(false)
    }
  }

  // 批量上传
  const uploadMultipleFiles = async (files, folder = 'public') => {
    const results = []

    for (let i = 0; i < files.length; i++) {
      const result = await uploadFile(files[i], folder)
      results.push({
        file: files[i].name,
        ...result
      })
    }

    return results
  }

  // 删除文件
  const deleteFile = async (filePath) => {
    // try {
    //   const { error } = await supabase.storage
    //     .from(bucketName)
    //     .remove([filePath])

    //   if (error) throw error
    //   return { success: true }
    // } catch (err) {
    //   return { success: false, error: err.message }
    // }
    return { success: true }
  }

  return {
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    uploading,
    progress,
    error,
    resetError: () => setError(null)
  }
}