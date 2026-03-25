import type { Enemy, Gate, Position, GateType, Bit, LogicEvent } from './Entities';
import { LogicEngine } from './LogicEngine';

export interface VisualEffect {
  id: string;
  type: 'pulse' | 'flash' | 'zap';
  position: Position;
  color?: string;
  life: number; // 0 to 1
  maxLife: number; // in ms
}

export class GameEngine {
  public voltage: number = 20;
  public clockCycles: number = 100;
  public wave: number = 1;
  public score: number = 0;
  public isGameOver: boolean = false;
  public cumulativeStats = {
    packetsDestroyed: 0,
    cyclesEarned: 0,
    voltageLost: 0,
    gatesPlaced: 0,
    gateDetails: {
      AND: { placed: 0, processed: 0, nullified: 0, transforms: {} as Record<string, number> },
      OR:  { placed: 0, processed: 0, shieldsBroken: 0, transforms: {} as Record<string, number> },
      NOT: { placed: 0, processed: 0, flipped: 0, transforms: {} as Record<string, number> },
      XOR: { placed: 0, processed: 0, flipped: 0, transforms: {} as Record<string, number> }
    }
  };

  public lastWaveStats = {
    packetsDestroyed: 0,
    cyclesEarned: 0,
    voltageLost: 0,
    gatesPlaced: 0,
    gateDetails: {
      AND: { placed: 0, processed: 0, nullified: 0, transforms: {} as Record<string, number> },
      OR:  { placed: 0, processed: 0, shieldsBroken: 0, transforms: {} as Record<string, number> },
      NOT: { placed: 0, processed: 0, flipped: 0, transforms: {} as Record<string, number> },
      XOR: { placed: 0, processed: 0, flipped: 0, transforms: {} as Record<string, number> }
    }
  };

  private currentWaveStats = {
    packetsDestroyed: 0,
    cyclesEarned: 0,
    voltageLost: 0,
    gatesPlaced: 0,
    gateDetails: {
      AND: { placed: 0, processed: 0, nullified: 0, transforms: {} as Record<string, number> },
      OR:  { placed: 0, processed: 0, shieldsBroken: 0, transforms: {} as Record<string, number> },
      NOT: { placed: 0, processed: 0, flipped: 0, transforms: {} as Record<string, number> },
      XOR: { placed: 0, processed: 0, flipped: 0, transforms: {} as Record<string, number> }
    }
  };
  
  public enemies: Enemy[] = [];
  public gates: Gate[] = [];
  public effects: VisualEffect[] = [];
  
  // Grid settings
  public gridSize = 40;
  public canvasWidth = 800; // Updated on resize
  public canvasHeight = 600; // Updated on resize

  public path: Position[] = [];
  public events: LogicEvent[] = [];

  public isPlanningPhase: boolean = false;

  // Callbacks for UI updates
  public onStateUpdate?: (voltage: number, clockCycles: number, wave: number, score: number, isGameOver: boolean, events: LogicEvent[], isPlanningPhase: boolean, lastWaveStats: any, cumulativeStats: any) => void;
  public onPlaySound?: (type: 'click' | 'zap') => void;

  private animationFrameId: number = 0;
  private lastTime: number = 0;
  
  // Wave Spawning
  private spawnTimer: number = 0;
  private spawnCount: number = 0;
  private maxSpawn: number = 5; // Rebalanced starting difficulty down
  private spawnBag: [Bit, Bit][] = [];
  
