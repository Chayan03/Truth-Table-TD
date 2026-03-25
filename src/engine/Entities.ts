export type Bit = 0 | 1;
export type LogicState = [Bit, Bit];

export interface Position {
  x: number;
  y: number;
}

export type EnemyType = 'glitch' | 'shielded';

export interface Enemy {
  id: string;
  type: EnemyType;
  state: LogicState;
  position: Position;
  progress: number; // 0 to 1 along the path
  speed: number;
  active: boolean; // if false, remove from array
}

export type GateType = 'AND' | 'OR' | 'NOT' | 'XOR';

export interface Gate {
  id: string;
  type: GateType;
  position: Position; // Cell grid coordinates
  gridX: number;
  gridY: number;
}

export interface LogicEvent {
  id: string;
  input: LogicState;
  operator: GateType;
  output: LogicState;
  timestamp: number;
}
