import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { wsService } from '../../services/websocket.service';

const DEFAULT_POSITION: [number, number, number] = [Math.random() * 800 - 400, 10, Math.random() * 800 - 400];

const DroneSpawner: React.FC = () => {
  const [droneType, setDroneType] = useState<'friendly' | 'hostile-air' | 'hostile-ground'>('friendly');
  const [position, setPosition] = useState<[number, number, number]>(DEFAULT_POSITION);

  const handleTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newType: 'friendly' | 'hostile-air' | 'hostile-ground' | null
  ) => {
    if (newType) setDroneType(newType);
  };

  const spawnDrone = () => {
    wsService.send('command:spawn', { droneType, position });
    setPosition([Math.random() * 800 - 400, 10, Math.random() * 800 - 400] as [number, number, number]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ backgroundColor: '#2A2A2A' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ color: '#FF4628', mb: 1 }}>
            ➕ Spawn Drone
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
              <Typography variant="caption">Type</Typography>
              <ToggleButtonGroup
                color="primary"
                value={droneType}
                exclusive
                onChange={handleTypeChange}
                size="small"
                sx={{ mt: 1 }}
              >
                <ToggleButton value="friendly">Friendly</ToggleButton>
                <ToggleButton value="hostile-air">Hostile Air</ToggleButton>
                <ToggleButton value="hostile-ground">Hostile Ground</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
              <Typography variant="caption">Position</Typography>
              <Box display="flex" gap={1} mt={1}>
                {position.map((coord, i) => (
                  <input
                    type="number"
                    key={i}
                    style={{ width: 60, background: '#202020', color: '#B8C8D7', border: '1px solid #B8C8D7', borderRadius: 4, padding: 2 }}
                    value={coord}
                    onChange={e => {
                      const newPos = [...position];
                      newPos[i] = parseFloat(e.target.value) || 0;
                      setPosition(newPos as [number, number, number]);
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <Button variant="contained" color="primary" onClick={spawnDrone} sx={{ mt: 2 }}>
                Spawn
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DroneSpawner;
