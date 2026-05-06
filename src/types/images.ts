export interface ImageFile {
  filename: string;
  baseName: string;
  extension: string;
  absolutePath: string;
  relativePath: string;
  size: number;
  mtimeMs: number;
  width: number;
  height: number;
}

export interface FolderAlias {
  path: string;
  alias: string;
  colorIndex: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}
