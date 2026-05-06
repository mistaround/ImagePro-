import { useRef, useEffect, useCallback, useState } from 'react';

// In-memory image cache (URL → HTMLImageElement) with LRU eviction
const imageCache = new Map<string, HTMLImageElement>();
const MAX_CACHE_SIZE = 50;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const cached = imageCache.get(src);
    if (cached) {
      // Move to end (most recently used)
      imageCache.delete(src);
      imageCache.set(src, cached);
      resolve(cached);
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (imageCache.size >= MAX_CACHE_SIZE) {
        const firstKey = imageCache.keys().next().value;
        if (firstKey) imageCache.delete(firstKey);
      }
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function useImageLoader(filePath: string | null) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (path: string) => {
    // Cancel previous load
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      if (window.electronAPI) {
        const buffer = await window.electronAPI.readImage(path);
        if (controller.signal.aborted) return;
        const blob = new Blob([new Uint8Array(buffer)]);
        const url = URL.createObjectURL(blob);
        const img = await loadImage(url);
        URL.revokeObjectURL(url);
        if (controller.signal.aborted) return;
        setImage(img);
      } else {
        // No IPC available — use placeholder
        setImage(null);
      }
    } catch {
      if (!controller.signal.aborted) {
        setError('无法加载图片');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (filePath) {
      load(filePath);
    } else {
      setImage(null);
    }
  }, [filePath, load]);

  return { image, loading, error, reload: () => filePath && load(filePath) };
}

// Clear cache (e.g., when switching folders)
export function clearImageCache() {
  imageCache.clear();
}
