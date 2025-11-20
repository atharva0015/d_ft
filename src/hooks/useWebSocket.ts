import { useEffect } from 'react';
import { wsService } from '../services/websocket.service';
import { useSimulationStore } from '../store/simulationStore';
import { useMetricsStore } from '../store/metricsStore';
import { Vector3 } from 'three';

export const useWebSocket = () => {
  const updateDrone = useSimulationStore((state) => state.updateDrone);
  const removeDrone = useSimulationStore((state) => state.removeDrone);
  const updateAsset = useSimulationStore((state) => state.updateAsset);
  const addEvent = useMetricsStore((state) => state.addEvent);

  useEffect(() => {
    // Connect to WebSocket
    wsService.connect();

    // Subscribe to drone position updates
    wsService.subscribe('drone:position', (payload: any) => {
      const { droneId, position, velocity } = payload;
      updateDrone(droneId, {
        position: new Vector3(position[0], position[1], position[2]),
        velocity: new Vector3(velocity[0], velocity[1], velocity[2]),
      });
    });

    // Subscribe to threat calculations
    wsService.subscribe('threat:calculated', (payload: any) => {
      const { droneId, ST, Ptype, Pprox, Ccost } = payload;
      updateDrone(droneId, {
        threatScore: ST,
      });
    });

    // Subscribe to FSM transitions
    wsService.subscribe('fsm:transition', (payload: any) => {
      const { droneId, oldState, newState, reason } = payload;
      updateDrone(droneId, {
        fsmState: newState,
        lastStateChange: Date.now(),
      });

      addEvent({
        type: 'state_change',
        severity: 'info',
        droneId,
        message: `Drone ${droneId} transitioned from ${oldState} to ${newState}: ${reason}`,
      });
    });

    // Subscribe to engagement events
    wsService.subscribe('engagement:start', (payload: any) => {
      const { attackerId, targetId } = payload;
      addEvent({
        type: 'engage',
        severity: 'warning',
        droneId: attackerId,
        message: `Drone ${attackerId} engaging ${targetId}`,
      });
    });

    wsService.subscribe('engagement:end', (payload: any) => {
      const { attackerId, targetId, damage } = payload;
      addEvent({
        type: 'engage',
        severity: 'success',
        droneId: attackerId,
        message: `Engagement ended: ${attackerId} dealt ${damage} damage to ${targetId}`,
      });
    });

    // Subscribe to drone destruction
    wsService.subscribe('drone:destroyed', (payload: any) => {
      const { droneId, destroyedBy } = payload;
      removeDrone(droneId);
      addEvent({
        type: 'destroy',
        severity: 'error',
        droneId,
        message: `Drone ${droneId} destroyed by ${destroyedBy}`,
      });
    });

    // Subscribe to asset damage
    wsService.subscribe('asset:damage', (payload: any) => {
      const { assetId, damage, health } = payload;
      updateAsset(assetId, { health });
      addEvent({
        type: 'asset_damage',
        severity: 'error',
        message: `Asset ${assetId} took ${damage} damage (${health}% remaining)`,
      });
    });

    // Cleanup on unmount
    return () => {
      wsService.disconnect();
    };
  }, [updateDrone, removeDrone, updateAsset, addEvent]);

  return {
    send: wsService.send.bind(wsService),
    isConnected: wsService.isConnected.bind(wsService),
  };
};
