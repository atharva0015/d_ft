import React, { useRef, useMemo } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Drone } from '../../types/drone.types';
import { DRONE_COLORS, getThreatColor } from '../../styles/theme';
import { useUIStore } from '../../store/uiStore';

interface Drone3DProps {
  drone: Drone;
}

const Drone3D: React.FC<Drone3DProps> = ({ drone }) => {
  const meshRef = useRef<Mesh>(null);
  const selectedDroneId = useUIStore((state) => state.selectedDroneId);
  const selectDrone = useUIStore((state) => state.selectDrone);

  const isSelected = selectedDroneId === drone.id;

  // Determine drone color
  const droneColor = useMemo(() => {
    if (drone.type === 'friendly') return DRONE_COLORS.FRIENDLY;
    return DRONE_COLORS.HOSTILE_AIR; // Both hostile types use red base
  }, [drone.type]);

  // Get threat-based glow color
  const glowColor = useMemo(() => {
    if (drone.type === 'friendly' || !drone.threatScore) return droneColor;
    return getThreatColor(drone.threatScore);
  }, [drone.threatScore, drone.type, droneColor]);

  // FSM state colors
  const stateColors: Record<string, string> = {
    PATROL: '#4CAF50',
    ASSESS_THREAT: '#FFC107',
    ENGAGE: '#FF4628',
    RTB: '#2196F3',
  };

  // Health bar color
  const healthColor = useMemo(() => {
    const healthPercent = (drone.health / drone.maxHealth) * 100;
    if (healthPercent > 60) return '#4CAF50';
    if (healthPercent > 30) return '#FFC107';
    return '#FF4628';
  }, [drone.health, drone.maxHealth]);

  // Update position
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(drone.position);
    }
  });

  return (
    <group>
      {/* Main drone sphere */}
      <mesh
        ref={meshRef}
        position={drone.position}
        onClick={() => selectDrone(drone.id)}
      >
        <sphereGeometry args={[10, 32, 32]} />
        <meshStandardMaterial
          color={droneColor}
          emissive={glowColor}
          emissiveIntensity={drone.threatScore ? drone.threatScore / 100 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* White spots for ground-attack hostile drones */}
      {drone.type === 'hostile-ground' && (
        <>
          <mesh position={[drone.position.x + 8, drone.position.y, drone.position.z]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial color={DRONE_COLORS.SPOT_COLOR} />
          </mesh>
          <mesh position={[drone.position.x - 8, drone.position.y, drone.position.z]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial color={DRONE_COLORS.SPOT_COLOR} />
          </mesh>
          <mesh position={[drone.position.x, drone.position.y, drone.position.z + 8]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial color={DRONE_COLORS.SPOT_COLOR} />
          </mesh>
        </>
      )}

      {/* Selection ring */}
      {isSelected && (
        <mesh position={drone.position} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[12, 15, 32]} />
          <meshBasicMaterial color="#FF4628" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Health bar and FSM badge (HTML overlay) */}
      <Html position={[drone.position.x, drone.position.y + 20, drone.position.z]} center>
        <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {/* Health bar */}
          <div
            style={{
              width: '50px',
              height: '4px',
              backgroundColor: '#2A2A2A',
              border: '1px solid #B8C8D7',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                width: `${(drone.health / drone.maxHealth) * 100}%`,
                height: '100%',
                backgroundColor: healthColor,
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* FSM State Badge */}
          <div
            style={{
              backgroundColor: stateColors[drone.fsmState] || '#666',
              color: '#FFF',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 'bold',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {drone.fsmState}
          </div>

          {/* Threat Score (for hostile drones) */}
          {drone.type !== 'friendly' && drone.threatScore !== undefined && (
            <div
              style={{
                backgroundColor: '#202020',
                color: getThreatColor(drone.threatScore),
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '4px',
                border: `1px solid ${getThreatColor(drone.threatScore)}`,
              }}
            >
              ST: {drone.threatScore.toFixed(1)}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

export default Drone3D;
