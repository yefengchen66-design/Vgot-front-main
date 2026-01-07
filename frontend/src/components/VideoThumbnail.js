import React, { useEffect, useRef, useState } from 'react';

/**
 * VideoThumbnail
 * - Captures and caches a poster frame quickly to avoid blank covers.
 * - Phase 1: capture first available frame on loadeddata (fast), show immediately.
 * - Phase 2: try to seek ~15% into the video and update poster for better content.
 * - If CORS blocks canvas, falls back to rendering <video> directly.
 */
const posterCache = new Map();

export default function VideoThumbnail({ src, className = '', alt = 'video thumbnail' }) {
  const videoRef = useRef(null);
  const [posterUrl, setPosterUrl] = useState(() => posterCache.get(src) || null);
  const [useVideoFallback, setUseVideoFallback] = useState(false);
  const [loading, setLoading] = useState(!posterCache.has(src));

  useEffect(() => {
    setPosterUrl(posterCache.get(src) || null);
    setUseVideoFallback(false);
    setLoading(!posterCache.has(src));

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.crossOrigin = 'anonymous';
    video.src = src;

    let seekTimeout;

    const captureFrame = (quality = 0.8) => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(320, Math.min(1280, video.videoWidth || 640));
      canvas.height = Math.max(180, Math.min(720, video.videoHeight || 360));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', quality);
    };

    const onLoadedData = () => {
      try {
        const dataUrl = captureFrame(0.7);
        if (!posterCache.has(src)) posterCache.set(src, dataUrl);
        setPosterUrl(dataUrl);
      } catch {
        setUseVideoFallback(true);
      } finally {
        setLoading(false);
      }
    };

    const onLoadedMetadata = () => {
      try {
        const duration = Math.max(0, Number(video.duration) || 0);
        const targetTime = duration ? Math.min(duration * 0.15, Math.max(0.5, duration - 0.1)) : 0.5;

        const onSeeked = () => {
          try {
            const dataUrl = captureFrame(0.8);
            posterCache.set(src, dataUrl);
            setPosterUrl(dataUrl);
          } catch {
            setUseVideoFallback(true);
          } finally {
            if (seekTimeout) clearTimeout(seekTimeout);
          }
        };

        video.addEventListener('seeked', onSeeked, { once: true });
        video.currentTime = targetTime;

        seekTimeout = setTimeout(() => {
          video.removeEventListener('seeked', onSeeked);
          try {
            const dataUrl = captureFrame(0.75);
            posterCache.set(src, dataUrl);
            setPosterUrl(prev => prev || dataUrl);
          } catch {
            setUseVideoFallback(true);
          }
        }, 1500);
      } catch {
        setUseVideoFallback(true);
        setLoading(false);
      }
    };

    const onError = () => { setUseVideoFallback(true); setLoading(false); };

    video.addEventListener('loadeddata', onLoadedData, { once: true });
    video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
    video.addEventListener('error', onError, { once: true });
    video.load();

    return () => {
      if (seekTimeout) clearTimeout(seekTimeout);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('error', onError);
      try { video.src = ''; video.load(); } catch {}
    };
  }, [src]);

  if ((loading || useVideoFallback) && !posterUrl) {
    return (
      <video
        className={className}
        src={src}
        preload="metadata"
        muted
        playsInline
        crossOrigin="anonymous"
        onLoadedMetadata={(e) => {
          // Try to seek slightly to avoid black start frame
          try { e.target.currentTime = 1.0; } catch {}
        }}
      />
    );
  }

  return <img className={className} src={posterUrl || ''} alt={alt} style={{ objectFit: 'cover' }} />;
}
