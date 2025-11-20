import { Drone } from './drone.types';
import { Asset } from './asset.types';

export interface WSMessage {
  type: string;
  payload: any;
  timestamp: number;
}

// Backend → Frontend messages
export interface DronePositionUpdate {
  type: 'drone:position';
  payload: {
    droneId: string;
    position: [number, number, number];
    velocity: [number, number, number];
  };
}

export interface ThreatCalculated {
  type: 'threat:calculated';
  payload: {
    droneId: string;
    ST: number;
    Ptype: number;
    Pprox: number;
    Ccost: number;
    targetAssetId: string;
  };
}

export interface FSMTransition {
  type: 'fsm:transition';
  payload: {
    droneId: string;
    oldState: string;
    newState: string;
    reason: string;
  };
}

export interface EngagementEvent {
  type: 'engagement:start' | 'engagement:end';
  payload: {
    attackerId: string;
    targetId: string;
    damage?: number;
  };
}

export interface SimulationState {
  type: 'simulation:state';
  payload: {
    drones: Drone[];
    assets: Asset[];
    metrics: any;
  };
}

// Frontend → Backend messages
export interface DroneSpawnCommand {
  type: 'command:spawn';
  payload: {
    droneType: string;
    position: [number, number, number];
    specs?: any;
  };
}

export interface DroneUpdateCommand {
  type: 'command:update';
  payload: {
    droneId: string;
    updates: Partial<Drone>;
  };
}

export interface SimulationControlCommand {
  type: 'command:control';
  payload: {
    action: 'start' | 'pause' | 'reset' | 'speed';
    value?: number;
  };
}
