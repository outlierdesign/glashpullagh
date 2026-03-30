import { DamType, type SimulationParams } from './types';

export const GRID_WIDTH = 100;
export const GRID_HEIGHT = 80;
export const CELL_SIZE = 6;

export const CANVAS_WIDTH = GRID_WIDTH * CELL_SIZE;
export const CANVAS_HEIGHT = GRID_HEIGHT * CELL_SIZE;

export const SIMULATION_TICK_MS = 50; // 20 ticks/sec
export const RAIN_DURATION_TICKS = 200; // 10 seconds of rain per round
export const ROUNDS_TOTAL = 5;
export const STARTING_BUDGET = 100;
export const BUDGET_PER_ROUND = 40;

export const DAM_COSTS: Record<DamType, number> = {
  [DamType.None]: 0,
  [DamType.Timber]: 10,
  [DamType.PeatDam]: 25,
  [DamType.SphagnumPlug]: 15,
};

export const DAM_LABELS: Record<DamType, string> = {
  [DamType.None]: '',
  [DamType.Timber]: 'Timber Dam',
  [DamType.PeatDam]: 'Peat Dam',
  [DamType.SphagnumPlug]: 'Sphagnum Plug',
};

export const DAM_DESCRIPTIONS: Record<DamType, string> = {
  [DamType.None]: '',
  [DamType.Timber]: 'Blocks 1 channel cell. Place on eroded channels.',
  [DamType.PeatDam]: 'Blocks 3-wide band. Boosts vegetation recovery.',
  [DamType.SphagnumPlug]: 'Slows flow over 3x3 area. Encourages re-wetting.',
};

export const RAINFALL_MULTIPLIERS = [1.0, 1.5, 2.0, 3.0, 4.0];

export const DEFAULT_SIM_PARAMS: SimulationParams = {
  flowRate: 0.15,
  channelFlowMultiplier: 2.5,
  barePeatPermeability: 1.0,
  degradedPermeability: 0.6,
  vegetatedPermeability: 0.25,
  damBlockFactor: 0.0,
  sphagnumSlowFactor: 0.2,
  rainfallIntensity: 0.004,
  evaporationRate: 0.0001,
};

// Colors from site's CSS design tokens
export const COLORS = {
  terrainDeep: '#12100C',
  terrainLow: '#2A2218',
  terrainMid: '#3D3528',
  terrainHigh: '#4A5E3A',
  terrainPeak: '#5A7A42',
  channel: '#080604',
  barePeat: '#1E1914',

  waterShallow: [74, 138, 138, 0.25] as [number, number, number, number],
  waterDeep: [74, 138, 138, 0.85] as [number, number, number, number],

  vegetation: '#5A7A52',
  sphagnumGreen: '#7A9C6E',

  timberDam: '#8A7A5A',
  peatDam: '#6B6040',
  sphagnumPlug: '#4A6340',

  contour: 'rgba(200,169,100,0.1)',

  hoverValid: 'rgba(90,122,82,0.4)',
  hoverInvalid: 'rgba(180,60,60,0.4)',
};
