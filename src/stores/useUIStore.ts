import { create } from 'zustand';

interface UIStore {
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  leftSidebarCollapsed: boolean;
  rightSidebarCollapsed: boolean;
  showHelpDialog: boolean;
  showFolderPicker: boolean;
  folderPickerPath: string | null;
  folderPickerFiles: { absolutePath: string }[];
  focusedFolderIndex: number;

  setLeftWidth: (w: number) => void;
  setRightWidth: (w: number) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setShowHelpDialog: (show: boolean) => void;
  setShowFolderPicker: (show: boolean, path?: string | null, files?: { absolutePath: string }[]) => void;
  setFocusedFolderIndex: (index: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  leftSidebarWidth: 220,
  rightSidebarWidth: 280,
  leftSidebarCollapsed: false,
  rightSidebarCollapsed: false,
  showHelpDialog: false,
  showFolderPicker: false,
  folderPickerPath: null,
  folderPickerFiles: [],
  focusedFolderIndex: 0,

  setLeftWidth: (w) => set({ leftSidebarWidth: Math.max(180, Math.min(400, w)) }),
  setRightWidth: (w) => set({ rightSidebarWidth: Math.max(200, Math.min(450, w)) }),
  toggleLeftSidebar: () => set((s) => ({ leftSidebarCollapsed: !s.leftSidebarCollapsed })),
  toggleRightSidebar: () => set((s) => ({ rightSidebarCollapsed: !s.rightSidebarCollapsed })),
  setShowHelpDialog: (show) => set({ showHelpDialog: show }),
  setShowFolderPicker: (show, path = null, files = []) =>
    set({ showFolderPicker: show, folderPickerPath: path, folderPickerFiles: files }),
  setFocusedFolderIndex: (index) => set({ focusedFolderIndex: index }),
}));
