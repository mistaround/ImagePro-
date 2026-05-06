export type AppMode = 'compare' | 'preview';
export type PairingMode = 'name' | 'free';

export interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
}

export interface CellState {
  folderPath: string;
  alias: string;
  colorIndex: number;
}
