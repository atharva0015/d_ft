export interface SimulationConfig {
  weights: {
    w1: number; // Type priority weight
    w2: number; // Proximity priority weight
    w3: number; // Cost weight
  };
  speed: number; // Simulation speed multiplier (0.5x - 4x)
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
}

export interface SimulationMetrics {
  friendlyCount: number;
  hostileAirCount: number;
  hostileGroundCount: number;
  assetsProtected: number;
  totalAssets: number;
  activeEngagements: number;
  avgFriendlyHealth: number;
  avgFriendlyAmmo: number;
  totalKills: number;
  totalLosses: number;
}

export interface PerformanceMetrics {
  fps: number;
  decisionFrequency: number; // Hz
  stCalculationTime: number; // ms
  websocketLatency: number; // ms
  activeDrones: number;
}

export interface GameEvent {
  id: string;
  timestamp: number;
  type: 'spawn' | 'destroy' | 'engage' | 'rtb' | 'state_change' | 'asset_damage';
  severity: 'info' | 'warning' | 'error' | 'success';
  droneId?: string;
  message: string;
  data?: any;
}
