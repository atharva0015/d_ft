import React, { useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { useSimulationStore } from '../../store/simulationStore';

export const ThreatAssessment: React.FC = () => {
  const { hostileDrones } = useSimulationStore();

  // Sort by threat score
  const sortedThreats = useMemo(() => {
    return [...hostileDrones].sort((a, b) => {
      const stA = a.threatScore?.st_total || 0;
      const stB = b.threatScore?.st_total || 0;
      return stB - stA;
    });
  }, [hostileDrones]);

  const getThreatColor = (st: number) => {
    if (st < 20) return 'success';
    if (st < 40) return 'warning';
    if (st < 80) return 'error';
    return 'error';
  };

  const getThreatLabel = (st: number) => {
    if (st < 20) return 'SAFE ðŸŸ¢';
    if (st < 40) return 'LOW ðŸŸ¡';
    if (st < 80) return 'MEDIUM ðŸŸ ';
    return 'CRITICAL ðŸ”´';
  };

  // Check for unattended threats
  const unattendedThreats = sortedThreats.filter(d => d.unattended);

  return (
    <Box>
      {/* Unattended Threats Alert */}
      {unattendedThreats.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          âš ï¸ {unattendedThreats.length} UNATTENDED THREAT(S)! 
          {unattendedThreats.map(d => ` ${d.id}`)}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">ST Score</TableCell>
              <TableCell align="right">Ptype</TableCell>
              <TableCell align="right">Pprox</TableCell>
              <TableCell align="right">Ccost</TableCell>
              <TableCell>Threat Level</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedThreats.map((drone, index) => {
              const st = drone.threatScore?.st_total || 0;
              const type = drone.type === 'ground-attack' ? 'ðŸ—ï¸ G-ATK' : 'âœˆï¸ A-AIR';

              return (
                <TableRow
                  key={drone.id}
                  sx={{
                    backgroundColor: st > 60 ? '#ffebee' : st > 40 ? '#fff3e0' : 'inherit',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f0f0f0' }
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{drone.id}</TableCell>
                  <TableCell>{type}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: getThreatColor(st) }}>
                    {st.toFixed(1)}
                  </TableCell>
                  <TableCell align="right">{drone.threatScore?.ptype.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell align="right">{drone.threatScore?.pprox.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell align="right">{drone.threatScore?.ccost.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getThreatLabel(st)}
                      color={getThreatColor(st)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{drone.nearestAsset?.distance.toFixed(1)}m</TableCell>
                  <TableCell>
                    {drone.unattended ? (
                      <Chip label="âš ï¸ UNATTENDED" color="error" size="small" />
                    ) : (
                      <Chip label="Engaged" color="success" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
