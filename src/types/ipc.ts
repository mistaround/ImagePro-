import type { ImageFile } from './images.js';
import type { TagMap } from './tags.js';

export interface ElectronAPI {
  platform: NodeJS.Platform;
  selectFolder: () => Promise<string | null>;
  scanImages: (folderPath: string) => Promise<ImageFile[]>;
  readImage: (filePath: string) => Promise<Uint8Array>;
  getDimensions: (filePath: string) => Promise<{ width: number; height: number }>;
  copyFiles: (pairs: { from: string; to: string }[]) => Promise<void>;
  moveFiles: (pairs: { from: string; to: string }[]) => Promise<void>;
  deleteFiles: (paths: string[]) => Promise<void>;
  generateThumbnail: (filePath: string, size: number) => Promise<string>;
  loadTags: (folderPath: string) => Promise<TagMap>;
  saveTags: (folderPath: string, tags: TagMap) => Promise<void>;
  getSetting: <T>(key: string) => Promise<T | undefined>;
  setSetting: <T>(key: string, value: T) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
