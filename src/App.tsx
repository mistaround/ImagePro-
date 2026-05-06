import { useAppStore } from './stores/useAppStore.js';
import { useUIStore } from './stores/useUIStore.js';
import AppShell from './components/layout/AppShell.js';
import TopToolbar from './components/layout/TopToolbar.js';
import StatusBar from './components/layout/StatusBar.js';
import LeftSidebar from './components/left-sidebar/LeftSidebar.js';
import RightSidebar from './components/right-sidebar/RightSidebar.js';
import CompareGrid from './components/compare-grid/CompareGrid.js';
import PreviewMode from './components/preview/PreviewMode.js';
import HelpDialog from './components/dialogs/HelpDialog.js';
import FolderPickerPopover from './components/dialogs/FolderPickerPopover.js';
import { useKeyboard } from './hooks/useKeyboard.js';

export default function App() {
  const mode = useAppStore((s) => s.mode);
  const showHelp = useUIStore((s) => s.showHelpDialog);

  useKeyboard();

  return (
    <AppShell
      top={<TopToolbar />}
      left={<LeftSidebar />}
      right={<RightSidebar />}
      bottom={<StatusBar />}
    >
      {mode === 'compare' ? <CompareGrid /> : <PreviewMode />}
      {showHelp && <HelpDialog />}
      <FolderPickerPopover />
    </AppShell>
  );
}