  private getNextSpawnState(): [Bit, Bit] {
     if (this.spawnBag.length === 0) {
        this.spawnBag = [[0, 1], [1, 0], [1, 1]];
        for (let i = this.spawnBag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.spawnBag[i], this.spawnBag[j]] = [this.spawnBag[j], this.spawnBag[i]];
        }
     }
     return this.spawnBag.pop() as [Bit, Bit];
  }
  
  constructor() {
    this.initPath();
  }

  public initPath() {
    // Generate a snaking path for the PCB to maximize space
    // We'll calculate real coordinate percentages based on canvas width/height during render
    this.path = [
      { x: 0.0, y: 0.15 }, // Spawn (Top Left)
      { x: 0.8, y: 0.15 }, // Across almost to the right
      { x: 0.8, y: 0.45 }, // Down
      { x: 0.2, y: 0.45 }, // Back across to the left
      { x: 0.2, y: 0.75 }, // Down
      { x: 0.85, y: 0.75 },// Across to the right again
      { x: 0.85, y: 0.90 } // Final stretch down to Core
    ];
  }

  public start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    cancelAnimationFrame(this.animationFrameId);
  }

  private loop = (currentTime: number) => {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(deltaTime: number) {
    if (this.isGameOver) return;
    this.spawnLogic(deltaTime);
    this.updateEnemies(deltaTime);
    this.updateEffects(deltaTime);
  }

  private updateEffects(deltaTime: number) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      effect.life += deltaTime / effect.maxLife;
      if (effect.life >= 1) {
        this.effects.splice(i, 1);
      }
    }
  }

  private spawnLogic(deltaTime: number) {
    if (this.spawnCount >= this.maxSpawn) {
      // Wave over logic
      if (this.enemies.filter(e => e.active).length === 0) {
        // Start next wave after delay
        this.wave++;
        this.spawnCount = 0;
        this.maxSpawn += 3; // Gradual increment per level
        this.isPlanningPhase = true;
        
        // Refund gates to avoid soft-locking the player
        this.gates.forEach(gate => {
          if (gate.type === 'AND') this.clockCycles += 25;
          if (gate.type === 'OR') this.clockCycles += 30;
          if (gate.type === 'NOT') this.clockCycles += 20;
          if (gate.type === 'XOR') this.clockCycles += 60;
        });
        
        // Set Historical Stats
        this.lastWaveStats = JSON.parse(JSON.stringify(this.currentWaveStats));
        this.currentWaveStats = {
          packetsDestroyed: 0,
          cyclesEarned: 0,
          voltageLost: 0,
          gatesPlaced: 0,
          gateDetails: {
            AND: { placed: 0, processed: 0, nullified: 0, transforms: {} as Record<string, number> },
            OR:  { placed: 0, processed: 0, shieldsBroken: 0, transforms: {} as Record<string, number> },
            NOT: { placed: 0, processed: 0, flipped: 0, transforms: {} as Record<string, number> },
            XOR: { placed: 0, processed: 0, flipped: 0, transforms: {} as Record<string, number> }
          }
        };

        this.gates = []; // Clear the board
        this.notifyUI();
      }
      return;
    }

    if (this.isPlanningPhase) {
      return; 
    }

    this.spawnTimer += deltaTime;
    
    if (this.spawnTimer > 1000) { // Spawn every 1s
      this.spawnTimer = 0;
      this.spawnCount++;
      
      const isShielded = this.wave >= 2 && Math.random() > 0.7;
      
      // Ensure perfectly uniform randomization among dangerous states using 3-Bag Randomizer
      const randomState = this.getNextSpawnState();
      const s0 = randomState[0];
      const s1 = randomState[1];
      
      // Speed scales linearly with wave level
      let baseSpeed = 0.03 + (this.wave * 0.008);
      
      this.enemies.push({
        id: Math.random().toString(36).substring(7),
        type: isShielded ? 'shielded' : 'glitch',
        state: [s0, s1],
        position: { 
          x: this.path[0].x * this.canvasWidth, 
          y: this.path[0].y * this.canvasHeight 
        },
        progress: 0,
        speed: isShielded ? baseSpeed * 0.6 : baseSpeed, // Percent of path per second roughly
        active: true
      });
    }
  }

  private getPositionAlongPath(progress: number): Position {
    // Basic linear interpolation along path segments
    const totalSegments = this.path.length - 1;
    if (progress >= 1) return { ...this.path[this.path.length-1] };
    
    const scaledProgress = progress * totalSegments;
    const segmentIndex = Math.floor(scaledProgress);
    const segmentProgress = scaledProgress - segmentIndex;
    
    const p1 = this.path[segmentIndex];
    const p2 = this.path[segmentIndex + 1];
    
    return {
      x: p1.x + (p2.x - p1.x) * segmentProgress,
      y: p1.y + (p2.y - p1.y) * segmentProgress
    };
  }

  private updateEnemies(deltaTime: number) {
    const timeScale = deltaTime / 1000;

    for (const enemy of this.enemies) {
      if (!enemy.active) continue;

      // Move enemy
      enemy.progress += enemy.speed * timeScale;
      
      const pathPos = this.getPositionAlongPath(enemy.progress);
      enemy.position = {
        x: pathPos.x * this.canvasWidth,
        y: pathPos.y * this.canvasHeight
      };

      // Check collision with gates
      this.checkGateCollisions(enemy);

      // Check core reached
      if (enemy.progress >= 1) {
        enemy.active = false;
        if (enemy.state[0] === 1 || enemy.state[1] === 1) {
          // Damage
          this.voltage -= 1;
          this.currentWaveStats.voltageLost += 1;
          this.cumulativeStats.voltageLost += 1;
          
          if (this.voltage <= 0) {
            this.voltage = 0;
            this.isGameOver = true;
          }
          this.notifyUI();
          this.effects.push({
             id: Math.random().toString(),
             type: 'zap',
             position: { ...enemy.position },
             color: 'var(--neon-red)',
             life: 0,
             maxLife: 600
          });
          this.effects.push({
             id: Math.random().toString(),
             type: 'pulse',
             position: { ...enemy.position },
             color: 'var(--neon-red)',
             life: 0,
             maxLife: 800
          });
        }
      }
    }
  }

  private checkGateCollisions(enemy: Enemy) {
    // Simplified collision detection based on grid proximity
    for (const gate of this.gates) {
      const dx = enemy.position.x - gate.position.x;
      const dy = enemy.position.y - gate.position.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // If enemy is passing through the gate
      if (dist < 30) { 
        // We need a mechanism to only process once per gate. For MVP, we can add a 'processedTowers' array to Enemy.
        // I will add a hacky bypass for now by storing processed gates on the enemy object.
        const e = enemy as any;
        if (!e.processedGates) e.processedGates = new Set();
        
        if (!e.processedGates.has(gate.id)) {
          e.processedGates.add(gate.id);
          this.processEnemyThroughGate(enemy, gate);
        }
      }
    }
  }

  private processEnemyThroughGate(enemy: Enemy, gate: Gate) {
    // Record input state for HUD event log
    const inputState: [Bit, Bit] = [enemy.state[0], enemy.state[1]];

    // Evaluate logic
    switch(gate.type) {
      case 'AND': enemy.state = LogicEngine.evaluateAND(enemy.state); break;
      case 'OR': enemy.state = LogicEngine.evaluateOR(enemy.state); break;
      case 'NOT': enemy.state = LogicEngine.evaluateNOT(enemy.state); break;
      case 'XOR': enemy.state = LogicEngine.evaluateXOR(enemy.state); break;
    }

    const details = this.currentWaveStats.gateDetails[gate.type] as any;
    const globalDetails = this.cumulativeStats.gateDetails[gate.type] as any;
    
    details.processed++;
    globalDetails.processed++;

    if (gate.type === 'AND') {
       if ((inputState[0] === 1 || inputState[1] === 1) && enemy.state[0] === 0 && enemy.state[1] === 0) {
           details.nullified++;
           globalDetails.nullified++;
       }
    } else if (gate.type === 'OR') {
       if (enemy.type === 'shielded' && enemy.state[0] === 1 && enemy.state[1] === 1) {
           details.shieldsBroken++;
           globalDetails.shieldsBroken++;
       }
    } else {
       if (inputState[0] !== enemy.state[0] || inputState[1] !== enemy.state[1]) {
           details.flipped++;
           globalDetails.flipped++;
       }
    }

    const transformStr = `[${inputState[0]}, ${inputState[1]}] ➜ [${enemy.state[0]}, ${enemy.state[1]}]`;
    details.transforms[transformStr] = (details.transforms[transformStr] || 0) + 1;
    globalDetails.transforms[transformStr] = (globalDetails.transforms[transformStr] || 0) + 1;

    // Push event to HUD
    this.events.unshift({
      id: Math.random().toString(),
      input: inputState,
      operator: gate.type,
      output: [enemy.state[0], enemy.state[1]],
      timestamp: Date.now()
    });
    if (this.events.length > 6) this.events.pop();
    this.notifyUI();

    // Shield breaking logic
    if (enemy.type === 'shielded') {
       // Only breaking shield if state becomes 1
       if (enemy.state[0] === 1 && enemy.state[1] === 1) {
         enemy.type = 'glitch'; // Shield falls off
       }
    } else {
       // Glitch destruction logic
       if (enemy.state[0] === 0 && enemy.state[1] === 0) {
           // Successfully processed to 0
           enemy.active = false;
           this.clockCycles += 10;
           this.score += 50 * this.wave;
           this.currentWaveStats.packetsDestroyed += 1;
           this.currentWaveStats.cyclesEarned += 10;
           this.cumulativeStats.packetsDestroyed += 1;
           this.cumulativeStats.cyclesEarned += 10;
           this.notifyUI();
           this.effects.push({
             id: Math.random().toString(),
             type: 'zap',
             position: enemy.position,
             life: 0,
             maxLife: 500
           });
       }
    }

    this.effects.push({
      id: Math.random().toString(),
      type: 'flash',
      position: gate.position,
      color: (enemy.state[0] === 1 || enemy.state[1] === 1) ? 'var(--neon-red)' : 'var(--neon-blue)',
      life: 0,
      maxLife: 300
    });
  }

  private notifyUI() {
    if (this.onStateUpdate) {
      this.onStateUpdate(this.voltage, this.clockCycles, this.wave, this.score, this.isGameOver, this.events, this.isPlanningPhase, this.lastWaveStats, this.cumulativeStats);
    }
  }

  public startNextWave() {
    if (this.isPlanningPhase) {
      this.isPlanningPhase = false;
      this.spawnTimer = 0;
      this.notifyUI();
    }
  }

  public placeGate(type: GateType, x: number, y: number) {
     // Snap to grid
     const gridX = Math.round(x / this.gridSize) * this.gridSize;
     const gridY = Math.round(y / this.gridSize) * this.gridSize;
     
     // Deduct cost
     const costs = { 'AND': 25, 'OR': 30, 'NOT': 20, 'XOR': 60 };
     if (this.clockCycles >= costs[type]) {
        this.clockCycles -= costs[type];
        this.currentWaveStats.gatesPlaced += 1;
        this.currentWaveStats.gateDetails[type].placed += 1;
        this.cumulativeStats.gatesPlaced += 1;
        this.cumulativeStats.gateDetails[type].placed += 1;
        this.gates.push({
           id: Math.random().toString(),
           type,
           position: { x: gridX, y: gridY },
           gridX,
           gridY
        });
        this.notifyUI();
        this.effects.push({
          id: Math.random().toString(),
          type: 'pulse',
          position: { x: gridX, y: gridY },
          life: 0,
          maxLife: 400
        });
     }
  }
}
