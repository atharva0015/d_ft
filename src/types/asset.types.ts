import { Vector3 } from 'three';

export interface Asset {
  id: string;
  name: string;
  position: Vector3;
  health: number;
  maxHealth: number;
  threatRadius: number; // Protection radius
  isChaseMode: boolean;
  targetPosition?: Vector3;
  isPinned: boolean;
}

export interface AssetThreat {
  assetId: string;
  threateningDrones: string[];
  highestThreat: number;
  isUnderThreat: boolean;
}
