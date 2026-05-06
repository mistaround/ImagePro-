export interface GridLayout {
  cols: number;
  rows: number;
  missing: number;
}

export function gridLayoutFor(n: number): GridLayout {
  switch (n) {
    case 1: return { cols: 1, rows: 1, missing: 0 };
    case 2: return { cols: 2, rows: 1, missing: 0 };
    case 3: return { cols: 3, rows: 1, missing: 0 };
    case 4: return { cols: 2, rows: 2, missing: 0 };
    case 5: return { cols: 3, rows: 2, missing: 1 };
    case 6: return { cols: 3, rows: 2, missing: 0 };
    case 7: return { cols: 4, rows: 2, missing: 1 };
    case 8: return { cols: 4, rows: 2, missing: 0 };
    default: return { cols: 2, rows: 2, missing: 0 };
  }
}
