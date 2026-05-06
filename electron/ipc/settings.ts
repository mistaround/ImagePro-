import { ipcMain, app } from 'electron';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(app.getPath('userData'), 'settings.json');

function readSettings(): Record<string, unknown> {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    }
  } catch {
    // ignore
  }
  return {};
}

function writeSettings(data: Record<string, unknown>): void {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // ignore
  }
}

export function registerSettingsHandlers() {
  ipcMain.handle('settings:get', async (_event, key: string) => {
    const settings = readSettings();
    return settings[key];
  });

  ipcMain.handle('settings:set', async (_event, key: string, value: unknown) => {
    const settings = readSettings();
    settings[key] = value;
    writeSettings(settings);
  });
}
