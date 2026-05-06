import { create } from 'zustand';
import type { TagColorKey, TagColorMeta } from '../types/tags.js';
import { DEFAULT_TAG_META } from '../types/tags.js';

interface TagStore {
  tags: Record<string, TagColorKey>;
  tagMeta: Record<number, TagColorMeta>;
  dirtyFolders: Set<string>;

  setTag: (imagePath: string, color: TagColorKey) => void;
  clearTag: (imagePath: string) => void;
  setTagsForAll: (paths: string[], color: TagColorKey) => void;
  setTagMeta: (key: number, label: string) => void;
  loadTags: (tags: Record<string, TagColorKey>) => void;
  getTag: (imagePath: string) => TagColorKey | undefined;
  addDirtyFolder: (folderPath: string) => void;
  clearDirty: () => void;
  getTagCounts: (folderPath: string, allFiles: string[]) => Record<number, number>;
}

export const useTagStore = create<TagStore>((set, get) => ({
  tags: {},
  tagMeta: { ...DEFAULT_TAG_META },
  dirtyFolders: new Set(),

  setTag: (imagePath, color) => {
    set((state) => ({
      tags: { ...state.tags, [imagePath]: state.tags[imagePath] === color ? undefined as unknown as TagColorKey : color },
    }));
    // Clean up undefined
    set((state) => {
      const cleaned = { ...state.tags };
      if (cleaned[imagePath] === undefined) delete cleaned[imagePath];
      return { tags: cleaned };
    });
  },

  clearTag: (imagePath) => {
    set((state) => {
      const tags = { ...state.tags };
      delete tags[imagePath];
      return { tags };
    });
  },

  setTagsForAll: (paths, color) => {
    set((state) => {
      const tags = { ...state.tags };
      for (const p of paths) {
        tags[p] = color;
      }
      return { tags };
    });
  },

  setTagMeta: (key, label) => {
    set((state) => ({
      tagMeta: {
        ...state.tagMeta,
        [key]: { ...state.tagMeta[key], label },
      },
    }));
  },

  loadTags: (tags) => {
    set({ tags });
  },

  getTag: (imagePath) => {
    return get().tags[imagePath];
  },

  addDirtyFolder: (folderPath) => {
    set((state) => {
      const dirty = new Set(state.dirtyFolders);
      dirty.add(folderPath);
      return { dirtyFolders: dirty };
    });
  },

  clearDirty: () => {
    set({ dirtyFolders: new Set() });
  },

  getTagCounts: (folderPath, allFiles) => {
    const { tags } = get();
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const filePath of allFiles) {
      const tag = tags[filePath];
      if (tag) counts[tag]++;
    }
    return counts;
  },
}));
