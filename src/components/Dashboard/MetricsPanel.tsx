import React, { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSimulationStore } from '../../store/simulationStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const MetricsPanel: React.FC = () => {
  const { friendlyDrones, hostileDrones, assets, metricsHistory } = useSimulationStore();

  const stats = useMemo(() => ({
    friendlyActive: friendlyDrones.filter((d: { isActive: any; }) => d.isActive).length,
    hostileActive: hostileDrones.filter((d: { isActive: any; }) => d.isActive).length,
    assetsProtected: assets.filter((a: { isThreatened: any; }) => !a.isThreatened).length,
    assetsThreatened: assets.filter((a: { isThreatened: any; }) => a.isThreatened).length,
    avgFriendlyHealth: friendlyDrones.length > 0
      ? friendlyDrones.reduce((sum: any, d: { health: any; }) => sum + d.health, 0) / friendlyDrones.length
      : 0,
    avgAmmo: friendlyDrones.length > 0
      ? friendlyDrones.reduce((sum: any, d: { ammo: any; }) => sum + (d.ammo || 0), 0) / friendlyDrones.length
      : 0,
    totalEngagements: friendlyDrones.filter((d: { fsmState: string; }) => d.fsmState === 'ENGAGE').length
  }), [friendlyDrones, hostileDrones, assets]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {/* Force Status */}
      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="overline" color="textSecondary">Friendly Drones</Typography>
          <Typography variant="h4" sx={{ color: '#1E90FF' }}>
            {stats.friendlyActive}
          </Typography>
          <Typography variant="body2">Active / Engaged: {stats.totalEngagements}</Typography>
        </Paper>
      </Box>

      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="overline" color="textSecondary">Hostile Drones</Typography>
          <Typography variant="h4" sx={{ color: '#FF4500' }}>
            {stats.hostileActive}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="overline" color="textSecondary">Assets Protected</Typography>
          <Typography variant="h4" sx={{ color: '#228B22' }}>
            {stats.assetsProtected}/{assets.length}
          </Typography>
          <Typography variant="caption" sx={{ color: stats.assetsThreatened > 0 ? '#FF0000' : '#228B22' }}>
            {stats.assetsThreatened > 0 ? `âš ï¸ ${stats.assetsThreatened} Threatened!` : 'All Safe'}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="overline" color="textSecondary">Health / Ammo</Typography>
          <Typography variant="body2">{stats.avgFriendlyHealth.toFixed(0)}%</Typography>
          <Typography variant="body2">{stats.avgAmmo.toFixed(1)}/10</Typography>
        </Paper>
      </Box>

      {/* Metrics Chart */}
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Metrics Trend</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="threatLevel" stroke="#FF4500" name="Threat Level" />
              <Line type="monotone" dataKey="friendlyHealth" stroke="#1E90FF" name="Avg Health" />
              <Line type="monotone" dataKey="protection" stroke="#228B22" name="Protection %" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
};
