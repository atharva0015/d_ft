import { create } from 'zustand';
import { PerformanceMetrics, GameEvent } from '../types/simulation.types';

interface MetricsStore {
  // Performance
  performance: PerformanceMetrics;
  
  // Events
  events: GameEvent[];
  maxEvents: number;

  // Actions
  updatePerformance: (metrics: Partial<PerformanceMetrics>) => void;
  addEvent: (event: Omit<GameEvent, 'id' | 'timestamp'>) => void;
  clearEvents: () => void;
}

export const useMetricsStore = create<MetricsStore>((set) => ({
  // Initial state
  performance: {
    fps: 60,
    decisionFrequency: 0,
    stCalculationTime: 0,
    websocketLatency: 0,
    activeDrones: 0,
  },
  events: [],
  maxEvents: 100,

  // Actions
  updatePerformance: (metrics) =>
    set((state) => ({
      performance: { ...state.performance, ...metrics },
    })),

  addEvent: (event) =>
    set((state) => {
      const newEvent: GameEvent = {
        ...event,
        id: `event-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };

      const newEvents = [newEvent, ...state.events].slice(0, state.maxEvents);
      return { events: newEvents };
    }),

  clearEvents: () => set({ events: [] }),
}));
