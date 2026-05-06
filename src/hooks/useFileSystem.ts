import { useCallback } from 'react';
import { useFolderStore } from '../stores/useFolderStore.js';
import { useUIStore } from '../stores/useUIStore.js';

export function useFileSystem() {
  const addFolder = useFolderStore((s) => s.addFolder);
  const setShowPicker = useUIStore((s) => s.setShowFolderPicker);

  const browseAndSelect = useCallback(async () => {
    if (!window.electronAPI) return;

    const folderPath = await window.electronAPI.selectFolder();
    if (!folderPath) return;

    const files = await window.electronAPI.scanImages(folderPath);
    setShowPicker(true, folderPath, files.map((f) => ({ absolutePath: f.absolutePath })));
  }, [setShowPicker]);

  return { browseAndSelect };
}
