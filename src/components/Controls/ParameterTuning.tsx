import React from 'react';
import { Box, Card, CardContent, Typography, Slider } from '@mui/material';
import { useSimulationStore } from '../../store/simulationStore';

const ParameterTuning: React.FC = () => {
  const weights = useSimulationStore((state) => state.config.weights);
  const updateConfig = useSimulationStore((state) => state.updateConfig);

  const handleSlider = (key: 'w1' | 'w2' | 'w3', value: number) => {
    updateConfig({ weights: { ...weights, [key]: value } });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ backgroundColor: '#2A2A2A' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ color: '#FF4628', mb: 1 }}>
            🎚️ Tuning: ST Formula Weights
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, flexWrap: 'wrap' }}>
            {(['w1', 'w2', 'w3'] as const).map(key => (
              <Box key={key} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' } }}>
                <Typography variant="caption" sx={{ color: '#B8C8D7' }}>
                  {key.toUpperCase()}
                </Typography>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={weights[key]}
                  onChange={(_, value) => handleSlider(key, Number(value))}
                  valueLabelDisplay="auto"
                  sx={{ color: key === 'w1' ? '#4CAF50' : key === 'w2' ? '#FFC107' : '#FF4628' }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ParameterTuning;
