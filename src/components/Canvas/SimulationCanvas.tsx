import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { Box, CircularProgress } from '@mui/material';
import { useSimulationStore } from '../../store/simulationStore';
import { useUIStore } from '../../store/uiStore';
import Drone3D from './Drone3D';
import Asset3D from './Asset3D';
import Environment from './Environment';

const SimulationCanvas: React.FC = () => {
  const drones = useSimulationStore((state) => state.drones);
  const assets = useSimulationStore((state) => state.assets);
  const cameraMode = useUIStore((state) => state.cameraMode);

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        className="canvas-container"
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 500, 1000]} fov={60} />
          
          {/* Controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={100}
            maxDistance={2000}
            maxPolarAngle={Math.PI / 2}
          />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[500, 1000, 500]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <hemisphereLight args={['#B8C8D7', '#202020', 0.3]} />

          {/* Environment */}
          <Environment />

          {/* Grid */}
          <Grid
            args={[2000, 2000]}
            cellSize={50}
            cellThickness={0.5}
            cellColor="#B8C8D7"
            sectionSize={200}
            sectionThickness={1}
            sectionColor="#FF4628"
            fadeDistance={2000}
            fadeStrength={1}
            position={[0, -0.5, 0]}
          />

          {/* Assets */}
          {assets.map((asset) => (
            <Asset3D key={asset.id} asset={asset} />
          ))}

          {/* Drones */}
          {drones.map((drone) => (
            <Drone3D key={drone.id} drone={drone} />
          ))}
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: drones.length === 0 ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: '#FF4628' }} />
        <Box sx={{ color: '#B8C8D7', fontSize: '14px' }}>
          Initializing Simulation...
        </Box>
      </Box>
    </Box>
  );
};

export default SimulationCanvas;
