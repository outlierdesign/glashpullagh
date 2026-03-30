import {
  GRID_WIDTH,
  GRID_HEIGHT,
  CELL_SIZE,
  COLORS,
} from './constants';
import { type Cell, type GameState, DamType, SoilType } from './types';

// Interpolate between two hex colors
function lerpColor(a: string, b: string, t: number): string {
  const parseHex = (h: string) => {
    const v = parseInt(h.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  };
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

// Pre-render terrain + contours to an offscreen canvas
export function renderTerrainCache(grid: Cell[][]): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = GRID_WIDTH * CELL_SIZE;
  canvas.height = GRID_HEIGHT * CELL_SIZE;
  const ctx = canvas.getContext('2d')!;

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = grid[row][col];
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      // Base terrain color from elevation
      let color: string;
      if (cell.isChannel) {
        color = COLORS.channel;
      } else if (cell.elevation < 0.25) {
        color = lerpColor(COLORS.terrainDeep, COLORS.terrainLow, cell.elevation / 0.25);
      } else if (cell.elevation < 0.45) {
        color = lerpColor(COLORS.terrainLow, COLORS.terrainMid, (cell.elevation - 0.25) / 0.2);
      } else if (cell.elevation < 0.65) {
        color = lerpColor(COLORS.terrainMid, COLORS.terrainHigh, (cell.elevation - 0.45) / 0.2);
      } else {
        color = lerpColor(COLORS.terrainHigh, COLORS.terrainPeak, (cell.elevation - 0.65) / 0.35);
      }

      // Bare peat tint near channels
      if (cell.soilType === SoilType.BarePeat && !cell.isChannel) {
        color = lerpColor(color, COLORS.barePeat, 0.5);
      }

      ctx.fillStyle = color;
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

      // Vegetation tint overlay
      if (cell.vegetationGrowth > 0.3 && !cell.isChannel) {
        const alpha = cell.vegetationGrowth * 0.3;
        const vegColor = cell.soilType === SoilType.Vegetated
          ? COLORS.vegetation
          : COLORS.sphagnumGreen;
        ctx.fillStyle = vegColor;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.globalAlpha = 1;
      }
    }
  }

  // Contour lines
  renderContours(ctx, grid);

  return canvas;
}

function renderContours(ctx: CanvasRenderingContext2D, grid: Cell[][]): void {
  ctx.strokeStyle = COLORS.contour;
  ctx.lineWidth = 0.5;

  const contourStep = 0.08;
  for (let level = contourStep; level < 1; level += contourStep) {
    ctx.beginPath();
    for (let row = 0; row < GRID_HEIGHT - 1; row++) {
      for (let col = 0; col < GRID_WIDTH - 1; col++) {
        // Simple marching squares for contour at this level
        const tl = grid[row][col].elevation >= level ? 1 : 0;
        const tr = grid[row][col + 1].elevation >= level ? 1 : 0;
        const br = grid[row + 1][col + 1].elevation >= level ? 1 : 0;
        const bl = grid[row + 1][col].elevation >= level ? 1 : 0;
        const config = (tl << 3) | (tr << 2) | (br << 1) | bl;

        if (config === 0 || config === 15) continue;

        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;
        const s = CELL_SIZE;
        const mid = s / 2;

        // Draw line segments for common contour configurations
        switch (config) {
          case 1: case 14:
            ctx.moveTo(x, y + mid);
            ctx.lineTo(x + mid, y + s);
            break;
          case 2: case 13:
            ctx.moveTo(x + mid, y + s);
            ctx.lineTo(x + s, y + mid);
            break;
          case 3: case 12:
            ctx.moveTo(x, y + mid);
            ctx.lineTo(x + s, y + mid);
            break;
          case 4: case 11:
            ctx.moveTo(x + mid, y);
            ctx.lineTo(x + s, y + mid);
            break;
          case 6: case 9:
            ctx.moveTo(x + mid, y);
            ctx.lineTo(x + mid, y + s);
            break;
          case 7: case 8:
            ctx.moveTo(x, y + mid);
            ctx.lineTo(x + mid, y);
            break;
          case 5:
            ctx.moveTo(x, y + mid);
            ctx.lineTo(x + mid, y);
            ctx.moveTo(x + mid, y + s);
            ctx.lineTo(x + s, y + mid);
            break;
          case 10:
            ctx.moveTo(x + mid, y);
            ctx.lineTo(x + s, y + mid);
            ctx.moveTo(x, y + mid);
            ctx.lineTo(x + mid, y + s);
            break;
        }
      }
    }
    ctx.stroke();
  }
}

