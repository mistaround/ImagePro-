import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif', '.tiff', '.tif',
]);

export interface ImageFileEntry {
  filename: string;
  baseName: string;
  extension: string;
  absolutePath: string;
  relativePath: string;
  size: number;
  mtimeMs: number;
}

function scanDirectory(dirPath: string, basePath: string): ImageFileEntry[] {
  const results: ImageFileEntry[] = [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const ext = path.extname(entry.name).toLowerCase();
      if (entry.isFile() && IMAGE_EXTENSIONS.has(ext)) {
        const stat = fs.statSync(fullPath);
        results.push({
          filename: entry.name,
          baseName: path.basename(entry.name, ext),
          extension: ext,
          absolutePath: fullPath,
          relativePath: path.relative(basePath, fullPath),
          size: stat.size,
          mtimeMs: stat.mtimeMs,
        });
      } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
        results.push(...scanDirectory(fullPath, basePath));
      }
    }
  } catch {
    // skip inaccessible directories
  }
  return results;
}

export function registerFileSystemHandlers() {
  ipcMain.handle('fs:select-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle('fs:scan-images', async (_event, folderPath: string) => {
    const entries = scanDirectory(folderPath, folderPath);
    entries.sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }));
    return entries;
  });

  ipcMain.handle('fs:read-image', async (_event, filePath: string) => {
    return fs.readFileSync(filePath);
  });

  ipcMain.handle('fs:get-dimensions', async (_event, filePath: string) => {
    // Basic dimension extraction for PNG and JPEG
    try {
      const buffer = fs.readFileSync(filePath);
      const ext = path.extname(filePath).toLowerCase();

      if (ext === '.png') {
        // PNG: width at offset 16, height at offset 20 (big-endian)
        if (buffer.toString('ascii', 1, 4) === 'PNG') {
          const width = buffer.readUInt32BE(16);
          const height = buffer.readUInt32BE(20);
          return { width, height };
        }
      } else if (ext === '.jpg' || ext === '.jpeg') {
        // JPEG: scan for SOF marker
        let i = 2;
        while (i < buffer.length) {
          if (buffer[i] !== 0xff) break;
          const marker = buffer[i + 1];
          if (marker === 0xc0 || marker === 0xc2) {
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt16BE(i + 7);
            return { width, height };
          }
          i += 2 + buffer.readUInt16BE(i + 2);
        }
      }
      return { width: 0, height: 0 };
    } catch {
      return { width: 0, height: 0 };
    }
  });
}
