export enum SoilType {
  BarePeat = 0,
  Degraded = 1,
  Vegetated = 2,
}

export enum DamType {
  None = 0,
  Timber = 1,
  PeatDam = 2,
  SphagnumPlug = 3,
}

export enum GamePhase {
  Tutorial = 'tutorial',
  Placing = 'placing',
  Raining = 'raining',
  Results = 'results',
  GameOver = 'gameover',
}

export interface Cell {
  elevation: number;
  waterLevel: number;
  soilType: SoilType;
  damType: DamType;
  vegetationGrowth: number;
  isChannel: boolean;
}

export interface GameState {
  grid: Cell[][];
  phase: GamePhase;
  round: number;
  budget: number;
  totalRainfall: number;
  totalDrained: number;
  selectedTool: DamType | null;
  roundScores: number[];
  rainProgress: number; // 0-1, how far through the current rain event
}

export interface SimulationParams {
  flowRate: number;
  channelFlowMultiplier: number;
  barePeatPermeability: number;
  degradedPermeability: number;
  vegetatedPermeability: number;
  damBlockFactor: number;
  sphagnumSlowFactor: number;
  rainfallIntensity: number;
  evaporationRate: number;
}
