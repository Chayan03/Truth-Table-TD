import React from 'react';
import { useGameEngine } from '../engine/GameContext';

export const GameOverPopup: React.FC = () => {
  const { isGameOver, wave, score, cumulativeStats } = useGameEngine();

  if (!isGameOver) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(12, 18, 28, 0.95)',
      border: '2px solid rgba(255, 0, 60, 0.6)',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 0 60px rgba(255, 0, 60, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.9)',
      textAlign: 'center',
      color: '#fff',
      fontFamily: 'Orbitron, sans-serif',
      zIndex: 2000,
      width: '740px',
      backdropFilter: 'blur(12px)',
      animation: 'pulse-glow 2s infinite alternate'
    }}>
      <h1 style={{ color: '#ff003c', margin: '0 0 10px 0', textShadow: '0 0 20px #ff003c', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '42px' }}>
        SYSTEM BREACH
      </h1>
      
      <p style={{ color: '#aaa', marginBottom: '30px', fontSize: '18px', letterSpacing: '2px' }}>
        Core Voltage Depleted on <span style={{ color: '#00f3ff', fontWeight: 'bold' }}>Wave {wave}</span>
      </p>

      {/* Aggregate Lifetime Stats */}
      <div style={{ 
        background: 'rgba(0, 0, 0, 0.7)', 
        border: '1px solid rgba(255, 0, 60, 0.3)', 
        borderRadius: '8px', 
        padding: '24px', 
        marginBottom: '30px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        textAlign: 'left',
        boxShadow: 'inset 0 0 20px rgba(255, 0, 60, 0.05)'
      }}>
        <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
           <span style={{ color: '#ccc', letterSpacing: '1px' }}>Final Score:</span>
           <span style={{ color: '#ffcc00', fontWeight: 'bold', textShadow: '0 0 8px #ffcc00' }}>{score.toLocaleString()}</span>
        </div>
        <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
           <span style={{ color: '#ccc', letterSpacing: '1px' }}>Total Packets Nullified:</span>
           <span style={{ color: '#fff', fontWeight: 'bold' }}>{cumulativeStats?.packetsDestroyed?.toLocaleString() || 0}</span>
        </div>
        <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between' }}>
           <span style={{ color: '#ccc', letterSpacing: '1px' }}>Total Hardware Deployed:</span>
           <span style={{ color: '#b026ff', fontWeight: 'bold', textShadow: '0 0 5px #b026ff' }}>{cumulativeStats?.gatesPlaced?.toLocaleString() || 0}</span>
        </div>
        <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between' }}>
           <span style={{ color: '#ccc', letterSpacing: '1px' }}>Total Cycles Harvested:</span>
           <span style={{ color: '#00ff66', fontWeight: 'bold', textShadow: '0 0 5px #00ff66' }}>+{cumulativeStats?.cyclesEarned?.toLocaleString() || 0}</span>
        </div>
      </div>

      {/* Dynamic Lifetime Gate Performance Reports */}
      {cumulativeStats?.gatesPlaced > 0 && (
        <>
          <p style={{ color: '#ff003c', marginBottom: '16px', fontFamily: 'monospace', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'left', borderBottom: '1px solid rgba(255, 0, 60, 0.3)', paddingBottom: '8px' }}>
            Lifetime Hardware Analytics
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            fontFamily: 'monospace',
            fontSize: '13px',
            textAlign: 'left',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {/* AND */}
            {cumulativeStats.gateDetails.AND.placed > 0 && (
              <div style={{ border: '1px solid rgba(0,255,102,0.3)', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)' }}>
                <h4 style={{ color: '#00ff66', margin: '0 0 10px', textShadow: '0 0 8px #00ff66', fontSize: '15px' }}>✓ AND Gates</h4>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Lifetime Deployed: <span style={{color: '#fff'}}>{cumulativeStats.gateDetails.AND.placed}</span></div>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Lifetime Evaluated: <span style={{color: '#fff'}}>{cumulativeStats.gateDetails.AND.processed} Packets</span></div>
                <div style={{color: '#00ff66', marginBottom: '10px'}}>Lifetime Nullified: <span style={{fontWeight: 'bold'}}>{cumulativeStats.gateDetails.AND.nullified} Threats</span></div>
                <div style={{ borderTop: '1px solid rgba(0, 255, 102, 0.2)', paddingTop: '8px' }}>
                  {Object.entries(cumulativeStats.gateDetails.AND.transforms).map(([transform, count]) => (
                    <div key={transform} style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
                      {transform} <span style={{ color: '#fff' }}>(x{count as number})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* OR */}
            {cumulativeStats.gateDetails.OR.placed > 0 && (
              <div style={{ border: '1px solid rgba(176,38,255,0.3)', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)' }}>
                <h4 style={{ color: '#b026ff', margin: '0 0 10px', textShadow: '0 0 8px #b026ff', fontSize: '15px' }}>✓ OR Gates</h4>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Lifetime Deployed: <span style={{color: '#fff'}}>{cumulativeStats.gateDetails.OR.placed}</span></div>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Lifetime Evaluated: <span style={{color: '#fff'}}>{cumulativeStats.gateDetails.OR.processed} Packets</span></div>
                <div style={{color: '#b026ff', marginBottom: '10px'}}>Lifetime Shields Broken: <span style={{fontWeight: 'bold'}}>{cumulativeStats.gateDetails.OR.shieldsBroken}</span></div>
                <div style={{ borderTop: '1px solid rgba(176, 38, 255, 0.2)', paddingTop: '8px' }}>
                  {Object.entries(cumulativeStats.gateDetails.OR.transforms).map(([transform, count]) => (
                    <div key={transform} style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
                      {transform} <span style={{ color: '#fff' }}>(x{count as number})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* NOT */}
            {cumulativeStats.gateDetails.NOT.placed > 0 && (
              <div style={{ border: '1px solid rgba(0,243,255,0.3)', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)' }}>
                <h4 style={{ color: '#00f3ff', margin: '0 0 10px', textShadow: '0 0 8px #00f3ff', fontSize: '15px' }}>✓ NOT Gates</h4>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Lifetime Deployed: <span style={{color: '#fff'}}>{cumulativeStats.gateDetails.NOT.placed}</span></div>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Lifetime Evaluated: <span style={{color: '#fff'}}>{cumulativeStats.gateDetails.NOT.processed} Packets</span></div>
                <div style={{color: '#00f3ff', marginBottom: '10px'}}>Lifetime Bits Inverted: <span style={{fontWeight: 'bold'}}>{cumulativeStats.gateDetails.NOT.flipped}</span></div>
                <div style={{ borderTop: '1px solid rgba(0, 243, 255, 0.2)', paddingTop: '8px' }}>
                  {Object.entries(cumulativeStats.gateDetails.NOT.transforms).map(([transform, count]) => (
                    <div key={transform} style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
                      {transform} <span style={{ color: '#fff' }}>(x{count as number})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* XOR */}
            {cumulativeStats.gateDetails.XOR.placed > 0 && (
              <div style={{ border: '1px solid rgba(255,0,60,0.3)', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)' }}>
                <h4 style={{ color: '#ff003c', margin: '0 0 10px', textShadow: '0 0 8px #ff003c', fontSize: '15px' }}>✓ XOR Gates</h4>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Lifetime Deployed: <span style={{color: '#fff'}}>{cumulativeStats.gateDetails.XOR.placed}</span></div>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Lifetime Evaluated: <span style={{color: '#fff'}}>{cumulativeStats.gateDetails.XOR.processed} Packets</span></div>
                <div style={{color: '#ff003c', marginBottom: '10px'}}>Lifetime Bits Mutated: <span style={{fontWeight: 'bold'}}>{cumulativeStats.gateDetails.XOR.flipped}</span></div>
                <div style={{ borderTop: '1px solid rgba(255, 0, 60, 0.2)', paddingTop: '8px' }}>
                  {Object.entries(cumulativeStats.gateDetails.XOR.transforms).map(([transform, count]) => (
                    <div key={transform} style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
                      {transform} <span style={{ color: '#fff' }}>(x{count as number})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {cumulativeStats?.gatesPlaced === 0 && (
         <div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '20px' }}>No logic gates deployed across entire run.</div>
      )}

      <div style={{ marginTop: '36px' }}>
        <button 
           onClick={() => window.location.reload()}
           style={{
             background: 'rgba(255, 0, 60, 0.1)',
             border: '1px solid #ff003c',
             color: '#ff003c',
             padding: '16px 32px',
             fontSize: '18px',
             fontFamily: 'Orbitron, sans-serif',
             cursor: 'pointer',
             textTransform: 'uppercase',
             letterSpacing: '2px',
             boxShadow: '0 0 15px rgba(255, 0, 60, 0.3)',
             borderRadius: '4px',
             transition: 'all 0.2s ease-in-out'
           }}
           onMouseOver={(e) => {
             e.currentTarget.style.background = 'rgba(255, 0, 60, 0.3)';
             e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 0, 60, 0.6)';
           }}
           onMouseOut={(e) => {
             e.currentTarget.style.background = 'rgba(255, 0, 60, 0.1)';
             e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 60, 0.3)';
           }}
        >
          Reboot System
        </button>
      </div>
    </div>
  );
};
