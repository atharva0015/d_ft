import { Vector3 } from 'three';

export type DroneType = 'friendly' | 'hostile-air' | 'hostile-ground';
export type FSMState = 'PATROL' | 'ASSESS_THREAT' | 'ENGAGE' | 'RTB';

export interface Drone {
  id: string;
  type: DroneType;
  position: Vector3;
  velocity: Vector3;
  health: number;
  maxHealth: number;
  ammo: number;
  maxAmmo: number;
  speed: number;
  sensorRange: number;
  engagementRange: number;
  fsmState: FSMState;
  targetId?: string;
  threatScore?: number;
  lastStateChange?: number;
}

export interface DroneSpecs {
  health: number;
  maxHealth: number;
  ammo: number;
  maxAmmo: number;
  speed: number;
  sensorRange: number;
  engagementRange: number;
}

export interface ThreatScore {
  ST: number;
  Ptype: number;
  Pprox: number;
  Ccost: number;
  breakdown: {
    typeContribution: number;
    proximityContribution: number;
    costContribution: number;
  };
  targetAssetId: string;
  distance: number;
}
