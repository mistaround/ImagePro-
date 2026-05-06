import { create } from 'zustand';
import type { ImageFile } from '../types/images.js';
import { TAG_COLORS } from '../types/tags.js';

interface FolderEntry {
  path: string;
  alias: string;
  colorIndex: number;
  fileCount: number;
  files: ImageFile[];
}

interface FolderStore {
  folders: FolderEntry[];
  favorites: string[];
  maxFolders: number;

  addFolder: (path: string, alias: string, files: ImageFile[]) => void;
  removeFolder: (index: number) => void;
  updateAlias: (index: number, alias: string) => void;
  setFiles: (index: number, files: ImageFile[]) => void;
  addFavorite: (path: string) => void;
  removeFavorite: (path: string) => void;
}

export const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],
  favorites: [],
  maxFolders: 8,

  addFolder: (path, alias, files) => {
    const { folders, maxFolders } = get();
    if (folders.length >= maxFolders) return;
    if (folders.some((f) => f.path === path)) return;
    set({
      folders: [
        ...folders,
        {
          path,
          alias: alias || path.split(/[/\\]/).pop() || path,
          colorIndex: folders.length % 8,
          fileCount: files.length,
          files,
        },
      ],
    });
  },

  removeFolder: (index) => {
    set((state) => ({
      folders: state.folders.filter((_, i) => i !== index),
    }));
  },

  updateAlias: (index, alias) => {
    set((state) => ({
      folders: state.folders.map((f, i) =>
        i === index ? { ...f, alias } : f,
      ),
    }));
  },

  setFiles: (index, files) => {
    set((state) => ({
      folders: state.folders.map((f, i) =>
        i === index ? { ...f, files, fileCount: files.length } : f,
      ),
    }));
  },

  addFavorite: (path) => {
    const { favorites } = get();
    if (!favorites.includes(path)) {
      set({ favorites: [...favorites, path] });
    }
  },

  removeFavorite: (path) => {
    set((state) => ({
      favorites: state.favorites.filter((f) => f !== path),
    }));
  },
}));
