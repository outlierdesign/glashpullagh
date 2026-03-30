import { useEffect, useRef, useCallback } from 'react';
import { GamePhase, type GameState } from './types';
import { SIMULATION_TICK_MS } from './constants';
import { renderFrame } from './renderer';

interface UseGameLoopParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  terrainCacheRef: React.RefObject<HTMLCanvasElement | null>;
  state: GameState;
  hoverCell: { row: number; col: number } | null;
  onSimTick: () => void;
}

export function useGameLoop({
  canvasRef,
  terrainCacheRef,
  state,
  hoverCell,
  onSimTick,
}: UseGameLoopParams): void {
  const rafRef = useRef<number>(0);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  const hoverRef = useRef(hoverCell);

  // Keep refs in sync
  stateRef.current = state;
  hoverRef.current = hoverCell;

  // Stable simulation tick callback
  const simTickRef = useRef(onSimTick);
  simTickRef.current = onSimTick;

  // Render loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const terrainCache = terrainCacheRef.current;
    if (!canvas || !terrainCache) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderFrame(ctx, terrainCache, stateRef.current, hoverRef.current);
    rafRef.current = requestAnimationFrame(render);
  }, [canvasRef, terrainCacheRef]);

  // Start/stop render loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [render]);

  // Start/stop simulation tick interval during rain phase
  useEffect(() => {
    if (state.phase === GamePhase.Raining) {
      simIntervalRef.current = setInterval(() => {
        simTickRef.current();
      }, SIMULATION_TICK_MS);
    } else {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
    }
    return () => {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
    };
  }, [state.phase]);
}
