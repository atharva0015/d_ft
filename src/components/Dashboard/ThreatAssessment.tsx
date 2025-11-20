import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { useSimulationStore } from '../../store/simulationStore';
import { calculateThreatScore } from '../../utils/threatCalculator';
import { getThreatColor } from '../../styles/theme';
import { formatDistance } from '../../utils/formatters';

const ThreatAssessment: React.FC = () => {
  const drones = useSimulationStore((state) => state.drones);
  const assets = useSimulationStore((state) => state.assets);
  const config = useSimulationStore((state) => state.config);

  // Calculate threat scores for all hostile drones
  const threats = useMemo(() => {
    const hostileDrones = drones.filter((d) => d.type !== 'friendly');
    const friendlyDrones = drones.filter((d) => d.type === 'friendly');

    return hostileDrones
      .map((drone) => {
        const threat = calculateThreatScore(
          drone,
          assets,
          friendlyDrones,
          config.weights
        );
        return {
          droneId: drone.id,
          type: drone.type,
          fsmState: drone.fsmState,
          ...threat,
        };
      })
      .sort((a, b) => b.ST - a.ST); // Sort by threat score descending
  }, [drones, assets, config.weights]);

  const getThreatLevel = (ST: number): string => {
    if (ST >= 80) return 'CRITICAL';
    if (ST >= 60) return 'HIGH';
    if (ST >= 40) return 'MEDIUM';
    if (ST >= 20) return 'LOW';
    return 'MINIMAL';
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#FF4628' }}>
        ⚠️ Threat Assessment
      </Typography>

      <Card sx={{ backgroundColor: '#2A2A2A' }}>
        <CardContent>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#202020', color: '#B8C8D7' }}>
                    Drone ID
                  </TableCell>
                  <TableCell sx={{ backgroundColor: '#202020', color: '#B8C8D7' }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ backgroundColor: '#202020', color: '#B8C8D7' }}>
                    ST Score
                  </TableCell>
                  <TableCell sx={{ backgroundColor: '#202020', color: '#B8C8D7' }}>
                    Level
                  </TableCell>
                  <TableCell sx={{ backgroundColor: '#202020', color: '#B8C8D7' }}>
                    Distance
                  </TableCell>
                  <TableCell sx={{ backgroundColor: '#202020', color: '#B8C8D7' }}>
                    State
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {threats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ color: '#B8C8D7' }}>
                      No hostile drones detected
                    </TableCell>
                  </TableRow>
                ) : (
                  threats.map((threat) => (
                    <TableRow key={threat.droneId} hover>
                      <TableCell sx={{ color: '#FFF', fontFamily: 'monospace' }}>
                        {threat.droneId.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={threat.type === 'hostile-air' ? 'AIR' : 'GROUND'}
                          size="small"
                          sx={{
                            backgroundColor:
                              threat.type === 'hostile-ground' ? '#FF4628' : '#FF0000',
                            color: '#FFF',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: getThreatColor(threat.ST),
                            color: '#FFF',
                            fontWeight: 'bold',
                          }}
                        >
                          {threat.ST.toFixed(1)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: getThreatColor(threat.ST),
                            fontWeight: 'bold',
                          }}
                        >
                          {getThreatLevel(threat.ST)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#B8C8D7' }}>
                        {formatDistance(threat.distance)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={threat.fsmState}
                          size="small"
                          sx={{
                            backgroundColor:
                              threat.fsmState === 'ENGAGE'
                                ? '#FF4628'
                                : threat.fsmState === 'ASSESS_THREAT'
                                ? '#FFC107'
                                : '#4CAF50',
                            color: '#FFF',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Breakdown of top threat */}
          {threats.length > 0 && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#202020', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#FF4628' }}>
                Top Threat Breakdown
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Type Priority
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {threats[0].breakdown.typeContribution.toFixed(1)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Proximity Priority
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {threats[0].breakdown.proximityContribution.toFixed(1)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Engagement Cost
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    -{threats[0].breakdown.costContribution.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ThreatAssessment;
