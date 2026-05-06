import { create } from 'zustand';
import type { ViewportState } from '../types/ui.js';

interface ViewportStore {
  viewports: Record<string, ViewportState>;
  setViewport: (key: string, vp: Partial<ViewportState>) => void;
  zoomCell: (key: string, delta: number, cx: number, cy: number) => void;
  zoomAll: (delta: number) => void;
  panCell: (key: string, dx: number, dy: number) => void;
  panAll: (dx: number, dy: number) => void;
  resetAll: () => void;
  resetCell: (key: string) => void;
}

const defaultViewport: ViewportState = { zoom: 1, panX: 0, panY: 0 };

function getVp(store: ViewportStore, key: string): ViewportState {
  return store.viewports[key] || defaultViewport;
}

export const useViewportStore = create<ViewportStore>((set, get) => ({
  viewports: {},

  setViewport: (key, vp) => {
    set((state) => {
      const current = state.viewports[key] || defaultViewport;
      return {
        viewports: {
          ...state.viewports,
          [key]: { ...current, ...vp },
        },
      };
    });
  },

  zoomCell: (key, delta, cx, cy) => {
    set((state) => {
      const vp = getVp({ viewports: state.viewports } as ViewportStore, key);
      const newZoom = Math.max(0.1, Math.min(10, vp.zoom + delta * vp.zoom));
      const scale = newZoom / vp.zoom;
      return {
        viewports: {
          ...state.viewports,
          [key]: {
            zoom: newZoom,
            panX: cx - scale * (cx - vp.panX),
            panY: cy - scale * (cy - vp.panY),
          },
        },
      };
    });
  },

  zoomAll: (delta) => {
    set((state) => {
      const updated: Record<string, ViewportState> = {};
      for (const key of Object.keys(state.viewports)) {
        const vp = state.viewports[key] || defaultViewport;
        const newZoom = Math.max(0.1, Math.min(10, vp.zoom + delta * vp.zoom));
        updated[key] = { zoom: newZoom, panX: 0, panY: 0 };
      }
      return { viewports: { ...state.viewports, ...updated } };
    });
  },

  panCell: (key, dx, dy) => {
    set((state) => {
      const vp = getVp({ viewports: state.viewports } as ViewportStore, key);
      return {
        viewports: {
          ...state.viewports,
          [key]: { ...vp, panX: vp.panX + dx, panY: vp.panY + dy },
        },
      };
    });
  },

  panAll: (dx, dy) => {
    set((state) => {
      const updated: Record<string, ViewportState> = { ...state.viewports };
      for (const [key, vp] of Object.entries(updated)) {
        updated[key] = { ...vp, panX: vp.panX + dx, panY: vp.panY + dy };
      }
      return { viewports: updated };
    });
  },

  resetAll: () => {
    set((state) => {
      const updated: Record<string, ViewportState> = {};
      for (const key of Object.keys(state.viewports)) {
        updated[key] = { ...defaultViewport };
      }
      return { viewports: updated };
    });
  },

  resetCell: (key) => {
    set((state) => ({
      viewports: { ...state.viewports, [key]: { ...defaultViewport } },
    }));
  },
}));
