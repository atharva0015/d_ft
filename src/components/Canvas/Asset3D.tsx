import React, { useRef } from 'react';
import { Mesh } from 'three';
import { Html } from '@react-three/drei';
import { Asset } from '../../types/asset.types';
import { useUIStore } from '../../store/uiStore';
import ThreatDome from './ThreatDome';

interface Asset3DProps {
  asset: Asset;
}

const Asset3D: React.FC<Asset3DProps> = ({ asset }) => {
  const meshRef = useRef<Mesh>(null);
  const selectedAssetId = useUIStore((state) => state.selectedAssetId);
  const selectAsset = useUIStore((state) => state.selectAsset);

  const isSelected = selectedAssetId === asset.id;

  return (
    <group>
      {/* Asset cylinder */}
      <mesh
        ref={meshRef}
        position={asset.position}
        onClick={() => selectAsset(asset.id)}
      >
        <cylinderGeometry args={[15, 15, 30, 32]} />
        <meshStandardMaterial
          color="#B8C8D7"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Threat dome */}
      <ThreatDome
        position={asset.position}
        radius={asset.threatRadius}
        opacity={0.15}
      />

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={asset.position} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[20, 25, 32]} />
          <meshBasicMaterial color="#FF4628" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Asset label */}
      <Html position={[asset.position.x, asset.position.y + 30, asset.position.z]} center>
        <div
          style={{
            backgroundColor: '#202020',
            color: '#B8C8D7',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '1px solid #FF4628',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {asset.name}
          {asset.isPinned && ' 📌'}
        </div>
      </Html>
    </group>
  );
};

export default Asset3D;
