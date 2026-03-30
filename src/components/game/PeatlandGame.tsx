'use client';

import { useReducer, useRef, useCallback, useEffect, useState } from 'react';
import {
  type Cell,
  type GameState,
  DamType,
  GamePhase,
} from './types';
import {
  CELL_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  RAIN_DURATION_TICKS,
  ROUNDS_TOTAL,
  STARTING_BUDGET,
  BUDGET_PER_ROUND,
  DAM_COSTS,
  DAM_LABELS,
  DAM_DESCRIPTIONS,
  RAINFALL_MULTIPLIERS,
  DEFAULT_SIM_PARAMS,
} from './constants';
import { generateTerrain } from './terrain';
import {
  simulateTick,
  addRainfall,
  updateVegetation,
  computeRetainedWater,
  computeVegetationScore,
} from './simulation';
import { renderTerrainCache, isPlacementValid, getDamFootprint } from './renderer';
import { useGameLoop } from './useGameLoop';

// --- Reducer ---

type GameAction =
  | { type: 'SELECT_TOOL'; tool: DamType | null }
  | { type: 'PLACE_DAM'; row: number; col: number }
  | { type: 'START_RAIN' }
  | { type: 'SIM_TICK' }
  | { type: 'NEXT_ROUND' }
  | { type: 'DISMISS_TUTORIAL' }
  | { type: 'RESTART' };

function createInitialState(): GameState {
  return {
    grid: generateTerrain(42),
    phase: GamePhase.Tutorial,
    round: 1,
    budget: STARTING_BUDGET,
    totalRainfall: 0,
    totalDrained: 0,
    selectedTool: null,
    roundScores: [],
    rainProgress: 0,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'DISMISS_TUTORIAL':
      return { ...state, phase: GamePhase.Placing };

    case 'SELECT_TOOL':
      return { ...state, selectedTool: action.tool };

    case 'PLACE_DAM': {
      if (!state.selectedTool || state.phase !== GamePhase.Placing) return state;

      const { row, col } = action;
      const cost = DAM_COSTS[state.selectedTool];
      if (state.budget < cost) return state;
      if (!isPlacementValid(state.grid, row, col, state.selectedTool)) return state;

      const footprint = getDamFootprint(row, col, state.selectedTool);
      const newGrid = state.grid.map((rowCells) => rowCells.map((c) => ({ ...c })));
      for (const [r, c] of footprint) {
        newGrid[r][c] = { ...newGrid[r][c], damType: state.selectedTool };
      }

      return {
        ...state,
        grid: newGrid,
        budget: state.budget - cost,
      };
    }

    case 'START_RAIN':
      return {
        ...state,
        phase: GamePhase.Raining,
        totalRainfall: 0,
        totalDrained: 0,
        rainProgress: 0,
      };

    case 'SIM_TICK': {
      if (state.phase !== GamePhase.Raining) return state;

      const newProgress = state.rainProgress + 1 / RAIN_DURATION_TICKS;
      const intensity =
        DEFAULT_SIM_PARAMS.rainfallIntensity *
        RAINFALL_MULTIPLIERS[Math.min(state.round - 1, RAINFALL_MULTIPLIERS.length - 1)];

      // Add rain for first 60% of the duration, then let water settle
      const isRaining = newProgress < 0.6;
      let grid = state.grid;
      let addedRainfall = 0;

      if (isRaining) {
        grid = addRainfall(grid, intensity);
        addedRainfall = intensity * grid.length * grid[0].length;
      }

      const { grid: simGrid, drainedThisTick } = simulateTick(grid);

      if (newProgress >= 1) {
        // Round complete
        const retained = computeRetainedWater(simGrid);
        const totalRain = state.totalRainfall + addedRainfall;
        const score = totalRain > 0 ? (retained / totalRain) * 100 : 0;
        const updatedGrid = updateVegetation(simGrid);

        return {
          ...state,
          grid: updatedGrid,
          phase: state.round >= ROUNDS_TOTAL ? GamePhase.GameOver : GamePhase.Results,
          totalRainfall: totalRain,
          totalDrained: state.totalDrained + drainedThisTick,
          roundScores: [...state.roundScores, Math.min(100, score)],
          rainProgress: 1,
        };
      }

      return {
        ...state,
        grid: simGrid,
        totalRainfall: state.totalRainfall + addedRainfall,
        totalDrained: state.totalDrained + drainedThisTick,
        rainProgress: newProgress,
      };
    }

    case 'NEXT_ROUND':
      return {
        ...state,
        phase: GamePhase.Placing,
        round: state.round + 1,
        budget: state.budget + BUDGET_PER_ROUND,
        totalRainfall: 0,
        totalDrained: 0,
        rainProgress: 0,
      };

    case 'RESTART':
      return createInitialState();

    default:
      return state;
  }
}

