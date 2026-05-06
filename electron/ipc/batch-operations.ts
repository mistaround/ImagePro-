import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import path from 'path';

export function registerBatchHandlers() {
  ipcMain.handle(
    'fs:copy-files',
    async (_event, pairs: { from: string; to: string }[]) => {
      const destDir = await dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory'],
        title: '选择目标文件夹',
      });
      if (destDir.canceled || !destDir.filePaths[0]) return;

      const targetDir = destDir.filePaths[0];
      for (const pair of pairs) {
        const destPath = path.join(targetDir, path.basename(pair.from));
        try {
          fs.copyFileSync(pair.from, destPath);
        } catch {
          // skip failed copies
        }
      }
    },
  );

  ipcMain.handle(
    'fs:move-files',
    async (_event, pairs: { from: string; to: string }[]) => {
      const destDir = await dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory'],
        title: '选择目标文件夹',
      });
      if (destDir.canceled || !destDir.filePaths[0]) return;

      const targetDir = destDir.filePaths[0];
      for (const pair of pairs) {
        const destPath = path.join(targetDir, path.basename(pair.from));
        try {
          fs.renameSync(pair.from, destPath);
        } catch {
          // skip failed moves
        }
      }
    },
  );

  ipcMain.handle('fs:delete-files', async (_event, paths: string[]) => {
    const { response } = await dialog.showMessageBox({
      type: 'warning',
      buttons: ['取消', '删除'],
      defaultId: 0,
      title: '确认删除',
      message: `确定要删除 ${paths.length} 个文件吗？`,
      detail: '文件将被永久删除，无法恢复。',
    });
    if (response === 1) {
      for (const filePath of paths) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // skip failed deletes
        }
      }
    }
  });
}
