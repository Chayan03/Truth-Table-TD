import React, { useState } from 'react';
import { useGameEngine } from '../engine/GameContext';
import type { GateType } from '../engine/Entities';

const gates = [
  { id: 'AND', name: 'AND Gate', cost: 25, color: '#00ff66', desc: 'Out = [A, A AND B]' },
  { id: 'OR', name: 'OR Gate', cost: 30, color: '#b026ff', desc: 'Breaks Shields. Out: [1, 1]' },
  { id: 'NOT', name: 'NOT Gate', cost: 20, color: '#00f3ff', desc: 'Flips Left Bit: [~A, B]' },
  { id: 'XOR', name: 'XOR Gate', cost: 60, color: '#ff003c', desc: 'Out = [A, A XOR B]' }
];

const GateIcon = ({ type, color }: { type: string, color: string }) => {
  return (
    <svg width="140" height="84" viewBox="0 0 40 24" style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
      {type === 'AND' && (
        <path d="M 5 2 L 15 2 C 26 2 26 22 15 22 L 5 22 Z M 0 7 L 5 7 M 0 17 L 5 17 M 21 12 L 28 12" stroke={color} fill="rgba(0,0,0,0.5)" strokeWidth="2" />
      )}
      {type === 'OR' && (
        <path d="M 5 2 Q 12 12 5 22 Q 18 22 25 12 Q 18 2 5 2 Z M 0 7 L 8 7 M 0 17 L 8 17 M 25 12 L 32 12" stroke={color} fill="rgba(0,0,0,0.5)" strokeWidth="2" />
      )}
      {type === 'NOT' && (
        <path d="M 5 4 L 22 12 L 5 20 Z M 0 12 L 5 12 M 28 12 L 34 12 M 22 12 A 3 3 0 1 0 28 12 A 3 3 0 1 0 22 12" stroke={color} fill="rgba(0,0,0,0.5)" strokeWidth="2" />
      )}
      {type === 'XOR' && (
        <g>
          <path d="M 2 2 Q 9 12 2 22" stroke={color} fill="none" strokeWidth="2" />
          <path d="M 7 2 Q 14 12 7 22 Q 20 22 27 12 Q 20 2 7 2 Z M 0 7 L 10 7 M 0 17 L 10 17 M 27 12 L 34 12" stroke={color} fill="rgba(0,0,0,0.5)" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
};

const GameLogo = () => (
  <svg width="40" height="40" viewBox="0 0 32 32" style={{ filter: 'drop-shadow(0 0 8px #00f3ff)', flexShrink: 0 }}>
    <path d="M 16 2 L 30 10 L 30 22 L 16 30 L 2 22 L 2 10 Z" fill="rgba(0, 243, 255, 0.15)" stroke="#00f3ff" strokeWidth="2" />
    <path d="M 16 8 L 24 13 L 24 20 L 16 24 L 8 20 L 8 13 Z" fill="none" stroke="#b026ff" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="3" fill="#00ff66" style={{ filter: 'drop-shadow(0 0 5px #00ff66)' }} />
    <line x1="16" y1="2" x2="16" y2="8" stroke="#00f3ff" strokeWidth="2" />
    <line x1="16" y1="24" x2="16" y2="30" stroke="#00f3ff" strokeWidth="2" />
    <line x1="2" y1="10" x2="8" y2="13" stroke="#00f3ff" strokeWidth="2" />
    <line x1="30" y1="10" x2="24" y2="13" stroke="#00f3ff" strokeWidth="2" />
    <line x1="2" y1="22" x2="8" y2="20" stroke="#00f3ff" strokeWidth="2" />
    <line x1="30" y1="22" x2="24" y2="20" stroke="#00f3ff" strokeWidth="2" />
  </svg>
);

export const TowerSidebar: React.FC = () => {
  const { voltage, clockCycles } = useGameEngine();
  const [selectedGate, setSelectedGate] = useState<GateType | null>(null);

  const handleSelect = (gateType: GateType) => {
    setSelectedGate(gateType);
    (window as any).selectedGateToPlace = gateType;
  };

  return (
    <div className="sidebar" style={{ background: 'linear-gradient(180deg, rgba(20,28,40,0.95) 0%, rgba(12,18,28,0.95) 100%)', borderRight: '1px solid rgba(0, 243, 255, 0.2)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', width: '320px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <GameLogo />
        <h2 style={{ color: '#00f3ff', margin: 0, fontSize: '20px', letterSpacing: '1px', textShadow: '0 0 10px #00f3ff' }}>TRUTH TABLE TD</h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
        <div>
          <div style={{ color: '#8899aa', fontSize: '16px', fontWeight: 'bold' }}>VOLTAGE (LIVES): ⚡</div>
          <div style={{ color: '#ff003c', fontSize: '32px', fontWeight: 'bold', textShadow: '0 0 10px #ff003c', marginTop: '4px' }}>{voltage}</div>
        </div>
        <div>
          <div style={{ color: '#8899aa', fontSize: '16px', fontWeight: 'bold' }}>CLOCK CYCLES ($) ⏱️</div>
          <div style={{ color: '#00ff66', fontSize: '32px', fontWeight: 'bold', textShadow: '0 0 10px #00ff66', marginTop: '4px' }}>{clockCycles}</div>
        </div>
      </div>

      <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #334455', paddingBottom: '5px', marginTop: '10px' }}>LOGIC GATES</div>

      <div className="gates-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
        {gates.map(gate => (
          <div 
            key={gate.id}
            className={`gate-card ${selectedGate === gate.id ? 'selected' : ''}`}
            onClick={() => handleSelect(gate.id as GateType)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${selectedGate === gate.id ? gate.color : 'rgba(255,255,255,0.1)'}`,
              background: selectedGate === gate.id ? `linear-gradient(90deg, ${gate.color}22 0%, transparent 100%)` : 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedGate === gate.id ? `0 0 15px ${gate.color}44 inset` : 'none',
              position: 'relative',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ position: 'absolute', top: '12px', right: '14px', color: gate.color, fontSize: '16px', fontWeight: 'bold' }}>${gate.cost}</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
              <GateIcon type={gate.id} color={gate.color} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: gate.color, fontSize: '20px', fontWeight: 'bold', textShadow: `0 0 5px ${gate.color}` }}>{gate.name}</div>
              <div style={{ color: '#8899aa', fontSize: '14px', marginTop: '8px' }}>{gate.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
