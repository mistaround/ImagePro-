import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

const TAG_FILE = '.imagetags.json';

interface TagFile {
  version: number;
  tags: Record<string, number>;
}

function getTagFilePath(folderPath: string): string {
  return path.join(folderPath, TAG_FILE);
}

export function registerTagHandlers() {
  ipcMain.handle('tag:load', async (_event, folderPath: string) => {
    try {
      const filePath = getTagFilePath(folderPath);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data: TagFile = JSON.parse(content);
        return data.tags || {};
      }
    } catch {
      // ignore parse errors
    }
    return {};
  });

  ipcMain.handle(
    'tag:save',
    async (_event, folderPath: string, tags: Record<string, number>) => {
      try {
        const filePath = getTagFilePath(folderPath);
        const data: TagFile = { version: 1, tags };
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      } catch {
        // fail silently
      }
    },
  );
}
