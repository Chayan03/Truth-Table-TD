import React, { useRef, useEffect } from 'react';
import { useGameEngine } from '../engine/GameContext';
import type { GateType } from '../engine/Entities';

export const MainGameArea: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitImageRef = useRef<HTMLImageElement | null>(null);
  const { engine, isGameOver } = useGameEngine();

  useEffect(() => {
    const img = new Image();
    img.src = '/bit.png';
    img.onload = () => { bitImageRef.current = img; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let renderFrameId: number;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        engine.canvasWidth = canvas.width;
        engine.canvasHeight = canvas.height;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const renderLoop = () => {
      drawGame(ctx, canvas.width, canvas.height);
      renderFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(renderFrameId);
    };
  }, [engine]);

  const drawGame = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Grid Setup
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = engine.gridSize || 40;
    
    // Draw Grid Lines
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Draw Decorative Angles & Traces imitating the complex mockup
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    ctx.lineWidth = 2;
    const drawAngledTrace = (sx: number, sy: number, l: number, dir: 'H'|'V', a: 1|-1) => {
       ctx.beginPath();
       ctx.moveTo(sx, sy);
       if (dir === 'H') {
          ctx.lineTo(sx + l, sy);
          ctx.lineTo(sx + l + 20, sy + (20 * a));
          ctx.lineTo(sx + l + 100, sy + (20 * a));
       } else {
          ctx.lineTo(sx, sy + l);
          ctx.lineTo(sx + (20 * a), sy + l + 20);
          ctx.lineTo(sx + (20 * a), sy + l + 100);
       }
       ctx.stroke();
    };
    drawAngledTrace(100, 100, 250, 'H', 1);
    drawAngledTrace(width - 300, 150, -100, 'H', -1);
    drawAngledTrace(200, height - 200, 120, 'H', -1);
    drawAngledTrace(width - 200, height - 300, -150, 'V', 1);
    drawAngledTrace(parseInt((width/2).toString()), 200, 300, 'V', -1);

    // Decorative Silicon Chips
    const drawChip = (x: number, y: number, w: number, h: number) => {
       ctx.fillStyle = 'rgba(8, 20, 36, 0.8)';
       ctx.strokeStyle = '#1a3a5a';
       ctx.fillRect(x, y, w, h);
       ctx.strokeRect(x, y, w, h);
       ctx.fillStyle = '#1a3a5a';
       for(let px = x + 10; px < x + w - 10; px += 15) {
          ctx.fillRect(px, y - 4, 6, 4);
          ctx.fillRect(px, y + h, 6, 4);
       }
    };
    drawChip(120, height - 150, 80, 80);
    drawChip(width - 200, 80, 100, 60);
    drawChip(parseInt((width/2).toString()) - 100, parseInt((height/2).toString()) - 50, 140, 90);

    // ---- 2. PATH EVALUATION ----
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const path = engine.path;
    if (path.length > 0) {
      // Very thick black undertrace to force contrast separation
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.lineWidth = 24;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(path[0].x * width, path[0].y * height);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x * width, path[i].y * height);
      }
      ctx.stroke();

      // Blazing Neon Orange Glow Trace
      ctx.strokeStyle = 'rgba(255, 60, 0, 0.7)';
      ctx.lineWidth = 14;
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#ff3300';
      ctx.beginPath();
      ctx.moveTo(path[0].x * width, path[0].y * height);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x * width, path[i].y * height);
      }
      ctx.stroke();

      // Inner Solid White-Hot Tube
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(path[0].x * width, path[0].y * height);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x * width, path[i].y * height);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Draw Spawn Port
    if (path.length > 0) {
      ctx.fillStyle = '#0c121c';
      ctx.strokeStyle = '#ff3300';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(path[0].x * width, path[0].y * height, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(path[0].x * width, path[0].y * height, 12, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw CPU Core Socket
    ctx.fillStyle = 'rgba(20, 20, 30, 0.9)';
    ctx.strokeStyle = engine.isGameOver ? '#ff003c' : '#ff5500';
    ctx.lineWidth = 4;
    ctx.shadowColor = engine.isGameOver ? '#ff003c' : '#ff5500';
    ctx.shadowBlur = 30;

    if (path.length > 0) {
      const core = path[path.length - 1];
      const cx = core.x * width;
      const cy = core.y * height;

      ctx.fillRect(cx - 60, cy - 60, 120, 120);
      ctx.strokeRect(cx - 60, cy - 60, 120, 120);
      
      ctx.strokeStyle = '#ff9900';
      ctx.lineWidth = 3;
      ctx.strokeRect(cx - 45, cy - 45, 90, 90);

      ctx.fillStyle = '#ff9900';
      for(let i=0; i<7; i++) {
        ctx.fillRect(cx - 36 + i*12, cy - 68, 6, 10);
        ctx.fillRect(cx - 36 + i*12, cy + 58, 6, 10);
        ctx.fillRect(cx - 68, cy - 36 + i*12, 10, 6);
        ctx.fillRect(cx + 58, cy - 36 + i*12, 10, 6);
      }
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 24px Orbitron, sans-serif';
      ctx.fillText(engine.isGameOver ? 'FAIL' : 'CORE', cx, cy);
    }

    // ---- 3. ENTITIES (Gates & Enemies) ----
    const SVG_PATHS = {
      'AND': 'M 5 2 L 15 2 C 26 2 26 22 15 22 L 5 22 Z M 0 7 L 5 7 M 0 17 L 5 17 M 21 12 L 28 12',
      'OR': 'M 5 2 Q 12 12 5 22 Q 18 22 25 12 Q 18 2 5 2 Z M 0 7 L 8 7 M 0 17 L 8 17 M 25 12 L 32 12',
      'NOT': 'M 5 4 L 22 12 L 5 20 Z M 0 12 L 5 12 M 28 12 L 34 12 M 22 12 A 3 3 0 1 0 28 12 A 3 3 0 1 0 22 12',
      'XOR_1': 'M 2 2 Q 9 12 2 22',
      'XOR_2': 'M 7 2 Q 14 12 7 22 Q 20 22 27 12 Q 20 2 7 2 Z M 0 7 L 10 7 M 0 17 L 10 17 M 27 12 L 34 12'
    };

    engine.gates.forEach(gate => {
      let color = '#fff';
      if (gate.type === 'AND') color = '#00ff66';
      if (gate.type === 'OR') color = '#b026ff';
      if (gate.type === 'NOT') color = '#00f3ff';
      if (gate.type === 'XOR') color = '#ff003c';
      
      // Massive background gate footprint housing
      const sz = 60; 
      ctx.fillStyle = 'rgba(12, 18, 28, 0.95)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      
      ctx.beginPath();
      // Draw nicely rounded corners for the chip instead of purely sharp
      ctx.roundRect(gate.position.x - sz/2, gate.position.y - sz/2, sz, sz, 8);
      ctx.fill();
      ctx.stroke();
      
      // Render specific Logic Gate SVG shape precisely into the canvas!
      ctx.save();
      // Translate to the absolute center of the gate
      ctx.translate(gate.position.x, gate.position.y);
      // Scale it up significantly to match the big new housing
      const scale = 1.35;
      ctx.scale(scale, scale);
      // Translate negatively by the original SVG viewBox center (which is natively 40x24)
      ctx.translate(-20, -12);
      
      ctx.shadowBlur = 5;
      ctx.shadowColor = color;
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      
      if (gate.type === 'XOR') {
         const p1 = new Path2D(SVG_PATHS['XOR_1']);
         ctx.stroke(p1);
         const p2 = new Path2D(SVG_PATHS['XOR_2']);
         ctx.fill(p2);
         ctx.stroke(p2);
      } else {
         const pathStr = SVG_PATHS[gate.type as keyof typeof SVG_PATHS];
         if (pathStr) {
            const p = new Path2D(pathStr);
            ctx.fill(p);
            ctx.stroke(p);
         }
      }
      ctx.restore();
    });

    engine.enemies.forEach(enemy => {
      if (!enemy.active) return;
      
      const r = enemy.type === 'shielded' ? 36 : 28;
      const glowColor = enemy.type === 'shielded' ? '#b026ff' : '#00f3ff';
      
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 25;
      
      if (bitImageRef.current) {
        ctx.save();
        
        // Use a perfect circle clip to completely eliminate square AI bounds
        ctx.beginPath();
        ctx.arc(enemy.position.x, enemy.position.y, r, 0, Math.PI * 2);
        ctx.clip();

        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(bitImageRef.current, enemy.position.x - r, enemy.position.y - r, r * 2, r * 2);
        ctx.globalCompositeOperation = 'source-over';
        
        ctx.restore();

        // Add a colored tint overlay to diff shielded and normal
        if (enemy.type === 'shielded') {
          ctx.beginPath();
          ctx.arc(enemy.position.x, enemy.position.y, r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(176, 38, 255, 0.4)';
          ctx.fill();
        }
      } else {
        // Fallback
        ctx.beginPath();
        ctx.arc(enemy.position.x, enemy.position.y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 243, 255, 0.2)';
        ctx.fill();
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw dynamic crisp data text with a heavy black outline for absolute contrast!
      const text = `${enemy.state[0]}${enemy.state[1]}`;
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.strokeText(text, enemy.position.x, enemy.position.y);

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = glowColor;
      ctx.fillText(text, enemy.position.x, enemy.position.y);
      ctx.shadowBlur = 0;
    });

    // Draw Effects
    engine.effects.forEach(effect => {
      const alpha = 1 - effect.life; // Fade out
      if (alpha <= 0) return;

      ctx.save();
      ctx.globalAlpha = alpha;

      if (effect.type === 'pulse') {
        ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(effect.position.x, effect.position.y, 20 + (effect.life * 20), 0, Math.PI * 2);
        ctx.stroke();
      } else if (effect.type === 'flash') {
        const color = effect.color || '#fff';
        ctx.fillStyle = color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(effect.position.x, effect.position.y, 15, 0, Math.PI * 2);
        ctx.fill();
      } else if (effect.type === 'zap') {
        // Starburst zap
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 / 8) * i;
          const r1 = 5 + effect.life * 10;
          const r2 = 15 + effect.life * 20;
          ctx.moveTo(effect.position.x + Math.cos(angle) * r1, effect.position.y + Math.sin(angle) * r1);
          ctx.lineTo(effect.position.x + Math.cos(angle) * r2, effect.position.y + Math.sin(angle) * r2);
        }
        ctx.stroke();
      }

      ctx.restore();
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Check global selected logic gate
    const selectedGate = (window as any).selectedGateToPlace as GateType;
    if (!selectedGate) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    engine.placeGate(selectedGate, x, y);
    
    // Deselect after placing
    (window as any).selectedGateToPlace = null;
    // Dispatch custom event to let sidebar update its state (since we cheated with window)
    window.dispatchEvent(new Event('gatePlaced'));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas 
        ref={canvasRef} 
        onClick={handleCanvasClick}
        className="game-canvas"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: (window as any).selectedGateToPlace && !isGameOver ? 'crosshair' : 'default'
        }}
      />
      {isGameOver && (
        <div className="flex-col flex-center glass-pane" style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(10, 10, 15, 0.9)', zIndex: 10
        }}>
          <h1 className="glow-text-red" style={{ fontSize: '48px', marginBottom: '20px' }}>SYSTEM FAILURE</h1>
          <h3 className="glow-text-blue">NO VOLTAGE REMAINING</h3>
          <button 
            className="glass-pane glow-text-blue" 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '40px', padding: '15px 30px', cursor: 'pointer', 
              fontSize: '20px', border: '1px solid var(--neon-blue)', 
              background: 'rgba(0, 243, 255, 0.1)', borderRadius: '8px'
            }}
          >
            REBOOT SYSTEM
          </button>
        </div>
      )}
    </div>
  );
};
