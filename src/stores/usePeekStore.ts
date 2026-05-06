import { create } from 'zustand';

interface PeekStore {
  active: boolean;
  sourceFolderPath: string | null;
  targetFolderPath: string | null;
  sourceAlias: string;

  startPeek: (sourcePath: string, targetPath: string, alias: string) => void;
  stopPeek: () => void;
}

export const usePeekStore = create<PeekStore>((set) => ({
  active: false,
  sourceFolderPath: null,
  targetFolderPath: null,
  sourceAlias: '',

  startPeek: (sourcePath, targetPath, sourceAlias) => {
    set({
      active: true,
      sourceFolderPath: sourcePath,
      targetFolderPath: targetPath,
      sourceAlias,
    });
  },

  stopPeek: () => {
    set({
      active: false,
      sourceFolderPath: null,
      targetFolderPath: null,
      sourceAlias: '',
    });
  },
}));
