import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const thumbnailCache = new Map<string, string>();
const MAX_CACHE_SIZE = 500;

export function registerThumbnailHandlers() {
  ipcMain.handle(
    'thumb:generate',
    async (_event, filePath: string, size: number) => {
      const cacheKey = `${filePath}@${size}`;
      const cached = thumbnailCache.get(cacheKey);
      if (cached) return cached;

      try {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
          const buffer = fs.readFileSync(filePath);
          const resized = await sharp(buffer)
            .resize(size, size, { fit: 'inside', withoutEnlargement: true })
            .toBuffer();
          const base64 = `data:image/${ext === '.png' ? 'png' : 'jpeg'};base64,${resized.toString('base64')}`;
          thumbnailCache.set(cacheKey, base64);
          if (thumbnailCache.size > MAX_CACHE_SIZE) {
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
