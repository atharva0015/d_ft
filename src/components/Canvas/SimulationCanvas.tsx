import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useSimulationStore } from '../../store/simulationStore';
import { Environment } from './Environment';
import { Drone3D } from './Drone3D';
import { Asset3D } from './Asset3D';
import { DragControls } from './DragControls';

interface SimulationCanvasProps {
  cameraMode: 'free' | 'topdown' | 'follow' | 'focus';
  onDroneSelected: (droneId: string) => void;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  cameraMode,
  onDroneSelected
}) => {
  const {
    friendlyDrones,
    hostileDrones,
    assets,
    isDragging,
    draggedDroneId
  } = useSimulationStore();

  return (
    <Canvas
      shadows
      camera={{ position: [0, 50, 100], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Lighting & Environment */}
      <Environment />

      {/* Camera Controls */}
      <PerspectiveCamera makeDefault position={[0, 50, 100]} />
      <OrbitControls 
        enableZoom 
        enablePan 
        autoRotate={cameraMode === 'free'}
      />

      {/* Drag Controls for Spawn */}
      {isDragging && draggedDroneId && <DragControls droneId={draggedDroneId} />}

      {/* Terrain */}
      <mesh position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>

      {/* Protected Assets */}
      {assets.map((asset: any) => (
        <Asset3D
          key={asset.id}
          asset={asset}
          onClick={() => onDroneSelected(asset.id)}
        />
      ))}

      {/* Friendly Drones */}
      {friendlyDrones.map((drone: any) => (
        <Drone3D
          key={drone.id}
          drone={drone}
          isFriendly={true}
          onClick={() => onDroneSelected(drone.id)}
        />
      ))}

      {/* Hostile Drones */}
      {hostileDrones.map((drone: any) => (
        <Drone3D
          key={drone.id}
          drone={drone}
          isFriendly={false}
          threatScore={drone.threatScore?.st_total}
          onClick={() => onDroneSelected(drone.id)}
        />
      ))}
    </Canvas>
  );
};
