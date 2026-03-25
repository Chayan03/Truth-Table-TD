import React from 'react';
import { useGameEngine } from '../engine/GameContext';

export const WaveSummaryPopup: React.FC = () => {
  const { isPlanningPhase, wave, startNextWave, lastWaveStats } = useGameEngine();

  // Show only during the planning delay after Wave 1
  if (!isPlanningPhase || wave <= 1) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(12, 18, 28, 0.95)',
      border: '1px solid rgba(0, 243, 255, 0.4)',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 0 60px rgba(0, 243, 255, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.8)',
      textAlign: 'center',
      color: '#fff',
      fontFamily: 'Orbitron, sans-serif',
      zIndex: 1000,
      pointerEvents: 'none', // Allow clicking through just in case
      width: '640px',
      backdropFilter: 'blur(10px)',
      animation: 'pulse-glow 2s infinite alternate'
    }}>
      <h1 style={{ color: '#00ff66', margin: '0 0 10px 0', textShadow: '0 0 15px #00ff66', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '32px' }}>
        Wave {wave - 1} Cleared!
      </h1>
      
      {/* Wave Performance Stats */}
      <div style={{ 
        background: 'rgba(0, 0, 0, 0.6)', 
        border: '1px solid rgba(0, 255, 102, 0.3)', 
        borderRadius: '8px', 
        padding: '24px', 
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        textAlign: 'left',
        boxShadow: 'inset 0 0 20px rgba(0, 255, 102, 0.05)'
      }}>
        <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
           <span style={{ color: '#ccc', letterSpacing: '1px' }}>Packets Nullified:</span>
           <span style={{ color: '#fff', fontWeight: 'bold' }}>{lastWaveStats?.packetsDestroyed || 0}</span>
        </div>
        <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
           <span style={{ color: '#ccc', letterSpacing: '1px' }}>Cycles Harvested:</span>
           <span style={{ color: '#00ff66', fontWeight: 'bold', textShadow: '0 0 5px #00ff66' }}>+{lastWaveStats?.cyclesEarned || 0}</span>
        </div>
        <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between' }}>
           <span style={{ color: '#ccc', letterSpacing: '1px' }}>Gates Deployed:</span>
           <span style={{ color: '#b026ff', fontWeight: 'bold', textShadow: '0 0 5px #b026ff' }}>{lastWaveStats?.gatesPlaced || 0}</span>
        </div>
        <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between' }}>
           <span style={{ color: '#ccc', letterSpacing: '1px' }}>Core Integrity:</span>
           <span style={{ 
             color: (lastWaveStats?.voltageLost || 0) > 0 ? '#ff003c' : '#00f3ff', 
             fontWeight: 'bold', 
             textShadow: (lastWaveStats?.voltageLost || 0) > 0 ? '0 0 5px #ff003c' : '0 0 5px #00f3ff'
           }}>
             {(lastWaveStats?.voltageLost || 0) > 0 ? `-${lastWaveStats.voltageLost} Volts` : '100% Perfect'}
           </span>
        </div>
      </div>

      <p style={{ color: '#aaa', marginBottom: '24px', fontFamily: 'monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Hardware configuration resetting. Initializing next payload sequence...
      </p>

      {/* Dynamic Gate Performance Reports */}
      {lastWaveStats?.gatesPlaced > 0 && (
        <>
          <p style={{ color: '#00f3ff', marginBottom: '16px', fontFamily: 'monospace', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'left', borderBottom: '1px solid rgba(0, 243, 255, 0.2)', paddingBottom: '8px' }}>
            Gate Diagnostics
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            fontFamily: 'monospace',
            fontSize: '13px',
            textAlign: 'left'
          }}>
            {/* AND */}
            {lastWaveStats.gateDetails.AND.placed > 0 && (
              <div style={{ border: '1px solid rgba(0,255,102,0.3)', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)' }}>
                <h4 style={{ color: '#00ff66', margin: '0 0 10px', textShadow: '0 0 8px #00ff66', fontSize: '15px' }}>✓ AND Gates</h4>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Deployed: <span style={{color: '#fff'}}>{lastWaveStats.gateDetails.AND.placed}</span></div>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Evaluated: <span style={{color: '#fff'}}>{lastWaveStats.gateDetails.AND.processed} Packets</span></div>
                <div style={{color: '#00ff66', marginBottom: '10px'}}>Nullified: <span style={{fontWeight: 'bold'}}>{lastWaveStats.gateDetails.AND.nullified} Threats</span></div>
                <div style={{ borderTop: '1px solid rgba(0, 255, 102, 0.2)', paddingTop: '8px' }}>
                  {Object.entries(lastWaveStats.gateDetails.AND.transforms).map(([transform, count]) => (
                    <div key={transform} style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
                      {transform} <span style={{ color: '#fff' }}>(x{count as number})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* OR */}
            {lastWaveStats.gateDetails.OR.placed > 0 && (
              <div style={{ border: '1px solid rgba(176,38,255,0.3)', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)' }}>
                <h4 style={{ color: '#b026ff', margin: '0 0 10px', textShadow: '0 0 8px #b026ff', fontSize: '15px' }}>✓ OR Gates</h4>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Deployed: <span style={{color: '#fff'}}>{lastWaveStats.gateDetails.OR.placed}</span></div>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Evaluated: <span style={{color: '#fff'}}>{lastWaveStats.gateDetails.OR.processed} Packets</span></div>
                <div style={{color: '#b026ff', marginBottom: '10px'}}>Shields Broken: <span style={{fontWeight: 'bold'}}>{lastWaveStats.gateDetails.OR.shieldsBroken}</span></div>
                <div style={{ borderTop: '1px solid rgba(176, 38, 255, 0.2)', paddingTop: '8px' }}>
                  {Object.entries(lastWaveStats.gateDetails.OR.transforms).map(([transform, count]) => (
                    <div key={transform} style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
                      {transform} <span style={{ color: '#fff' }}>(x{count as number})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* NOT */}
            {lastWaveStats.gateDetails.NOT.placed > 0 && (
              <div style={{ border: '1px solid rgba(0,243,255,0.3)', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)' }}>
                <h4 style={{ color: '#00f3ff', margin: '0 0 10px', textShadow: '0 0 8px #00f3ff', fontSize: '15px' }}>✓ NOT Gates</h4>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Deployed: <span style={{color: '#fff'}}>{lastWaveStats.gateDetails.NOT.placed}</span></div>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Evaluated: <span style={{color: '#fff'}}>{lastWaveStats.gateDetails.NOT.processed} Packets</span></div>
                <div style={{color: '#00f3ff', marginBottom: '10px'}}>Bits Inverted: <span style={{fontWeight: 'bold'}}>{lastWaveStats.gateDetails.NOT.flipped}</span></div>
                <div style={{ borderTop: '1px solid rgba(0, 243, 255, 0.2)', paddingTop: '8px' }}>
                  {Object.entries(lastWaveStats.gateDetails.NOT.transforms).map(([transform, count]) => (
                    <div key={transform} style={{ color: '#aaa', fontSize: '11px', marginTop: '4px' }}>
                      {transform} <span style={{ color: '#fff' }}>(x{count as number})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* XOR */}
            {lastWaveStats.gateDetails.XOR.placed > 0 && (
              <div style={{ border: '1px solid rgba(255,0,60,0.3)', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)' }}>
                <h4 style={{ color: '#ff003c', margin: '0 0 10px', textShadow: '0 0 8px #ff003c', fontSize: '15px' }}>✓ XOR Gates</h4>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Deployed: <span style={{color: '#fff'}}>{lastWaveStats.gateDetails.XOR.placed}</span></div>
                <div style={{color: '#aaa', marginBottom: '4px'}}>Evaluated: <span style={{color: '#fff'}}>{lastWaveStats.gateDetails.XOR.processed} Packets</span></div>
                <div style={{color: '#ff003c', marginBottom: '10px'}}>Bits Mutated: <span style={{fontWeight: 'bold'}}>{lastWaveStats.gateDetails.XOR.flipped}</span></div>
                <div style={{ borderTop: '1px solid rgba(255, 0, 60, 0.2)', paddingTop: '8px' }}>
                  {Object.entries(lastWaveStats.gateDetails.XOR.transforms).map(([transform, count]) => (
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

      {lastWaveStats?.gatesPlaced === 0 && (
         <div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '20px' }}>No logic gates deployed this payload.</div>
      )}

      <div style={{ marginTop: '32px', pointerEvents: 'auto' }}>
        <button 
           onClick={startNextWave}
           style={{
             background: 'rgba(0, 243, 255, 0.15)',
             border: '2px solid #00f3ff',
             color: '#00f3ff',
             padding: '14px 32px',
             borderRadius: '6px',
             fontSize: '18px',
             fontFamily: 'Orbitron, sans-serif',
             cursor: 'pointer',
             letterSpacing: '2px',
             fontWeight: 'bold',
             boxShadow: '0 0 15px rgba(0,243,255,0.3)',
             transition: 'all 0.2s ease',
             textShadow: '0 0 8px #00f3ff'
           }}
           onMouseOver={(e) => { e.currentTarget.style.background = '#00f3ff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = '0 0 25px rgba(0,243,255,0.6)'; }}
           onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 243, 255, 0.15)'; e.currentTarget.style.color = '#00f3ff'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0,243,255,0.3)'; }}
        >
          INITIALIZE NEXT WAVE
        </button>
      </div>
    </div>
  );
};
