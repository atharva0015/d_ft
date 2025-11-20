import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { useMetricsStore } from '../../store/metricsStore';
import { useSimulationStore } from '../../store/simulationStore';

const PerformanceMetrics: React.FC = () => {
  const metrics = useMetricsStore((state) => state.performance);
  const updatePerformance = useMetricsStore((state) => state.updatePerformance);
  const drones = useSimulationStore((state) => state.drones);

  // Update FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = window.performance.now();

    const updateFPS = () => {
      frameCount++;
      const currentTime = window.performance.now();
      const elapsed = currentTime - lastTime;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        updatePerformance({ fps });
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(updateFPS);
    };

    const animationId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(animationId);
  }, [updatePerformance]);

  // Update active drones count
  useEffect(() => {
    updatePerformance({ activeDrones: drones.length });
  }, [drones.length, updatePerformance]);

  const MetricChip: React.FC<{ label: string; value: string | number; color: string }> = ({
    label,
    value,
    color,
  }) => (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        {label}
      </Typography>
      <Chip
        label={value}
        sx={{
          backgroundColor: color,
          color: '#FFF',
          fontWeight: 'bold',
          fontSize: '14px',
        }}
      />
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#FF4628' }}>
        ⚡ Performance Metrics
      </Typography>

      <Card sx={{ backgroundColor: '#2A2A2A' }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            <Box>
              <MetricChip
                label="FPS"
                value={metrics.fps}
                color={metrics.fps >= 30 ? '#4CAF50' : '#FF4628'}
              />
            </Box>

            <Box>
              <MetricChip
                label="Active Drones"
                value={metrics.activeDrones}
                color="#1E90FF"
              />
            </Box>

            <Box>
              <MetricChip
                label="Decision Freq."
                value={`${metrics.decisionFrequency} Hz`}
                color="#FFC107"
              />
            </Box>

            <Box>
              <MetricChip
                label="WS Latency"
                value={`${metrics.websocketLatency} ms`}
                color={metrics.websocketLatency < 100 ? '#4CAF50' : '#FFC107'}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PerformanceMetrics;
