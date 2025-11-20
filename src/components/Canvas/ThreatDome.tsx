import React from 'react';
import { Vector3 } from 'three';

interface ThreatDomeProps {
  position: Vector3;
  radius: number;
  opacity?: number;
}

const ThreatDome: React.FC<ThreatDomeProps> = ({ position, radius, opacity = 0.2 }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial
        color="#FF4628"
        transparent
        opacity={opacity}
        wireframe
      />
    </mesh>
  );
};

export default ThreatDome;
