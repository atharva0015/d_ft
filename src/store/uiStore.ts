import { create } from 'zustand';

type CameraMode = 'free' | 'topdown' | 'follow' | 'focus';
type ViewPanel = 'metrics' | 'threats' | 'events' | 'probability' | 'performance';

interface UIStore {
  // Camera
  cameraMode: CameraMode;
  followDroneId: string | null;
  focusPosition: [number, number, number] | null;

  // Selection
  selectedDroneId: string | null;
  selectedAssetId: string | null;

  // Panels
  activePanels: ViewPanel[];
  sidebarOpen: boolean;

  // Actions
  setCameraMode: (mode: CameraMode) => void;
  setFollowDrone: (droneId: string | null) => void;
  setFocusPosition: (position: [number, number, number] | null) => void;
  selectDrone: (droneId: string | null) => void;
  selectAsset: (assetId: string | null) => void;
  togglePanel: (panel: ViewPanel) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  cameraMode: 'free',
  followDroneId: null,
  focusPosition: null,
  selectedDroneId: null,
  selectedAssetId: null,
  activePanels: ['metrics', 'threats', 'events'],
  sidebarOpen: true,

  // Actions
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setFollowDrone: (droneId) => set({ followDroneId: droneId }),
  setFocusPosition: (position) => set({ focusPosition: position }),
  selectDrone: (droneId) => set({ selectedDroneId: droneId }),
  selectAsset: (assetId) => set({ selectedAssetId: assetId }),
  togglePanel: (panel) =>
    set((state) => ({
      activePanels: state.activePanels.includes(panel)
        ? state.activePanels.filter((p) => p !== panel)
        : [...state.activePanels, panel],
    })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
