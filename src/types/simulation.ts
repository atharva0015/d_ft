import { Vector3 } from './drone';

export interface AssetData {
  id: string;
  position: Vector3;
  health: number;
  name?: string;
  isMoving: boolean;
  isPinned: boolean;
  isThreatened: boolean;
  isUnderAttack?: boolean;
  threatRange: number;
  defendingDrones?: string[];
}

export interface EventLog {
  id: string;
  timestamp: number;
  type: 'engagement' | 'threat' | 'state_change' | 'asset_threatened' | 'neutralized' | 'spawn';
  droneId?: string;
  message: string;
}

export interface MetricsSnapshot {
  time: number;
  threatLevel: number;
  friendlyHealth: number;
  protection: number;
  engagements: number;
}
