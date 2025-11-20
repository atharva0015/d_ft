import React from 'react';
import { Box, Button, Slider, Typography, Stack } from '@mui/material';
import { useSimulationStore } from '../../store/simulationStore';

const SimulationControls: React.FC = () => {
  const isRunning = useSimulationStore((state) => state.isRunning);
  const startSimulation = useSimulationStore((state) => state.startSimulation);
  const pauseSimulation = useSimulationStore((state) => state.pauseSimulation);
  const resetSimulation = useSimulationStore((state) => state.resetSimulation);
  const speed = useSimulationStore((state) => state.config.speed);
  const setSpeed = useSimulationStore((state) => state.setSpeed);

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* Play/Pause */}
      {isRunning ? (
        <Button variant="contained" color="error" onClick={pauseSimulation}>
          Pause
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={startSimulation}>
          Play
        </Button>
      )}
      <Button variant="outlined" color="secondary" onClick={resetSimulation}>
        Reset
      </Button>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ ml: 4 }}>
        <Typography variant="caption" color="#B8C8D7">
          Speed
        </Typography>
        <Slider
          min={0.5}
          max={4.0}
          step={0.1}
          value={speed}
          onChange={(_, value) => setSpeed(Number(value))}
          valueLabelDisplay="auto"
          sx={{ width: 120, color: '#FF4628' }}
        />
        <Typography sx={{ width: 28, textAlign: 'center', color: '#B8C8D7' }}>
          {speed.toFixed(1)}x
        </Typography>
      </Stack>
    </Box>
  );
};

export default SimulationControls;