// --- Component ---

export function PeatlandGame() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const terrainCacheRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);
  const [canvasScale, setCanvasScale] = useState(1);

  // Hide site nav on mount, restore on unmount
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.display = 'none';
      return () => { nav.style.display = ''; };
    }
  }, []);

  // Generate terrain cache when grid terrain changes (round transitions grow vegetation)
  useEffect(() => {
    terrainCacheRef.current = renderTerrainCache(state.grid);
  }, [state.round, state.phase]);

  // Initial terrain cache
  useEffect(() => {
    terrainCacheRef.current = renderTerrainCache(state.grid);
  }, []);

  // Handle canvas sizing for DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const container = canvas.parentElement;
    if (!container) return;

    const resize = () => {
      const containerW = container.clientWidth;
      const containerH = container.clientHeight;
      const scaleX = containerW / CANVAS_WIDTH;
      const scaleY = containerH / CANVAS_HEIGHT;
      const scale = Math.min(scaleX, scaleY, 2); // cap at 2x

      const displayW = Math.floor(CANVAS_WIDTH * scale);
      const displayH = Math.floor(CANVAS_HEIGHT * scale);

      canvas.style.width = `${displayW}px`;
      canvas.style.height = `${displayH}px`;
      canvas.width = Math.floor(displayW * dpr);
      canvas.height = Math.floor(displayH * dpr);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
      }
      setCanvasScale(scale);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Simulation tick callback
  const onSimTick = useCallback(() => {
    dispatch({ type: 'SIM_TICK' });
  }, []);

  useGameLoop({
    canvasRef,
    terrainCacheRef,
    state,
    hoverCell,
    onSimTick,
  });

  // Mouse/touch to grid coordinates
  const getGridCell = useCallback(
    (clientX: number, clientY: number): { row: number; col: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const col = Math.floor(x / (CELL_SIZE * canvasScale));
      const row = Math.floor(y / (CELL_SIZE * canvasScale));

      if (row < 0 || row >= state.grid.length || col < 0 || col >= state.grid[0].length) {
        return null;
      }
      return { row, col };
    },
    [canvasScale, state.grid],
  );

  const handleCanvasMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const point =
        'touches' in e ? e.touches[0] : e;
      if (!point) return;
      setHoverCell(getGridCell(point.clientX, point.clientY));
    },
    [getGridCell],
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (state.phase !== GamePhase.Placing || !state.selectedTool) return;

      const point = 'touches' in e ? e.changedTouches[0] : e;
      if (!point) return;
      const cell = getGridCell(point.clientX, point.clientY);
      if (cell) {
        dispatch({ type: 'PLACE_DAM', row: cell.row, col: cell.col });
      }
    },
    [getGridCell, state.phase, state.selectedTool],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '1') dispatch({ type: 'SELECT_TOOL', tool: DamType.Timber });
      if (e.key === '2') dispatch({ type: 'SELECT_TOOL', tool: DamType.PeatDam });
      if (e.key === '3') dispatch({ type: 'SELECT_TOOL', tool: DamType.SphagnumPlug });
      if (e.key === 'Escape') dispatch({ type: 'SELECT_TOOL', tool: null });
      if (e.key === ' ' && state.phase === GamePhase.Placing) {
        e.preventDefault();
        dispatch({ type: 'START_RAIN' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state.phase]);

  // Computed values
  const currentRetained = computeRetainedWater(state.grid);
  const retentionPct =
    state.totalRainfall > 0 ? Math.min(100, (currentRetained / state.totalRainfall) * 100) : 0;
  const vegScore = computeVegetationScore(state.grid);
  const avgScore =
    state.roundScores.length > 0
      ? state.roundScores.reduce((a, b) => a + b, 0) / state.roundScores.length
      : 0;

  const roundLabel =
    state.round <= RAINFALL_MULTIPLIERS.length
      ? ['Light Drizzle', 'Steady Rain', 'Heavy Rain', 'Storm', 'Extreme Storm'][state.round - 1]
      : 'Extreme Storm';

  return (
    <div className="relative w-full h-full flex flex-col items-center" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Status bar */}
      <div className="w-full flex items-center justify-between px-4 py-2" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>Round <strong style={{ color: 'var(--gold)' }}>{state.round}</strong>/{ROUNDS_TOTAL}</span>
          <span>{roundLabel}</span>
        </div>
        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>Budget: <strong style={{ color: 'var(--gold)' }}>{state.budget}</strong></span>
          {state.phase === GamePhase.Raining && (
            <span>Retention: <strong style={{ color: 'var(--teal-light)' }}>{retentionPct.toFixed(1)}%</strong></span>
          )}
        </div>
      </div>

      {/* Rain progress bar */}
      {state.phase === GamePhase.Raining && (
        <div className="w-full h-1" style={{ background: 'var(--bg-deep)' }}>
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${state.rainProgress * 100}%`,
              background: state.rainProgress < 0.6
                ? 'var(--teal)'
                : 'var(--green-sage)',
            }}
          />
        </div>
      )}

      {/* Canvas area */}
      <div className="flex-1 flex items-center justify-center p-4 w-full overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleCanvasMove}
          onMouseLeave={() => setHoverCell(null)}
          onClick={handleCanvasClick}
          onTouchMove={handleCanvasMove}
          onTouchEnd={handleCanvasClick}
          className="block rounded"
          style={{
            cursor: state.selectedTool ? 'crosshair' : 'default',
            imageRendering: 'pixelated',
          }}
        />
      </div>

      {/* Toolbar */}
      {(state.phase === GamePhase.Placing || state.phase === GamePhase.Raining) && (
        <div
          className="w-full flex items-center justify-center gap-2 px-4 py-3 flex-wrap"
          style={{
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          {state.phase === GamePhase.Placing && (
            <>
              {([DamType.Timber, DamType.PeatDam, DamType.SphagnumPlug] as const).map((tool, i) => (
                <button
                  key={tool}
                  onClick={() =>
                    dispatch({
                      type: 'SELECT_TOOL',
                      tool: state.selectedTool === tool ? null : tool,
                    })
                  }
                  className="px-3 py-2 rounded text-sm transition-all"
                  style={{
                    background:
                      state.selectedTool === tool ? 'var(--gold-dim)' : 'var(--bg-elevated)',
                    border: `1px solid ${state.selectedTool === tool ? 'var(--gold)' : 'var(--border-color)'}`,
                    color: state.selectedTool === tool ? 'var(--gold)' : 'var(--text-secondary)',
                  }}
                  title={DAM_DESCRIPTIONS[tool]}
                >
                  <span className="opacity-50 mr-1">{i + 1}</span>
                  {DAM_LABELS[tool]}
                  <span className="ml-2 opacity-60">({DAM_COSTS[tool]})</span>
                </button>
              ))}

              <button
                onClick={() => dispatch({ type: 'START_RAIN' })}
                className="px-4 py-2 rounded text-sm font-medium ml-4 transition-all"
                style={{
                  background: 'var(--teal)',
                  color: 'var(--cream)',
                  border: '1px solid var(--teal-light)',
                }}
              >
                Start Rain (Space)
              </button>
            </>
          )}

          {state.phase === GamePhase.Raining && (
            <div className="text-sm animate-pulse" style={{ color: 'var(--teal-light)' }}>
              {state.rainProgress < 0.6 ? 'Raining...' : 'Water settling...'}
            </div>
          )}
        </div>
      )}

      {/* Tutorial overlay */}
      {state.phase === GamePhase.Tutorial && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: 'rgba(14,11,9,0.92)' }}
        >
          <div
            className="max-w-lg mx-4 p-6 rounded-lg"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h2 className="text-xl mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
              Peatland Water Retention
            </h2>
            <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <p>
                Heavy rainfall erodes channels in peatland bogs, causing water to drain too quickly.
                Bare peat and lack of vegetation make this worse.
              </p>
              <p>
                Your mission: <strong style={{ color: 'var(--cream)' }}>place dams to retain water</strong> on the landscape
                and encourage vegetation recovery.
              </p>
              <div className="space-y-1.5 mt-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#8A7A5A' }} />
                  <span><strong>Timber Dam</strong> — blocks one channel cell (cost: 10)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#6B6040' }} />
                  <span><strong>Peat Dam</strong> — blocks 3-wide band, boosts vegetation (cost: 25)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#4A6340' }} />
                  <span><strong>Sphagnum Plug</strong> — slows flow over 3x3 area (cost: 15)</span>
                </div>
              </div>
              <p className="mt-3" style={{ color: 'var(--text-dim)' }}>
                Place dams, then press <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}>Space</kbd> to start the rain.
                Retain as much water as possible across 5 rounds of increasing intensity.
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: 'DISMISS_TUTORIAL' })}
              className="mt-4 px-5 py-2 rounded text-sm font-medium w-full transition-all"
              style={{
                background: 'var(--gold)',
                color: 'var(--bg-deep)',
              }}
            >
              Start Playing
            </button>
          </div>
        </div>
      )}

      {/* Round results overlay */}
      {state.phase === GamePhase.Results && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: 'rgba(14,11,9,0.85)' }}
        >
          <div
            className="max-w-sm mx-4 p-6 rounded-lg text-center"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 className="text-lg mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
              Round {state.round} Complete
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>{roundLabel}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--teal-light)' }}>
                  {state.roundScores[state.roundScores.length - 1]?.toFixed(1)}%
                </div>
                <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Water Retained</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--green-light)' }}>
                  {vegScore.toFixed(1)}%
                </div>
                <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Vegetation</div>
              </div>
            </div>

            <button
              onClick={() => dispatch({ type: 'NEXT_ROUND' })}
              className="px-5 py-2 rounded text-sm font-medium w-full transition-all"
              style={{
                background: 'var(--gold)',
                color: 'var(--bg-deep)',
              }}
            >
              Next Round ({state.round + 1}/{ROUNDS_TOTAL})
            </button>
          </div>
        </div>
      )}

      {/* Game Over overlay */}
      {state.phase === GamePhase.GameOver && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: 'rgba(14,11,9,0.9)' }}
        >
          <div
            className="max-w-sm mx-4 p-6 rounded-lg text-center"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--gold-dim)',
            }}
          >
            <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
              Restoration Complete
            </h3>

            <div className="mb-4">
              <div className="text-4xl font-bold mb-1" style={{ color: 'var(--teal-light)' }}>
                {avgScore.toFixed(1)}%
              </div>
              <div className="text-sm" style={{ color: 'var(--text-dim)' }}>Average Water Retention</div>
            </div>

            <div className="mb-4 text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              {state.roundScores.map((s, i) => (
                <div key={i} className="flex justify-between px-4">
                  <span>Round {i + 1}</span>
                  <span style={{ color: 'var(--teal-light)' }}>{s.toFixed(1)}%</span>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="text-lg font-bold" style={{ color: 'var(--green-light)' }}>
                {vegScore.toFixed(1)}%
              </div>
              <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Final Vegetation Recovery</div>
            </div>

            <p className="text-xs mb-4" style={{ color: 'var(--text-dim)', lineHeight: '1.5' }}>
              {avgScore > 60
                ? 'Excellent work! The bog is holding water and vegetation is recovering.'
                : avgScore > 35
                  ? 'Good progress. More dams in the channels would help retain water.'
                  : 'The water is draining too fast. Try blocking the main channels with timber dams.'}
            </p>

            <button
              onClick={() => dispatch({ type: 'RESTART' })}
              className="px-5 py-2 rounded text-sm font-medium w-full transition-all"
              style={{
                background: 'var(--gold)',
                color: 'var(--bg-deep)',
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
