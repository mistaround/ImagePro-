import { registerFileSystemHandlers } from './file-system.js';
import { registerTagHandlers } from './tag-persistence.js';
import { registerThumbnailHandlers } from './thumbnails.js';
import { registerBatchHandlers } from './batch-operations.js';
import { registerSettingsHandlers } from './settings.js';

export function registerIpcHandlers() {
  registerFileSystemHandlers();
  registerTagHandlers();
  registerThumbnailHandlers();
  registerBatchHandlers();
  registerSettingsHandlers();
}
