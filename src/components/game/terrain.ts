import { GRID_WIDTH, GRID_HEIGHT } from './constants';
import { type Cell, SoilType, DamType } from './types';

// Seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Simple 2D value noise
function createNoiseGrid(width: number, height: number, rand: () => number): number[][] {
  const grid: number[][] = [];
  for (let y = 0; y <= height; y++) {
    grid[y] = [];
    for (let x = 0; x <= width; x++) {
      grid[y][x] = rand();
    }
  }
  return grid;
}

function sampleNoise(
  noiseGrid: number[][],
  x: number,
  y: number,
  freq: number,
  gridW: number,
  gridH: number,
): number {
  const sx = x * freq;
  const sy = y * freq;
  const ix = Math.floor(sx) % (gridW + 1);
  const iy = Math.floor(sy) % (gridH + 1);
  const fx = sx - Math.floor(sx);
  const fy = sy - Math.floor(sy);
  const nx = (ix + 1) % (gridW + 1);
  const ny = (iy + 1) % (gridH + 1);

  const a = noiseGrid[iy][ix];
  const b = noiseGrid[iy][nx];
  const c = noiseGrid[ny][ix];
  const d = noiseGrid[ny][nx];

  const ab = a + (b - a) * fx;
  const cd = c + (d - c) * fx;
  return ab + (cd - ab) * fy;
}

function generateHeightmap(rand: () => number): number[][] {
  const noiseGrid = createNoiseGrid(GRID_WIDTH, GRID_HEIGHT, rand);
  const heightmap: number[][] = [];

  for (let row = 0; row < GRID_HEIGHT; row++) {
    heightmap[row] = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      // Multi-octave noise
      let val = 0;
      val += sampleNoise(noiseGrid, col, row, 0.03, GRID_WIDTH, GRID_HEIGHT) * 0.5;
      val += sampleNoise(noiseGrid, col, row, 0.07, GRID_WIDTH, GRID_HEIGHT) * 0.3;
      val += sampleNoise(noiseGrid, col, row, 0.15, GRID_WIDTH, GRID_HEIGHT) * 0.2;

      // Downhill slope: top is higher, bottom is lower
      const slopeGradient = 1 - (row / GRID_HEIGHT) * 0.5;
      val *= slopeGradient;

      // Add some gentle hills on the sides
      const centerBias = 1 - Math.abs(col / GRID_WIDTH - 0.5) * 0.3;
      val *= centerBias;

      heightmap[row][col] = Math.max(0, Math.min(1, val));
    }
  }

  return heightmap;
}

function carveChannels(
  heightmap: number[][],
  channelMap: boolean[][],
  rand: () => number,
): void {
  const numChannels = 3 + Math.floor(rand() * 3); // 3-5 channels

  for (let c = 0; c < numChannels; c++) {
    // Start near the top at a random x
    let col = Math.floor(GRID_WIDTH * 0.15 + rand() * GRID_WIDTH * 0.7);
    const startRow = Math.floor(rand() * 5);

    for (let row = startRow; row < GRID_HEIGHT; row++) {
      // Mark channel cell
      const minCol = Math.max(0, col - 1);
      const maxCol = Math.min(GRID_WIDTH - 1, col + 1);

      // Main channel cell
      if (col >= 0 && col < GRID_WIDTH) {
        channelMap[row][col] = true;
        heightmap[row][col] -= 0.06 + rand() * 0.04;
        heightmap[row][col] = Math.max(0, heightmap[row][col]);
      }

      // Occasionally widen
      if (rand() < 0.3) {
        const side = rand() < 0.5 ? minCol : maxCol;
        channelMap[row][side] = true;
        heightmap[row][side] -= 0.04 + rand() * 0.02;
        heightmap[row][side] = Math.max(0, heightmap[row][side]);
      }

      // Drift laterally, biased toward lower elevation
      const drift = rand();
      if (drift < 0.3 && col > 2) {
        col--;
      } else if (drift > 0.7 && col < GRID_WIDTH - 3) {
        col++;
      }
      // Also bias toward lower neighbor
      if (col > 0 && col < GRID_WIDTH - 1) {
        if (heightmap[row][col - 1] < heightmap[row][col + 1] && rand() < 0.3) {
          col--;
        } else if (rand() < 0.3) {
          col++;
        }
      }
    }
  }
}

function computeDistanceFromChannels(channelMap: boolean[][]): number[][] {
  const dist: number[][] = [];
  const maxDist = 15;

  for (let row = 0; row < GRID_HEIGHT; row++) {
    dist[row] = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      if (channelMap[row][col]) {
        dist[row][col] = 0;
        continue;
      }
      let minD = maxDist;
      // Search nearby cells for channels
      const searchRadius = maxDist;
      for (let dr = -searchRadius; dr <= searchRadius; dr++) {
        for (let dc = -searchRadius; dc <= searchRadius; dc++) {
          const r = row + dr;
          const c = col + dc;
          if (r >= 0 && r < GRID_HEIGHT && c >= 0 && c < GRID_WIDTH && channelMap[r][c]) {
            const d = Math.sqrt(dr * dr + dc * dc);
            if (d < minD) minD = d;
          }
        }
      }
      dist[row][col] = minD;
    }
  }
  return dist;
}

export function generateTerrain(seed: number = 42): Cell[][] {
  const rand = mulberry32(seed);
  const heightmap = generateHeightmap(rand);

  const channelMap: boolean[][] = [];
  for (let row = 0; row < GRID_HEIGHT; row++) {
    channelMap[row] = new Array(GRID_WIDTH).fill(false);
  }

  carveChannels(heightmap, channelMap, rand);

  const distFromChannel = computeDistanceFromChannels(channelMap);

  const grid: Cell[][] = [];
  for (let row = 0; row < GRID_HEIGHT; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      const d = distFromChannel[row][col];
      let soilType: SoilType;
      let vegetationGrowth: number;

      if (d < 2) {
        soilType = SoilType.BarePeat;
        vegetationGrowth = 0;
      } else if (d < 6) {
        soilType = SoilType.Degraded;
        vegetationGrowth = 0.2 + (d - 2) * 0.05;
      } else {
        soilType = SoilType.Vegetated;
        vegetationGrowth = 0.6 + rand() * 0.3;
      }

      grid[row][col] = {
        elevation: heightmap[row][col],
        waterLevel: 0,
        soilType,
        damType: DamType.None,
        vegetationGrowth,
        isChannel: channelMap[row][col],
      };
    }
  }

  return grid;
}
