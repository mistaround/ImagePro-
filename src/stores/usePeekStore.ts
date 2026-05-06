import { create } from 'zustand';

interface PeekStore {
  active: boolean;
  sourceFolderPath: string | null;
  targetFolderPath: string | null;
  sourceAlias: string;
  peekAll: boolean;

  startPeek: (sourcePath: string, targetPath: string, alias: string) => void;
  startPeekAll: (sourcePath: string, alias: string) => void;
  stopPeek: () => void;
}

export const usePeekStore = create<PeekStore>((set) => ({
  active: false,
  sourceFolderPath: null,
  targetFolderPath: null,
  sourceAlias: '',
  peekAll: false,

  startPeek: (sourcePath, targetPath, sourceAlias) => {
    set({
      active: true,
      sourceFolderPath: sourcePath,
      targetFolderPath: targetPath,
      sourceAlias,
      peekAll: false,
    });
  },

  startPeekAll: (sourcePath, sourceAlias) => {
    set({
      active: true,
      sourceFolderPath: sourcePath,
      targetFolderPath: null,
      sourceAlias,
      peekAll: true,
    });
  },

  stopPeek: () => {
    set({
      active: false,
      sourceFolderPath: null,
      targetFolderPath: null,
      sourceAlias: '',
      peekAll: false,
    });
  },
}));
