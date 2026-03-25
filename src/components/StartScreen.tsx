import React from 'react';
import { useGameEngine } from '../engine/GameContext';

export const StartScreen: React.FC = () => {
  const { startGame, isGameStarted } = useGameEngine();

  if (isGameStarted) return null;

  return (
    <div className="glass-pane" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(10, 10, 15, 0.90)', zIndex: 9999,
      overflowY: 'auto', overflowX: 'hidden',
      border: 'none', borderRadius: 0, boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100%', padding: '20px', boxSizing: 'border-box' }}>
        {/* Top spacer for dynamic vertical centering */}
        <div style={{ flexGrow: 1 }}></div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '850px', width: '100%', marginTop: '20px' }}>
          <h1 className="glow-text-blue" style={{ fontSize: '38px', margin: '0 0 5px 0', letterSpacing: '2px', textAlign: 'center' }}>TRUTH TABLE TD</h1>
          <h3 style={{ color: '#8899aa', margin: '0 0 25px 0', letterSpacing: '3px', fontSize: '16px', textAlign: 'center' }}>SYSTEM INITIALIZATION</h3>
          
          <div style={{ 
            textAlign: 'left', 
            background: 'rgba(10, 15, 25, 0.85)', 
            padding: '25px 35px', 
            borderRadius: '16px',
            border: '2px solid rgba(0, 243, 255, 0.6)',
            boxShadow: '0 0 30px rgba(0, 243, 255, 0.15), 0 0 10px rgba(0, 243, 255, 0.3) inset',
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            backdropFilter: 'blur(10px)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div>
              <h4 className="glow-text-blue" style={{ fontSize: '20px', margin: '0 0 10px 0', letterSpacing: '2px', borderBottom: '1px solid rgba(0,243,255,0.3)', paddingBottom: '8px' }}>MISSION OVERVIEW</h4>
              <p style={{ color: '#e0f0ff', fontSize: '16px', lineHeight: '1.5', margin: 0 }}>
                <strong style={{ color: '#ff003c' }}>WARNING:</strong> Corrupted data packets (2-bit binary, e.g., <code style={{ color: '#00f3ff', background: 'rgba(0,243,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>10</code> or <code style={{ color: '#00f3ff', background: 'rgba(0,243,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>11</code>) are moving towards your CPU core.
                <br/><br/>
                <strong style={{ color: '#00f3ff' }}>YOUR GOAL:</strong> Place <strong>Logic Gates</strong> strategically on the grid to intercept and modify these packets as they path over them. You must transform every packet into a harmless <code style={{ color: '#00ff66', background: 'rgba(0,255,102,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>00</code> state before it reaches your core!
                <br/><br/>
                If a packet hits the core containing any 1s (like <code style={{ color: '#ff003c' }}>01</code> or <code style={{ color: '#ff003c' }}>10</code>), your <strong style={{color:'#ff003c', textShadow: '0 0 5px #ff003c'}}>Voltage drops</strong>. Reach 0 Voltage, and the system crashes. Fully neutralized <code style={{ color: '#00ff66', background: 'rgba(0,255,102,0.1)', padding: '1px 5px', borderRadius: '3px' }}>00</code> packets earn you <strong style={{color:'#00ff66', textShadow: '0 0 5px #00ff66'}}>Clock Cycles ($)</strong>, which you can use to deploy more complex security architecture.
              </p>
            </div>

            <div>
              <h4 className="glow-text-blue" style={{ fontSize: '20px', margin: '0 0 10px 0', letterSpacing: '2px', borderBottom: '1px solid rgba(0,243,255,0.3)', paddingBottom: '8px' }}>LOGIC GATE HANDBOOK</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #00ff66' }}>
                  <h5 style={{ color: '#00ff66', fontSize: '16px', margin: '0 0 8px 0', textShadow: '0 0 5px #00ff66' }}>AND GATE (Cost: $25)</h5>
                  <p style={{ color: '#aab', fontSize: '14px', margin: 0, lineHeight: '1.4' }}>Outputs <strong style={{color:'#fff'}}>[A, A AND B]</strong>. It compares both input bits. Useful for stripping high bits off alternating patterns. Only outputs a 1 on the right if <em>both</em> input bits were 1.</p>
                </div>
                
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #b026ff' }}>
                  <h5 style={{ color: '#b026ff', fontSize: '16px', margin: '0 0 8px 0', textShadow: '0 0 5px #b026ff' }}>OR GATE (Cost: $30)</h5>
                  <p style={{ color: '#aab', fontSize: '14px', margin: 0, lineHeight: '1.4' }}>Outputs <strong style={{color:'#fff'}}>[1, 1]</strong>. This is a heavy-duty overload gate that instantly maxes out the packet. Crucial for penetrating advanced <strong>Enemy Shields</strong> before further processing.</p>
                </div>
                
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #00f3ff' }}>
                  <h5 style={{ color: '#00f3ff', fontSize: '16px', margin: '0 0 8px 0', textShadow: '0 0 5px #00f3ff' }}>NOT GATE (Cost: $20)</h5>
                  <p style={{ color: '#aab', fontSize: '14px', margin: 0, lineHeight: '1.4' }}>Outputs <strong style={{color:'#fff'}}>[~A, B]</strong>. Inverts the left bit completely. A vital, cheap foundational gate used for flipping states and cascading into more complex setups.</p>
                </div>
                
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ff003c' }}>
                  <h5 style={{ color: '#ff003c', fontSize: '16px', margin: '0 0 8px 0', textShadow: '0 0 5px #ff003c' }}>XOR GATE (Cost: $60)</h5>
                  <p style={{ color: '#aab', fontSize: '14px', margin: 0, lineHeight: '1.4' }}>Outputs <strong style={{color:'#fff'}}>[A, A XOR B]</strong>. Exclusive OR. The ultimate tactical security gate—outputs 1 on the right <em>only</em> if the bits are different. Highly modular.</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="glass-pane glow-text-blue" 
            onClick={startGame}
            style={{ 
              padding: '18px 40px', cursor: 'pointer', 
              fontSize: '22px', fontWeight: 'bold', border: '2px solid var(--neon-blue)', 
              background: 'rgba(0, 243, 255, 0.1)', borderRadius: '8px',
              boxShadow: '0 0 20px rgba(0, 243, 255, 0.3) inset, 0 0 20px rgba(0, 243, 255, 0.3)',
              transition: 'all 0.2s', letterSpacing: '3px',
              marginBottom: '20px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(0, 243, 255, 0.25)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 243, 255, 0.5) inset, 0 0 35px rgba(0, 243, 255, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0, 243, 255, 0.1)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.3) inset, 0 0 20px rgba(0, 243, 255, 0.3)';
            }}
          >
            INITIALIZE SYSTEM
          </button>
        </div>
        
        {/* Bottom spacer for dynamic vertical centering */}
        <div style={{ flexGrow: 1 }}></div>
      </div>
    </div>
  );
};
