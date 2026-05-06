export type TagColorKey = 1 | 2 | 3 | 4;

export interface TagColorMeta {
  key: TagColorKey;
  label: string;
  hexColor: string;
}

export type TagMap = Record<string, TagColorKey>;

export const DEFAULT_TAG_META: Record<number, TagColorMeta> = {
  1: { key: 1, label: '待处理', hexColor: '#d4453d' },
  2: { key: 2, label: '优', hexColor: '#e7b528' },
  3: { key: 3, label: '劣', hexColor: '#2f7fc7' },
  4: { key: 4, label: '疑问', hexColor: '#4f9a55' },
};

export const TAG_COLORS = ['#d4453d', '#e7b528', '#2f7fc7', '#4f9a55'] as const;
