import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { GameEngine } from './GameEngine';
import type { LogicEvent } from './Entities';

interface GameContextProps {
  engine: GameEngine;
  voltage: number;
  clockCycles: number;
  wave: number;
  score: number;
  isGameOver: boolean;
  events: LogicEvent[];
  isPlanningPhase: boolean;
  startNextWave: () => void;
  lastWaveStats: any;
  cumulativeStats: any;
  isGameStarted: boolean;
  startGame: () => void;
}

const GameContext = createContext<GameContextProps | null>(null);

export const useGameEngine = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameEngine must be used within GameProvider");
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const engineRef = useRef<GameEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new GameEngine();
  }

  const [voltage, setVoltage] = useState(engineRef.current.voltage);
  const [clockCycles, setClockCycles] = useState(engineRef.current.clockCycles);
  const [wave, setWave] = useState(engineRef.current.wave);
  const [score, setScore] = useState(engineRef.current.score);
  const [isGameOver, setIsGameOver] = useState(engineRef.current.isGameOver);
  const [events, setEvents] = useState<LogicEvent[]>([]);
  const [isPlanningPhase, setIsPlanningPhase] = useState(engineRef.current.isPlanningPhase);
  const [lastWaveStats, setLastWaveStats] = useState(engineRef.current.lastWaveStats);
  const [cumulativeStats, setCumulativeStats] = useState(engineRef.current.cumulativeStats);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    const engine = engineRef.current!;
    
    engine.onStateUpdate = (v, c, w, s, g, e, p, stats, globalStats) => {
      setVoltage(v);
      setClockCycles(c);
      setWave(w);
      setScore(s);
      setIsGameOver(g);
      setEvents([...e]);
      setIsPlanningPhase(p);
      setLastWaveStats(stats);
      setCumulativeStats(globalStats);
    };

    // Engine is now started manually via startGame()

    return () => {
      engine.stop();
    };
  }, []);

  const startGame = () => {
    setIsGameStarted(true);
    engineRef.current?.start();
  };

  const startNextWave = () => {
    engineRef.current?.startNextWave();
  };

  return (
    <GameContext.Provider value={{ engine: engineRef.current, voltage, clockCycles, wave, score, isGameOver, events, isPlanningPhase, startNextWave, lastWaveStats, cumulativeStats, isGameStarted, startGame }}>
      {children}
    </GameContext.Provider>
  );
};
