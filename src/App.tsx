import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer } from '@mui/material';
import { SimulationCanvas } from './components/Canvas/SimulationCanvas';
import { MetricsPanel } from './components/Dashboard/MetricsPanel';
import { ThreatAssessment } from './components/Dashboard/ThreatAssessment';
import { DroneLogViewer } from './components/Dashboard/DroneLogViewer';
import { WinProbability } from './components/Dashboard/WinProbability';
import { DroneSpawner } from './components/Controls/DroneSpawner';
import { AssetManager } from './components/Controls/AssetManager';
import { DroneEditor } from './components/Controls/DroneEditor';
import { useSimulationStore } from './store/simulationStore';

const DRAWER_WIDTH = 300;

export default function App() {
  const { setSelectedDrone } = useSimulationStore();
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ðŸš AlchiFly - Autonomous Drone Swarm Defense Simulation
          </Typography>
          <Typography variant="body2">Score: 12,450 pts | Level: Expert</Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginTop: '64px',
          display: 'flex',
          overflow: 'hidden'
        }}
      >
        {/* 3D Canvas */}
        <Box sx={{ flex: 2, position: 'relative' }}>
          <SimulationCanvas
            cameraMode="free"
            onDroneSelected={(id) => {
              setSelectedDrone(id);
              setEditorOpen(true);
            }}
          />
        </Box>

        {/* Right Dashboard */}
        <Drawer
          anchor="right"
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH * 2,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH * 2,
              boxSizing: 'border-box',
              marginTop: '64px',
              overflowY: 'auto'
            }
          }}
        >
          <Box sx={{ p: 2 }}>
            {/* Control Panel */}
            <DroneSpawner />
            <AssetManager />

            {/* Tabs for Dashboard */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Metrics</Typography>
              <MetricsPanel />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Threats</Typography>
              <ThreatAssessment />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Victory Probability</Typography>
              <WinProbability />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Events</Typography>
              <DroneLogViewer />
            </Box>
          </Box>
        </Drawer>
      </Box>

      {/* Drone Editor Dialog */}
      <DroneEditor
        drone={null}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
      />
    </Box>
  );
}

