import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import { useSimulationStore } from '../../store/simulationStore';

const MetricsPanel: React.FC = () => {
  const drones = useSimulationStore((state) => state.drones);
  const assets = useSimulationStore((state) => state.assets);

  // Calculate metrics
  const metrics = useMemo(() => {
    const friendlyDrones = drones.filter((d) => d.type === 'friendly');
    const hostileAirDrones = drones.filter((d) => d.type === 'hostile-air');
    const hostileGroundDrones = drones.filter((d) => d.type === 'hostile-ground');

    const avgHealth =
      friendlyDrones.length === 0
        ? 0
        : friendlyDrones.reduce((sum, d) => sum + d.health, 0) / friendlyDrones.length;

    const avgAmmo =
      friendlyDrones.length === 0
        ? 0
        : friendlyDrones.reduce((sum, d) => sum + d.ammo, 0) / friendlyDrones.length;

    const activeEngagements = friendlyDrones.filter((d) => d.fsmState === 'ENGAGE').length;

    const assetsProtected = assets.filter((a) => a.health > 0).length;

    return {
      friendlyCount: friendlyDrones.length,
      hostileAirCount: hostileAirDrones.length,
      hostileGroundCount: hostileGroundDrones.length,
      avgHealth: Math.round(avgHealth),
      avgAmmo: Math.round(avgAmmo),
      activeEngagements,
      assetsProtected,
      totalAssets: assets.length,
    };
  }, [drones, assets]);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    color: string;
    subtitle?: string;
  }> = ({ title, value, color, subtitle }) => (
    <Card sx={{ height: '100%', backgroundColor: '#2A2A2A' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#FF4628' }}>
        📊 Simulation Metrics
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {/* Friendly Drones */}
        <Box>
          <MetricCard
            title="Friendly Drones"
            value={metrics.friendlyCount}
            color="#1E90FF"
          />
        </Box>

        {/* Hostile Air Drones */}
        <Box>
          <MetricCard
            title="Hostile Air"
            value={metrics.hostileAirCount}
            color="#FF0000"
          />
        </Box>

        {/* Hostile Ground Drones */}
        <Box>
          <MetricCard
            title="Hostile Ground"
            value={metrics.hostileGroundCount}
            color="#FF4628"
          />
        </Box>

        {/* Active Engagements */}
        <Box>
          <MetricCard
            title="Active Engagements"
            value={metrics.activeEngagements}
            color="#FFC107"
          />
        </Box>

        {/* Average Health */}
        <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
          <Card sx={{ backgroundColor: '#2A2A2A' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Average Friendly Health
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.avgHealth}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#202020',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor:
                          metrics.avgHealth > 60
                            ? '#4CAF50'
                            : metrics.avgHealth > 30
                            ? '#FFC107'
                            : '#FF4628',
                      },
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ minWidth: 60 }}>
                  {metrics.avgHealth}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Average Ammo */}
        <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
          <Card sx={{ backgroundColor: '#2A2A2A' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Average Friendly Ammo
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={metrics.avgAmmo}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#202020',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#B8C8D7',
                      },
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ minWidth: 60 }}>
                  {metrics.avgAmmo}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Asset Protection */}
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <Card sx={{ backgroundColor: '#2A2A2A' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Asset Protection Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(metrics.assetsProtected / metrics.totalAssets) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#202020',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4CAF50',
                      },
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ minWidth: 100 }}>
                  {metrics.assetsProtected} / {metrics.totalAssets}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default MetricsPanel;
