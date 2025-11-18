import React, { useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { AssetData } from '../../types/simulation';

interface Asset3DProps {
  asset: AssetData;
  onClick: () => void;
}

export const Asset3D: React.FC<Asset3DProps> = ({ asset, onClick }) => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/asset-structure.glb');

  // Protective zone radius
  const threatRange = asset.threatRange || 32;

  // Asset safety status color
  const safetyColor = asset.isThreatened 
    ? asset.isUnderAttack ? '#8B0000' : '#FF4500'
    : '#228B22';

  return (
    <group
      ref={meshRef}
      position={asset.position ? [asset.position.x, asset.position.y, asset.position.z] : undefined}
      onClick={onClick}
    >
      {/* Asset model */}
      <primitive object={scene.clone()} />

      {/* Protective dome - threat range visualization */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[threatRange, 32, 32]} />
        <meshStandardMaterial
          color={safetyColor}
          opacity={0.15}
          transparent
          wireframe
        />
      </mesh>

      {/* Asset ID label */}
      <Text
        position={[0, 15, 0]}
        fontSize={2}
        color="#FFFFFF"
        maxWidth={200}
        anchorX="center"
        anchorY="middle"
      >
        {String(asset.id)}
      </Text>

      {/* Threat indicator */}
      {asset.isThreatened && (
        <pointLight
          position={[0, 5, 0]}
          color="#FF0000"
          intensity={1.5}
          distance={30}
        />
      )}
    </group>
  );
};
