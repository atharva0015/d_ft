import React from 'react';
import * as THREE from 'three';

export const Environment: React.FC = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[100, 100, 100]}
        intensity={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        castShadow
      />

      {/* Sky */}
      <mesh scale={500}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
      </mesh>

      {/* Fog for depth */}
      <fog attach="fog" args={['#87CEEB', 100, 500]} />
    </>
  );
};
