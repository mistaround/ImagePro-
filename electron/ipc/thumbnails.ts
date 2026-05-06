import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

// In-memory thumbnail cache
const thumbnailCache = new Map<string, string>();

export function registerThumbnailHandlers() {
  ipcMain.handle(
    'thumb:generate',
    async (_event, filePath: string, size: number) => {
      const cacheKey = `${filePath}@${size}`;
      const cached = thumbnailCache.get(cacheKey);
      if (cached) return cached;

      try {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
          const buffer = fs.readFileSync(filePath);
          const base64 = `data:image/${ext === '.png' ? 'png' : 'jpeg'};base64,${buffer.toString('base64')}`;
          thumbnailCache.set(cacheKey, base64);
          // Limit cache size
          if (thumbnailCache.size > 500) {
            const firstKey = thumbnailCache.keys().next().value;
            if (firstKey) thumbnailCache.delete(firstKey);
          }
          return base64;
        }
      } catch {
        // return empty for failed thumbnails
      }
      return '';
    },
  );
}
