import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import { useSimulationStore } from '../../store/simulationStore';
import { calculateWinProbability } from '../../utils/threatCalculator';

const WinProbability: React.FC = () => {
  const drones = useSimulationStore((state) => state.drones);
  const assets = useSimulationStore((state) => state.assets);

  const probability = useMemo(() => {
    const friendlyDrones = drones.filter((d) => d.type === 'friendly');
    const hostileDrones = drones.filter((d) => d.type !== 'friendly');

    return calculateWinProbability(friendlyDrones, hostileDrones, assets);
  }, [drones, assets]);

  const getColorForProbability = (value: number): string => {
    if (value >= 70) return '#4CAF50';
    if (value >= 40) return '#FFC107';
    return '#FF4628';
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#FF4628' }}>
        🎯 Win Probability
      </Typography>

      <Card sx={{ backgroundColor: '#2A2A2A' }}>
        <CardContent>
          {/* Overall Probability */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
              <span style={{ color: getColorForProbability(probability.overall) }}>
                {probability.overall}%
              </span>
            </Typography>
            <LinearProgress
              variant="determinate"
              value={probability.overall}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: '#202020',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getColorForProbability(probability.overall),
                  borderRadius: 6,
                },
              }}
            />
          </Box>

          {/* Factor Breakdown */}
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#B8C8D7', mb: 2 }}>
            Contributing Factors
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {/* Force Ratio */}
            <Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Force Ratio (30%)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={probability.factors.forceRatio}
                    sx={{
                      flexGrow: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#202020',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#1E90FF',
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 40, fontWeight: 'bold' }}>
                    {probability.factors.forceRatio}%
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Health Status */}
            <Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Health Status (25%)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={probability.factors.healthStatus}
                    sx={{
                      flexGrow: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#202020',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4CAF50',
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 40, fontWeight: 'bold' }}>
                    {probability.factors.healthStatus}%
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Asset Protection */}
            <Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Asset Protection (30%)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={probability.factors.assetProtection}
                    sx={{
                      flexGrow: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#202020',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#B8C8D7',
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 40, fontWeight: 'bold' }}>
                    {probability.factors.assetProtection}%
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Threat Level */}
            <Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Threat Level (15%)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={probability.factors.threatLevel}
                    sx={{
                      flexGrow: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#202020',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#FFC107',
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 40, fontWeight: 'bold' }}>
                    {probability.factors.threatLevel}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WinProbability;
