import { GRID_WIDTH, GRID_HEIGHT, DEFAULT_SIM_PARAMS } from './constants';
import { type Cell, type SimulationParams, DamType, SoilType } from './types';

function getPermeability(cell: Cell, params: SimulationParams): number {
  // Dams override permeability
  if (cell.damType === DamType.Timber || cell.damType === DamType.PeatDam) {
    return params.damBlockFactor; // ~0, blocks flow
  }
  if (cell.damType === DamType.SphagnumPlug) {
    return params.sphagnumSlowFactor; // ~0.2, slows flow
  }

  // Soil-based permeability
  switch (cell.soilType) {
    case SoilType.BarePeat:
      return params.barePeatPermeability;
    case SoilType.Degraded:
      return params.degradedPermeability;
    case SoilType.Vegetated:
      return params.vegetatedPermeability * (1 - cell.vegetationGrowth * 0.3);
    default:
      return 1;
  }
}

function getFlowMultiplier(cell: Cell, params: SimulationParams): number {
  if (cell.isChannel) return params.channelFlowMultiplier;
  return 1;
}

export function simulateTick(
  grid: Cell[][],
  params: SimulationParams = DEFAULT_SIM_PARAMS,
): { grid: Cell[][]; drainedThisTick: number } {
  // Double-buffer: compute all deltas first, then apply
  const waterDelta: number[][] = [];
  for (let row = 0; row < GRID_HEIGHT; row++) {
    waterDelta[row] = new Array(GRID_WIDTH).fill(0);
  }

  let drainedThisTick = 0;

  // Cardinal neighbor offsets
  const dirs = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1],  // right
  ];

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = grid[row][col];
      if (cell.waterLevel <= 0) continue;

      const head = cell.elevation + cell.waterLevel;
      const srcPermeability = getPermeability(cell, params);
      const srcFlowMult = getFlowMultiplier(cell, params);

      let totalOutflow = 0;
      const flows: { dr: number; dc: number; amount: number }[] = [];

      for (const [dr, dc] of dirs) {
        const nr = row + dr;
        const nc = col + dc;

        // Water flowing off the bottom edge = drained/lost
        if (nr >= GRID_HEIGHT) {
          const edgeFlow = cell.waterLevel * params.flowRate * srcFlowMult * srcPermeability * 0.5;
          flows.push({ dr, dc, amount: edgeFlow });
          totalOutflow += edgeFlow;
          continue;
        }

        if (nr < 0 || nc < 0 || nc >= GRID_WIDTH) continue;

        const neighbor = grid[nr][nc];
        const neighborHead = neighbor.elevation + neighbor.waterLevel;

        if (neighborHead >= head) continue;

        const delta = head - neighborHead;
        const destPermeability = getPermeability(neighbor, params);
        const avgPermeability = (srcPermeability + destPermeability) / 2;

        let flow = delta * params.flowRate * srcFlowMult * avgPermeability;

        // Clamp individual flow
        flow = Math.min(flow, cell.waterLevel * 0.25);

        flows.push({ dr, dc, amount: flow });
        totalOutflow += flow;
      }

      // Scale flows if total exceeds available water
      const scaleFactor = totalOutflow > cell.waterLevel
        ? cell.waterLevel / totalOutflow
        : 1;

      for (const { dr, dc, amount } of flows) {
        const scaledAmount = amount * scaleFactor;
        const nr = row + dr;
        const nc = col + dc;

        waterDelta[row][col] -= scaledAmount;

        if (nr >= GRID_HEIGHT) {
          // Water drained off the map
          drainedThisTick += scaledAmount;
        } else if (nr >= 0 && nc >= 0 && nc < GRID_WIDTH) {
          waterDelta[nr][nc] += scaledAmount;
        }
      }
    }
  }

  // Apply deltas + evaporation
  const newGrid = grid.map((rowCells, row) =>
    rowCells.map((cell, col) => {
      const newWater = Math.max(0, cell.waterLevel + waterDelta[row][col] - params.evaporationRate);
      return { ...cell, waterLevel: newWater };
    }),
  );

  return { grid: newGrid, drainedThisTick };
}

export function addRainfall(grid: Cell[][], intensity: number): Cell[][] {
  return grid.map((rowCells) =>
    rowCells.map((cell) => ({
      ...cell,
      waterLevel: cell.waterLevel + intensity,
    })),
  );
}

export function updateVegetation(grid: Cell[][]): Cell[][] {
  return grid.map((rowCells) =>
    rowCells.map((cell) => {
      let growth = cell.vegetationGrowth;

      // Water presence encourages vegetation growth
      if (cell.waterLevel > 0.01) {
        growth += 0.03;
      }

      // Peat dams and sphagnum boost nearby vegetation
      if (cell.damType === DamType.PeatDam) {
        growth += 0.08;
      } else if (cell.damType === DamType.SphagnumPlug) {
        growth += 0.06;
      }

      // Bare peat grows slower
      if (cell.soilType === SoilType.BarePeat) {
        growth *= 0.5;
      }

      growth = Math.min(1, growth);

      // Upgrade soil type if vegetation grows enough
      let soilType = cell.soilType;
      if (growth > 0.5 && soilType === SoilType.BarePeat) {
        soilType = SoilType.Degraded;
      } else if (growth > 0.8 && soilType === SoilType.Degraded) {
        soilType = SoilType.Vegetated;
      }

      return { ...cell, vegetationGrowth: growth, soilType };
    }),
  );
}

export function computeRetainedWater(grid: Cell[][]): number {
  let total = 0;
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      total += grid[row][col].waterLevel;
    }
  }
  return total;
}

export function computeVegetationScore(grid: Cell[][]): number {
  let total = 0;
  let count = 0;
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      total += grid[row][col].vegetationGrowth;
      count++;
    }
  }
  return (total / count) * 100;
}
