import React, { useMemo } from 'react';
import { Paper, Box, Typography, LinearProgress, Card } from '@mui/material';
import { useSimulationStore } from '../../store/simulationStore';

export const WinProbability: React.FC = () => {
  const { friendlyDrones, hostileDrones, assets } = useSimulationStore();

  // Calculate win probability based on multiple factors
  const winProb = useMemo(() => {
    // Factor 1: Force ratio
    const friendlyCount = friendlyDrones.filter((d: { isActive: any; }) => d.isActive).length;
    const hostileCount = hostileDrones.filter((d: { isActive: any; }) => d.isActive).length;
    const forceRatioProbability = hostileCount === 0 ? 100 : Math.min(100, (friendlyCount / hostileCount) * 50);

    // Factor 2: Health average
    const avgFriendlyHealth = friendlyDrones.length > 0
      ? friendlyDrones.reduce((sum: any, d: { health: any; }) => sum + d.health, 0) / friendlyDrones.length
      : 0;
    const healthProbability = avgFriendlyHealth * 0.5;

    // Factor 3: Asset protection
    const assetsProtected = assets.filter((a: { isThreatened: any; }) => !a.isThreatened).length;
    const protectionProbability = (assetsProtected / Math.max(1, assets.length)) * 30;

    // Factor 4: Average threat score of hostiles
    const avgThreatScore = hostileDrones.length > 0
      ? hostileDrones.reduce((sum: number, d: { threatScore?: { st_total?: number; }; }) => sum + (d.threatScore?.st_total || 0), 0) / hostileDrones.length
      : 0;
    const threatProbability = Math.max(0, 100 - avgThreatScore);

    const total = (forceRatioProbability * 0.25) +
                  (healthProbability * 0.25) +
                  (protectionProbability * 0.3) +
                  (threatProbability * 0.2);

    return {
      overall: Math.round(total),
      forceRatio: Math.round(forceRatioProbability),
      health: Math.round(healthProbability),
      protection: Math.round(protectionProbability),
      threat: Math.round(threatProbability)
    };
  }, [friendlyDrones, hostileDrones, assets]);

  const getWinProbColor = (prob: number) => {
    if (prob >= 75) return 'success';
    if (prob >= 50) return 'warning';
    return 'error';
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Victory Probability</Typography>

      {/* Overall probability */}
      <Card sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" sx={{ color: getWinProbColor(winProb.overall) }}>
            {winProb.overall}%
          </Typography>
          <Typography variant="body2">Success Probability</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={winProb.overall}
          sx={{ height: 8, borderRadius: 4 }}
          color={getWinProbColor(winProb.overall) as any}
        />
      </Card>

      {/* Factor breakdown */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
          <Typography variant="caption" color="textSecondary">Force Ratio</Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, winProb.forceRatio)}
            sx={{ height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption">{winProb.forceRatio}%</Typography>
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
          <Typography variant="caption" color="textSecondary">Health Status</Typography>
          <LinearProgress
            variant="determinate"
            value={winProb.health}
            sx={{ height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption">{winProb.health}%</Typography>
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
          <Typography variant="caption" color="textSecondary">Asset Protection</Typography>
          <LinearProgress
            variant="determinate"
            value={winProb.protection}
            sx={{ height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption">{winProb.protection}%</Typography>
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
          <Typography variant="caption" color="textSecondary">Threat Level (Inverse)</Typography>
          <LinearProgress
            variant="determinate"
            value={winProb.threat}
            sx={{ height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption">{winProb.threat}%</Typography>
        </Box>
      </Box>
    </Paper>
  );
};
