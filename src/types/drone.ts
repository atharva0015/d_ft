export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface ThreatScore {
  st_total: number;
  ptype: number;
  pprox: number;
  ccost: number;
  weights?: [number, number, number];
}

export interface DroneData {
  id: string;
  position: Vector3;
  velocity: Vector3;
  health: number;
  ammo: number;
  fsmState: 'PATROL' | 'ASSESS_THREAT' | 'ENGAGE' | 'RTB';
  isActive: boolean;
  speed: number;
  sensorRange: number;
  engagementRange: number;
  target?: string;
}

export interface HostileDroneData extends DroneData {
  type: 'air-to-air' | 'ground-attack';
  threatScore?: ThreatScore;
  unattended: boolean;
  nearestAsset?: {
    id: string;
    distance: number;
  };
}
