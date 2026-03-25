import React from 'react';
import { useGameEngine } from '../engine/GameContext';

export const TopInfoPanel: React.FC = () => {
  const { wave, score } = useGameEngine();
  return (
    <div className="top-panel">
      <div className="wave-info flex-col">
        <h2 className="glow-text-blue" style={{ letterSpacing: '2px', fontSize: '24px' }}>LEVEL: {wave}</h2>
        <span style={{ color: 'var(--neon-green)', fontSize: '12px', marginTop: '4px' }}>Status: Scanning Interface...</span>
      </div>
      
      <div className="score-info flex-col" style={{ textAlign: 'right' }}>
        <h2 className="glow-text-purple" style={{ color: 'var(--neon-purple)', textShadow: '0 0 10px var(--neon-purple)', margin: 0, fontSize: '24px' }}>SCORE: {score}</h2>
      </div>
    </div>
  );
};
