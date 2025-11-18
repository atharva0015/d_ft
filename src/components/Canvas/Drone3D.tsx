import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { DroneData } from '../../types/drone';

interface Drone3DProps {
  drone: DroneData;
  isFriendly: boolean;
  threatScore?: number;
  onClick: () => void;
}

export const Drone3D: React.FC<Drone3DProps> = ({
  drone,
  isFriendly,
  threatScore = 0,
  onClick
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const glowMaterialRef = useRef<THREE.Material>(null);

  // Load GLB model
  const modelPath = isFriendly 
    ? '/models/friendly-drone.glb' 
    : '/models/hostile-drone.glb';
  const { scene } = useGLTF(modelPath);

  // Calculate glow intensity based on threat score
  const glowIntensity = useMemo(() => {
    if (isFriendly) return 0.3; // Friendly subtle glow
    return (threatScore || 0) / 100; // Hostile: 0-1 based on ST
  }, [threatScore, isFriendly]);

  // Color based on state
  const droneColor = useMemo(() => {
    if (isFriendly) return '#1E90FF'; // Dodger blue
    
    // Color gradient based on threat score
    if (!threatScore) return '#FF6B35'; // Default red
    if (threatScore < 20) return '#90EE90'; // Light green
    if (threatScore < 40) return '#FFD700'; // Gold
    if (threatScore < 60) return '#FFA500'; // Orange
    if (threatScore < 80) return '#FF4500'; // Red-orange
    return '#8B0000'; // Dark red
  }, [threatScore, isFriendly]);

  // Animation: hovering motion
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.copy(drone.position);
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.3;
      
      // Pulsing glow for high-threat drones
      if (!isFriendly && threatScore && threatScore > 60) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <group ref={meshRef} onClick={onClick}>
      {/* Load drone model from GLB */}
      <primitive object={scene.clone()} />

      {/* Glow effect */}
      <pointLight
        position={[0, 0, 0]}
        color={droneColor}
        intensity={glowIntensity * 2}
        distance={20}
      />

      {/* Health bar above drone */}
      <sprite position={[0, 8, 0]}>
        <spriteMaterial attach="material" map={createHealthBarTexture(drone.health)} />
      </sprite>

      {/* State indicator badge */}
      <mesh position={[0, 5, 0]}>
        <planeGeometry args={[3, 1]} />
        <meshStandardMaterial color={getFSMStateColor(drone.fsmState)} />
      </mesh>
    </group>
  );
};

// Helper function to create health bar texture
function createHealthBarTexture(health: number): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 10;
  const ctx = canvas.getContext('2d')!;
  
  // Background
  ctx.fillStyle = '#333333';
  ctx.fillRect(0, 0, 100, 10);
  
  // Health bar
  const healthColor = health > 50 ? '#00FF00' : health > 25 ? '#FFFF00' : '#FF0000';
  ctx.fillStyle = healthColor;
  ctx.fillRect(0, 0, health, 10);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function getFSMStateColor(state: string): string {
  switch (state) {
    case 'PATROL': return '#1E90FF';
    case 'ASSESS_THREAT': return '#FFD700';
    case 'ENGAGE': return '#FF0000';
    case 'RTB': return '#00FF00';
    default: return '#FFFFFF';
  }
}
