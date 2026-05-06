# CLAUDE.md

## Project overview

ImagePro is a cross-platform (Windows primary, macOS compatible) Electron desktop app for comparing AI-generated images across multiple experiment folders. Users select up to 8 folders, view images side-by-side in a compare grid, tag images with 4 colors, and batch process (copy/move/delete) tagged images.

## Tech stack

- **Desktop**: Electron 30 + React 18 + TypeScript 5
- **State**: Zustand 4
- **Build**: Vite 5 (renderer) + Vite (main process CJS output)
- **Package**: electron-builder

## Architecture

```
electron/          Main process (CJS, Node.js)
  main.ts           Window creation, lifecycle
  preload.ts         contextBridge → window.electronAPI
  ipc/               IPC handlers split by domain
src/                Renderer process (ESM, browser)
  components/        React components by feature area
  stores/            Zustand stores (7 domain stores)
  hooks/             Custom hooks (useKeyboard, useImageLoader, useResizeObserver, useFileSystem)
  types/             TypeScript interfaces
  utils/             Pure utility functions
  styles/            CSS files
```

## Key patterns

- **All IPC through `window.electronAPI`** (contextBridge). Never use `require('electron')` in renderer.
- **Stores do NOT import each other**. Cross-store communication happens in hooks/components via `Store.getState()`.
- **Canvas rendering** in GridCell uses ResizeObserver for resize + requestAnimationFrame-style redraws triggered by viewport state changes.
- **Same-name matching** via `src/utils/file-matching.ts`: groups files by basename across folders, returns sorted groups used for unified navigation.
- **`"type"` removed from package.json**: main process is built as CJS, cannot have `"type": "module"`.

## Commands

```bash
npm run dev        # Start dev (Vite + Electron)
npm run build      # Production build
npm run typecheck  # TypeScript check
```

Run `npm run dev` once and leave it — Vite hot-reloads renderer, but Electron main changes need a restart.

## Important files

- `electron/main.ts` — app entry, window creation
- `electron/preload.ts` — all exposed IPC APIs
- `src/App.tsx` — root component, mode routing
- `src/components/compare-grid/GridCell.tsx` — core cell: canvas rendering, zoom/pan, peek, overlays
- `src/stores/useViewportStore.ts` — per-cell zoom/pan state
- `src/stores/useTagStore.ts` — tag CRUD + persistence debouncing
- `src/hooks/useKeyboard.ts` — all keyboard shortcuts
- `src/utils/file-matching.ts` — same-name grouping algorithm

## Design source

The UI is based on wireframes at `ImagePro Wireframes.html` (Variant C — full-bleed images, always-visible alias badges, peek buttons, file-explorer right sidebar). The PRD at `PRD.md` documents all features. Both files are in the design bundle.
