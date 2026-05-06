import { create } from 'zustand';
import type { AppMode, PairingMode } from '../types/ui.js';

interface AppStore {
  mode: AppMode;
  pairingMode: PairingMode;
  selectedIndex: number;
  totalCount: number;

  setMode: (mode: AppMode) => void;
  setPairingMode: (mode: PairingMode) => void;
  setSelectedIndex: (index: number) => void;
  setTotalCount: (count: number) => void;
  navigateNext: () => void;
  navigatePrev: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  mode: 'compare',
  pairingMode: 'name',
  selectedIndex: 0,
  totalCount: 200,

  setMode: (mode) => set({ mode }),
  setPairingMode: (pairingMode) => set({ pairingMode }),
  setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
  setTotalCount: (totalCount) => set({ totalCount }),
  navigateNext: () => {
    const { selectedIndex, totalCount } = get();
    set({ selectedIndex: Math.min(selectedIndex + 1, totalCount - 1) });
  },
  navigatePrev: () => {
    const { selectedIndex } = get();
    set({ selectedIndex: Math.max(selectedIndex - 1, 0) });
  },
}));
