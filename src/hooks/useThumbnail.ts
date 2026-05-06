import { useState, useEffect, useRef } from 'react';

const localCache = new Map<string, string>();

export function useThumbnail(filePath: string | null, size: number = 64) {
  const [src, setSrc] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!filePath || !window.electronAPI) {
      setSrc(null);
      return;
    }

    const cacheKey = `${filePath}@${size}`;
    const cached = localCache.get(cacheKey);
    if (cached) {
      setSrc(cached);
      return;
    }

    let cancelled = false;
    window.electronAPI.generateThumbnail(filePath, size).then((base64) => {
      if (!cancelled && mountedRef.current && base64) {
        localCache.set(cacheKey, base64);
        setSrc(base64);
      }
    }).catch(() => {
      if (!cancelled && mountedRef.current) setSrc(null);
    });

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, [filePath, size]);

  return src;
}
