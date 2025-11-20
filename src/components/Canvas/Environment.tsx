import React from 'react';

const Environment: React.FC = () => {
  return (
    <>
      {/* Terrain plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#202020" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Fog for depth */}
      <fog attach="fog" args={['#202020', 1000, 2000]} />
    </>
  );
};

export default Environment;
