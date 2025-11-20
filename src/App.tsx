import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import MainLayout from './components/Layout/MainLayout';
import SimulationCanvas from './components/Canvas/SimulationCanvas';

// Dashboard panels
import MetricsPanel from './components/Dashboard/MetricsPanel';
import ThreatAssessment from './components/Dashboard/ThreatAssessment';
import EventLog from './components/Dashboard/EventLog';
import WinProbability from './components/Dashboard/WinProbability';
import PerformanceMetrics from './components/Dashboard/PerformanceMetrics';

// Control panels
import DroneSpawner from './components/Controls/DroneSpawner';
import AssetManager from './components/Controls/AssetManager';
import SimulationControls from './components/Controls/SimulationControls';
import ParameterTuning from './components/Controls/ParameterTuning';

import { Box, Grid } from '@mui/material';
import { alchiFlyTheme } from './styles/theme';
import { useUIStore } from './store/uiStore';

const panelComponents: { [key: string]: React.FC } = {
  metrics: MetricsPanel,
  threats: ThreatAssessment,
  events: EventLog,
  probability: WinProbability,
  performance: PerformanceMetrics,
};

const App: React.FC = () => {
  const activePanels = useUIStore((state) => state.activePanels);

  return (
    <ThemeProvider theme={alchiFlyTheme}>
      <MainLayout>
        <Grid container spacing={1} sx={{ height: '100%', pt: 1 }}>
          <Grid
            item
            xs={7}
            sx={{
              height: '100%',
              minHeight: '700px',
              maxHeight: '100vh',
              position: 'relative',
              borderRight: '2px solid #202020',
              bgcolor: '#202020',
            }}
          >
            {/* Main 3D simulation canvas */}
            <SimulationCanvas />
            {/* Control panels (bottom overlay) */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                bgcolor: 'rgba(32,32,32,0.95)',
                px: 2,
                py: 1,
                zIndex: 2,
              }}
            >
              <Grid container spacing={1}>
                <Grid item>
                  <SimulationControls />
                </Grid>
                <Grid item>
                  <DroneSpawner />
                </Grid>
                <Grid item>
                  <AssetManager />
                </Grid>
                <Grid item>
                  <ParameterTuning />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={5} sx={{ height: '100%', bgcolor: '#202020', overflowY: 'auto' }}>
            {/* Sidebar dashboard panels */}
            <Box sx={{ px: 1, pt: 7 }}>
              {activePanels.map(panelKey => {
                const PanelComponent = panelComponents[panelKey];
                return PanelComponent ? (
                  <PanelComponent key={panelKey} />
                ) : null;
              })}
            </Box>
          </Grid>
        </Grid>
      </MainLayout>
    </ThemeProvider>
  );
};

export default App;
