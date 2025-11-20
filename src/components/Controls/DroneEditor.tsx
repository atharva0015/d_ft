import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Box, Card, CardContent, Typography, Slider, Button } from '@mui/material';

const DroneEditor: React.FC = () => {
  const selectedDroneId = null; // Replace with useUIStore if selection state is implemented
  const drones = useSimulationStore((state) => state.drones);
  const updateDrone = useSimulationStore((state) => state.updateDrone);
  const removeDrone = useSimulationStore((state) => state.removeDrone);

  // Find selected drone
  const drone = drones.find((d) => d.id === selectedDroneId);

  if (!drone) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ backgroundColor: '#2A2A2A' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ color: '#FF4628', mb: 1 }}>
            ✏️ Edit Drone Specs
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
              <Typography variant="caption">Health</Typography>
              <Slider
                min={0}
                max={drone.maxHealth}
                value={drone.health}
                onChange={(_, value) => updateDrone(drone.id, { health: Number(value) })}
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
              <Typography variant="caption">Ammo</Typography>
              <Slider
                min={0}
                max={drone.maxAmmo}
                value={drone.ammo}
                onChange={(_, value) => updateDrone(drone.id, { ammo: Number(value) })}
              />
            </Box>
            {/* Add more sliders as needed */}
            <Box sx={{ flex: '1 1 100%' }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeDrone(drone.id)}
                sx={{ mt: 1 }}
              >
                Remove Drone
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DroneEditor;
