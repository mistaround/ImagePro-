import type { ImageFile } from '../types/images.js';

export type MatchGroup = Record<string, ImageFile | null>;

export function computeSameNameGroups(
  folderFiles: Record<string, ImageFile[]>,
  folderPaths: string[],
): MatchGroup[] {
  if (folderPaths.length === 0) return [];

  // Collect all unique base names across all folders
  const baseNameSet = new Set<string>();
  for (const [folderPath, files] of Object.entries(folderFiles)) {
    if (!folderPaths.includes(folderPath)) continue;
    for (const file of files) {
      baseNameSet.add(file.baseName);
    }
  }

  // Build groups sorted alphabetically
  const sortedNames = Array.from(baseNameSet).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );

  return sortedNames.map((baseName) => {
    const group: MatchGroup = {};
    for (const folderPath of folderPaths) {
      const files = folderFiles[folderPath] || [];
      const match = files.find((f) => f.baseName === baseName) || null;
      group[folderPath] = match;
    }
    return group;
  });
}
