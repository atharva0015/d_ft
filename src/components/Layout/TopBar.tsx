import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const TopBar: React.FC = () => {
  return (
    <AppBar position="fixed" sx={{ bgcolor: '#FF4628', height: 56 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ color: '#FFF', fontWeight: 600 }}>
          AlchiFly: Drone Swarm Simulation
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body2" sx={{ color: '#B8C8D7', fontWeight: 500 }}>
          SIH2025 | Desktop Only | v1.0
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
