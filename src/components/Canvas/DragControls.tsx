import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface DragControlsProps {
  droneId: string;
}

export const DragControls: React.FC<DragControlsProps> = ({ droneId }) => {
  const { camera, raycaster, mouse } = useThree();
  const planeRef = useRef<THREE.Plane>(new THREE.Plane(
    new THREE.Vector3(0, 1, 0),
    0
  ));
  const targetPoint = useRef<THREE.Vector3>(new THREE.Vector3());

  const handleMouseMove = (event: MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    mouse.y = -(event.clientY - rect.top) / rect.height * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(planeRef.current, targetPoint.current);

    // Update drone position while dragging
    // Will be connected to Zustand store
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
};
