import React from 'react';
import { useGameEngine } from '../engine/GameContext';
import type { GateType } from '../engine/Entities';

export const LogicAnalyzer: React.FC = () => {
  const { events } = useGameEngine();
  
  if (events.length === 0) return null;

  const getColor = (gate: GateType) => {
    switch (gate) {
      case 'AND': return '#00ff66';
      case 'OR': return '#b026ff';
      case 'NOT': return '#00f3ff';
      case 'XOR': return '#ff003c';
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '280px',
      background: 'rgba(12, 18, 28, 0.85)',
      border: '1px solid rgba(0, 243, 255, 0.2)',
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 0 20px rgba(0,0,0,0.8), inset 0 0 10px rgba(0, 243, 255, 0.1)',
      pointerEvents: 'none', // Allow clicking through just in case
      zIndex: 100
    }}>
      <div style={{
        color: '#00f3ff',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '12px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
        paddingBottom: '8px',
        marginBottom: '4px',
        textShadow: '0 0 5px #00f3ff'
      }}>
        Live Logic Analyzer
      </div>
      
      {/* Event List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {events.map((ev, index) => {
           // Opacity fades out for older events
           const opacity = 1 - (index * 0.2);
           const gateColor = getColor(ev.operator);
           
           // Emphasize bits that actually flipped
           const changed0 = ev.input[0] !== ev.output[0];
           const changed1 = ev.input[1] !== ev.output[1];

           return (
             <div key={ev.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'monospace',
                fontSize: '14px',
                opacity,
                background: index === 0 ? 'rgba(0, 243, 255, 0.1)' : 'rgba(0,0,0,0.4)',
                border: index === 0 ? '1px solid rgba(0, 243, 255, 0.3)' : '1px solid transparent',
                padding: '6px 8px',
                borderRadius: '4px',
                transition: 'all 0.3s ease-out'
             }}>
                {/* Input Array */}
                <div style={{ color: '#aaa' }}>[{ev.input[0]} {ev.input[1]}]</div>
                
                {/* Operator Element */}
                <div style={{ 
                   color: gateColor, 
                   fontWeight: 'bold',
                   textShadow: `0 0 8px ${gateColor}`,
                   fontSize: '16px'
                }}>
                   {ev.operator}
                </div>
                
                {/* Output Array */}
                <div style={{ color: '#fff', fontWeight: 'bold' }}>
                   [
                   <span style={{ 
                     color: changed0 ? '#fff' : '#aaa',
                     textShadow: changed0 ? '0 0 8px #fff' : 'none'
                   }}>{ev.output[0]}</span>
                   {' '}
                   <span style={{ 
                     color: changed1 ? '#fff' : '#aaa',
                     textShadow: changed1 ? '0 0 8px #fff' : 'none'
                   }}>{ev.output[1]}</span>
                   ]
                </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};
