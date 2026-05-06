import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,

  selectFolder: () => ipcRenderer.invoke('fs:select-folder'),
  scanImages: (folderPath: string) => ipcRenderer.invoke('fs:scan-images', folderPath),
  readImage: (filePath: string) => ipcRenderer.invoke('fs:read-image', filePath),
  getDimensions: (filePath: string) => ipcRenderer.invoke('fs:get-dimensions', filePath),

  copyFiles: (pairs: { from: string; to: string }[]) =>
    ipcRenderer.invoke('fs:copy-files', pairs),
  moveFiles: (pairs: { from: string; to: string }[]) =>
    ipcRenderer.invoke('fs:move-files', pairs),
  deleteFiles: (paths: string[]) =>
    ipcRenderer.invoke('fs:delete-files', paths),

  generateThumbnail: (filePath: string, size: number) =>
    ipcRenderer.invoke('thumb:generate', filePath, size),

  loadTags: (folderPath: string) => ipcRenderer.invoke('tag:load', folderPath),
  saveTags: (folderPath: string, tags: Record<string, number>) =>
    ipcRenderer.invoke('tag:save', folderPath, tags),

  getSetting: <T>(key: string) => ipcRenderer.invoke('settings:get', key),
  setSetting: <T>(key: string, value: T) => ipcRenderer.invoke('settings:set', key, value),
});
