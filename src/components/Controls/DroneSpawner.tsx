import React, { useState } from 'react';
import { Box, Button, Select, MenuItem, TextField, Paper } from '@mui/material';
import { useSimulationStore } from '../../store/simulationStore';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export const DroneSpawner: React.FC = () => {
  const { addFriendlyDrone, addHostileDrone, setIsDragging } = useSimulationStore();
  const [droneType, setDroneType] = useState<'friendly' | 'hostile-aa' | 'hostile-ga'>('friendly');
  const [quantity, setQuantity] = useState(1);
  const [isDraggingMode, setIsDraggingMode] = useState(false);

  const handleSpawn = () => {
    for (let i = 0; i < quantity; i++) {
      const randomPos = {
        x: Math.random() * 200 - 100,
        y: Math.random() * 50 + 20,
        z: Math.random() * 200 - 100
      };

      if (droneType === 'friendly') {
        addFriendlyDrone({
          position: randomPos,
          type: 'friendly'
        } as any);
      } else {
        const type = droneType === 'hostile-aa' ? 'air-to-air' : 'ground-attack';
        addHostileDrone({
          position: randomPos,
          type: type
        } as any);
      }
    }
  };

  const handleDragMode = () => {
    setIsDraggingMode(!isDraggingMode);
    setIsDragging(!isDraggingMode);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Select
          value={droneType}
          onChange={(e) => setDroneType(e.target.value as any)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="friendly">Friendly Drone</MenuItem>
          <MenuItem value="hostile-aa">Hostile (Air-to-Air)</MenuItem>
          <MenuItem value="hostile-ga">Hostile (Ground-Attack)</MenuItem>
        </Select>

        <TextField
          type="number"
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          inputProps={{ min: 1, max: 10 }}
          sx={{ width: 100 }}
        />

        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleSpawn}
        >
          Spawn
        </Button>

        <Button
          variant={isDraggingMode ? 'contained' : 'outlined'}
          onClick={handleDragMode}
        >
          {isDraggingMode ? 'Dragging: ON' : 'Drag Mode'}
        </Button>
      </Box>
    </Paper>
  );
};
