export const isMac = typeof window !== 'undefined' && window.electronAPI?.platform === 'darwin';
export const isWin = typeof window !== 'undefined' && window.electronAPI?.platform === 'win32';

export function getPlatform(): 'win' | 'mac' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';
  const p = window.electronAPI?.platform;
  if (p === 'darwin') return 'mac';
  if (p === 'win32') return 'win';
  return 'unknown';
}
