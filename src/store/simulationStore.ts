import { create } from 'zustand';
import { Drone } from '../types/drone.types';
import { Asset } from '../types/asset.types';
import { SimulationConfig, SimulationMetrics } from '../types/simulation.types';
import { Vector3 } from 'three';

interface SimulationStore {
  // State
  drones: Drone[];
  assets: Asset[];
  config: SimulationConfig;
  metrics: SimulationMetrics;
  isRunning: boolean;
  simulationTime: number;

  // Drone actions
  addDrone: (drone: Drone) => void;
  updateDrone: (id: string, updates: Partial<Drone>) => void;
  removeDrone: (id: string) => void;
  clearDrones: () => void;

  // Asset actions
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  removeAsset: (id: string) => void;

  // Simulation controls
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  setSpeed: (speed: number) => void;
  updateConfig: (config: Partial<SimulationConfig>) => void;

  // Metrics
  updateMetrics: (metrics: Partial<SimulationMetrics>) => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  // Initial state
  drones: [],
  assets: [
    {
      id: 'asset-1',
      name: 'Command Center',
      position: new Vector3(0, 0, 0),
      health: 100,
      maxHealth: 100,
      threatRadius: 500,
      isChaseMode: false,
      isPinned: true,
    },
  ],
  config: {
    weights: {
      w1: 0.4,
      w2: 0.4,
      w3: 0.2,
    },
    speed: 1.0,
    difficulty: 'normal',
  },
  metrics: {
    friendlyCount: 0,
    hostileAirCount: 0,
    hostileGroundCount: 0,
    assetsProtected: 1,
    totalAssets: 1,
    activeEngagements: 0,
    avgFriendlyHealth: 0,
    avgFriendlyAmmo: 0,
    totalKills: 0,
    totalLosses: 0,
  },
  isRunning: false,
  simulationTime: 0,

  // Drone actions
  addDrone: (drone) =>
    set((state) => ({
      drones: [...state.drones, drone],
    })),

  updateDrone: (id, updates) =>
    set((state) => ({
      drones: state.drones.map((drone) =>
        drone.id === id ? { ...drone, ...updates } : drone
      ),
    })),

  removeDrone: (id) =>
    set((state) => ({
      drones: state.drones.filter((drone) => drone.id !== id),
    })),

  clearDrones: () => set({ drones: [] }),

  // Asset actions
  addAsset: (asset) =>
    set((state) => ({
      assets: [...state.assets, asset],
    })),

  updateAsset: (id, updates) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === id ? { ...asset, ...updates } : asset
      ),
    })),

  removeAsset: (id) =>
    set((state) => ({
      assets: state.assets.filter((asset) => asset.id !== id),
    })),

  // Simulation controls
  startSimulation: () => set({ isRunning: true }),
  pauseSimulation: () => set({ isRunning: false }),
  resetSimulation: () =>
    set({
      drones: [],
      isRunning: false,
      simulationTime: 0,
      metrics: {
        friendlyCount: 0,
        hostileAirCount: 0,
        hostileGroundCount: 0,
        assetsProtected: 1,
        totalAssets: 1,
        activeEngagements: 0,
        avgFriendlyHealth: 0,
        avgFriendlyAmmo: 0,
        totalKills: 0,
        totalLosses: 0,
      },
    }),

  setSpeed: (speed) =>
    set((state) => ({
      config: { ...state.config, speed },
    })),

  updateConfig: (config) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),

  updateMetrics: (metrics) =>
    set((state) => ({
      metrics: { ...state.metrics, ...metrics },
    })),
}));
