import { useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore.js';
import { useUIStore } from '../stores/useUIStore.js';
import { useViewportStore } from '../stores/useViewportStore.js';
import { useImageStore } from '../stores/useImageStore.js';
import { useTagStore } from '../stores/useTagStore.js';
import { usePeekStore } from '../stores/usePeekStore.js';
import { useFolderStore } from '../stores/useFolderStore.js';

export function useKeyboard() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't handle when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowRight':
          useAppStore.getState().navigateNext();
          break;
        case 'ArrowLeft':
          useAppStore.getState().navigatePrev();
          break;
        case '0':
          useViewportStore.getState().resetAll();
          break;
        case 'f':
        case 'F':
          // Fullscreen toggle - would need fullscreen API
          break;
        case 'Escape':
          useUIStore.getState().setShowHelpDialog(false);
          break;
        case 'F1':
          useUIStore.getState().setShowHelpDialog(
            !useUIStore.getState().showHelpDialog,
          );
          break;
        case '?':
          if (e.shiftKey) {
            useUIStore.getState().setShowHelpDialog(
              !useUIStore.getState().showHelpDialog,
            );
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4': {
          const color = parseInt(e.key) as 1 | 2 | 3 | 4;
          if (e.ctrlKey || e.metaKey) {
            // Tag all cells with their current selections
            const folders = useFolderStore.getState().folders;
            const selections = useImageStore.getState().currentSelections;
            const paths = folders
              .map((f) => selections[f.path])
              .filter(Boolean) as string[];
            if (paths.length > 0) {
              useTagStore.getState().setTagsForAll(paths, color);
            }
          } else {
            // Tag focused cell's current selection
            const focusedIdx = useUIStore.getState().focusedFolderIndex;
            const folders = useFolderStore.getState().folders;
            const folder = folders[focusedIdx];
            if (folder) {
              const selections = useImageStore.getState().currentSelections;
              const imagePath = selections[folder.path];
              if (imagePath) {
                const currentTag = useTagStore.getState().tags[imagePath];
                if (currentTag === color) {
                  useTagStore.getState().clearTag(imagePath);
                } else {
                  useTagStore.getState().setTag(imagePath, color);
                }
              }
            }
          }
          break;
        }
        case 'p':
        case 'P': {
          const folders = useFolderStore.getState().folders;
          if (folders.length >= 2) {
            const focusedIdx = useUIStore.getState().focusedFolderIndex;
            const sourceIdx = 0; // baseline
            const sourceFolder = folders[sourceIdx];
            const peekStore = usePeekStore.getState();
            if (e.shiftKey) {
              // Peek on all cells
              peekStore.startPeekAll(sourceFolder.path, sourceFolder.alias);
            } else if (focusedIdx !== sourceIdx) {
              peekStore.startPeek(
                sourceFolder.path,
                folders[focusedIdx].path,
                sourceFolder.alias,
              );
            }
            // Auto-stop after 500ms for keyboard peek
            setTimeout(() => usePeekStore.getState().stopPeek(), 500);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
