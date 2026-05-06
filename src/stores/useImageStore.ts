import { create } from 'zustand';

interface ImageStore {
  // folderPath -> current file absolute path
  currentSelections: Record<string, string>;
  // folderPath -> { filename: absolutePath }
  selectionMap: Record<string, Record<string, string>>;

  setSelection: (folderPath: string, filePath: string) => void;
  setSelectionsForAll: (selections: Record<string, string>) => void;
  getSelection: (folderPath: string) => string | undefined;
}

export const useImageStore = create<ImageStore>((set, get) => ({
  currentSelections: {},
  selectionMap: {},

  setSelection: (folderPath, filePath) => {
    set((state) => ({
      currentSelections: { ...state.currentSelections, [folderPath]: filePath },
    }));
  },

  setSelectionsForAll: (selections) => {
    set({ currentSelections: selections });
  },

  getSelection: (folderPath) => {
    return get().currentSelections[folderPath];
  },
}));
