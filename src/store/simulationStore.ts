import { create } from 'zustand';
import { DroneData, HostileDroneData } from '../types/drone';
import { AssetData, EventLog } from '../types/simulation';

export interface SimulationState {
  // Drone data
  friendlyDrones: DroneData[];
  hostileDrones: HostileDroneData[];
  assets: AssetData[];

  // Simulation state
  isPlaying: boolean;
  currentTime: number;
  totalTime: number;
  speed: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  scenarioName: string;

  // UI state
  selectedDroneId: string | null;
  isDragging: boolean;
  draggedDroneId: string | null;

  // Metrics
  metricsHistory: any[];
  eventLogs: EventLog[];

  // Actions
  addFriendlyDrone: (drone: Partial<DroneData>) => void;
  addHostileDrone: (drone: Partial<HostileDroneData>) => void;
  updateFriendlyDrone: (drone: DroneData) => void;
  updateHostileDrone: (drone: HostileDroneData) => void;
  addAsset: (asset: Partial<AssetData>) => void;
  updateAsset: (id: string, asset: Partial<AssetData>) => void;
  addEventLog: (log: EventLog) => void;
  setIsDragging: (isDragging: boolean) => void;
  setSelectedDrone: (id: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSpeed: (speed: number) => void;
  setCurrentTime: (time: number) => void;
  setDifficulty: (difficulty: 'easy' | 'normal' | 'hard' | 'expert') => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  friendlyDrones: [],
  hostileDrones: [],
  assets: [],
  isPlaying: false,
  currentTime: 0,
  totalTime: 300,
  speed: 1,
  difficulty: 'normal',
  scenarioName: 'AlchiFly Defense Mission',
  selectedDroneId: null,
  isDragging: false,
  draggedDroneId: null,
  metricsHistory: [],
  eventLogs: [],

  addFriendlyDrone: (drone: Partial<DroneData>) => set((state) => ({
    friendlyDrones: [...state.friendlyDrones, {
      id: `F-${state.friendlyDrones.length + 1}`,
      isActive: true,
      health: 100,
      ammo: 10,
      fsmState: 'PATROL',
      speed: 10,
      sensorRange: 100,
      engagementRange: 50,
      ...drone
    } as DroneData]
  })),

  addHostileDrone: (drone: Partial<HostileDroneData>) => set((state) => ({
    hostileDrones: [...state.hostileDrones, {
      id: `H-${state.hostileDrones.length + 1}`,
      isActive: true,
      health: 80,
      threatScore: { st_total: 0, ptype: 0, pprox: 0, ccost: 0 },
      unattended: true,
      ...drone
    } as HostileDroneData]
  })),

  updateFriendlyDrone: (drone: DroneData) => set((state) => ({
    friendlyDrones: state.friendlyDrones.map(d => d.id === drone.id ? drone : d)
  })),

  updateHostileDrone: (drone: HostileDroneData) => set((state) => ({
    hostileDrones: state.hostileDrones.map(d => d.id === drone.id ? drone : d)
  })),

  addAsset: (asset: Partial<AssetData>) => set((state) => ({
    assets: [...state.assets, {
      id: `ASSET-${state.assets.length + 1}`,
      isMoving: false,
      isPinned: true,
      isThreatened: false,
      threatRange: 32,
      ...asset
    } as AssetData]
  })),

  updateAsset: (id: string, asset: Partial<AssetData>) => set((state) => ({
    assets: state.assets.map(a => a.id === id ? { ...a, ...asset } : a)
  })),

  addEventLog: (log: EventLog) => set((state) => ({
    eventLogs: [...state.eventLogs.slice(-99), log]
  })),

  setIsDragging: (isDragging: boolean) => set({ isDragging }),
  setSelectedDrone: (id: string | null) => set({ selectedDroneId: id }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setSpeed: (speed: number) => set({ speed }),
  setCurrentTime: (currentTime: number) => set({ currentTime }),
  setDifficulty: (difficulty: 'easy' | 'normal' | 'hard' | 'expert') => set({ difficulty })
}));
