import io, { Socket } from 'socket.io-client';
import { SimulationState } from '../store/simulationStore';

let socket: Socket | null = null;

export const connectWebSocket = (url: string, store: SimulationState) => {
  socket = io(url, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on('drone.update', (data) => {
    const { drone } = data;
    if (drone.type === 'friendly') {
      store.updateFriendlyDrone(drone);
    } else {
      store.updateHostileDrone(drone);
    }
  });

  socket.on('threat.score.update', (data) => {
    const { droneId, threatScore } = data;
    const hostile = store.hostileDrones.find((d: { id: any; }) => d.id === droneId);
    if (hostile) {
      store.updateHostileDrone({ ...hostile, threatScore });
    }
  });

  socket.on('engagement.start', (data) => {
    store.addEventLog({
      id: `${Date.now()}`,
      timestamp: Date.now(),
      type: 'engagement',
      message: `Engagement started: ${data.friendlies.join(', ')} vs ${data.hostiles.join(', ')}`
    });
  });

  socket.on('asset.threatened', (data) => {
    store.addEventLog({
      id: `${Date.now()}`,
      timestamp: Date.now(),
      type: 'asset_threatened',
      message: `âš ï¸ Asset ${data.assetId} is under threat!`
    });
  });

  return socket;
};

export const sendCommand = (command: string, data: any) => {
  if (socket) {
    socket.emit(command, data);
  }
};