// Render water layer
function renderWater(ctx: CanvasRenderingContext2D, grid: Cell[][]): void {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = grid[row][col];
      if (cell.waterLevel <= 0.001) continue;

      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      // Interpolate opacity from shallow to deep
      const depthNorm = Math.min(cell.waterLevel / 0.15, 1);
      const [r, g, b] = COLORS.waterShallow;
      const minAlpha = COLORS.waterShallow[3];
      const maxAlpha = COLORS.waterDeep[3];
      const alpha = minAlpha + (maxAlpha - minAlpha) * depthNorm;

      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

      // Bright edge on deep water for surface highlight
      if (depthNorm > 0.5) {
        ctx.fillStyle = `rgba(106,172,172,${(depthNorm - 0.5) * 0.15})`;
        ctx.fillRect(x, y, CELL_SIZE, 1);
      }
    }
  }
}

// Render dams
function renderDams(ctx: CanvasRenderingContext2D, grid: Cell[][]): void {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = grid[row][col];
      if (cell.damType === DamType.None) continue;

      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      switch (cell.damType) {
        case DamType.Timber:
          ctx.fillStyle = COLORS.timberDam;
          ctx.fillRect(x, y + 1, CELL_SIZE, CELL_SIZE - 2);
          // Cross pattern
          ctx.strokeStyle = '#5A4A3A';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x, y + 1);
          ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE - 1);
          ctx.moveTo(x + CELL_SIZE, y + 1);
          ctx.lineTo(x, y + CELL_SIZE - 1);
          ctx.stroke();
          break;
        case DamType.PeatDam:
          ctx.fillStyle = COLORS.peatDam;
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
          // Stipple
          ctx.fillStyle = '#5A5030';
          for (let dx = 1; dx < CELL_SIZE; dx += 2) {
            for (let dy = 1; dy < CELL_SIZE; dy += 2) {
              ctx.fillRect(x + dx, y + dy, 1, 1);
            }
          }
          break;
        case DamType.SphagnumPlug:
          ctx.fillStyle = COLORS.sphagnumPlug;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          break;
      }
    }
  }
}

// Render hover preview for dam placement
function renderHover(
  ctx: CanvasRenderingContext2D,
  grid: Cell[][],
  hoverCell: { row: number; col: number },
  selectedTool: DamType,
): void {
  const { row, col } = hoverCell;
  const cells = getDamFootprint(row, col, selectedTool);
  const valid = isPlacementValid(grid, row, col, selectedTool);
  const color = valid ? COLORS.hoverValid : COLORS.hoverInvalid;

  ctx.fillStyle = color;
  for (const [r, c] of cells) {
    if (r >= 0 && r < GRID_HEIGHT && c >= 0 && c < GRID_WIDTH) {
      ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

export function getDamFootprint(
  row: number,
  col: number,
  damType: DamType,
): [number, number][] {
  switch (damType) {
    case DamType.Timber:
      return [[row, col]];
    case DamType.PeatDam:
      return [[row, col - 1], [row, col], [row, col + 1]];
    case DamType.SphagnumPlug: {
      const cells: [number, number][] = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          cells.push([row + dr, col + dc]);
        }
      }
      return cells;
    }
    default:
      return [];
  }
}

export function isPlacementValid(
  grid: Cell[][],
  row: number,
  col: number,
  damType: DamType,
): boolean {
  const footprint = getDamFootprint(row, col, damType);

  // All cells must be in bounds
  for (const [r, c] of footprint) {
    if (r < 0 || r >= GRID_HEIGHT || c < 0 || c >= GRID_WIDTH) return false;
    if (grid[r][c].damType !== DamType.None) return false;
  }

  // Timber dams must be on channel cells
  if (damType === DamType.Timber) {
    if (!grid[row][col].isChannel) return false;
  }

  return true;
}

// Main render function called every frame
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  terrainCache: HTMLCanvasElement,
  state: GameState,
  hoverCell: { row: number; col: number } | null,
): void {
  // Layer 1+2: Cached terrain + contours
  ctx.drawImage(terrainCache, 0, 0);

  // Layer 3: Water
  renderWater(ctx, state.grid);

  // Layer 4: Dams
  renderDams(ctx, state.grid);

  // Layer 5: Hover preview
  if (hoverCell && state.selectedTool) {
    renderHover(ctx, state.grid, hoverCell, state.selectedTool);
  }
}
