import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Slider,
  Typography
} from '@mui/material';
import { DroneData } from '../../types/drone';
import { useSimulationStore } from '../../store/simulationStore';

interface DroneEditorProps {
  drone: DroneData | null;
  open: boolean;
  onClose: () => void;
}

export const DroneEditor: React.FC<DroneEditorProps> = ({ drone, open, onClose }) => {
  const { updateFriendlyDrone } = useSimulationStore();
  const [editedDrone, setEditedDrone] = useState<DroneData | null>(drone);

  if (!editedDrone) return null;

  const handleSave = () => {
    if (editedDrone) {
      updateFriendlyDrone(editedDrone);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Drone: {editedDrone.id}</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* ID */}
          <TextField
            fullWidth
            label="Drone ID"
            value={editedDrone.id}
            disabled
            size="small"
          />

          {/* Health */}
          <Box>
            <Typography gutterBottom>Health: {editedDrone.health}%</Typography>
            <Slider
              value={editedDrone.health}
              onChange={(e, value) =>
                setEditedDrone({ ...editedDrone, health: value as number })
              }
              min={0}
              max={100}
              marks={[
                { value: 0, label: '0%' },
                { value: 100, label: '100%' }
              ]}
            />
          </Box>

          {/* Ammo */}
          <Box>
            <Typography gutterBottom>Ammo: {editedDrone.ammo}/10</Typography>
            <Slider
              value={editedDrone.ammo || 0}
              onChange={(e, value) =>
                setEditedDrone({ ...editedDrone, ammo: value as number })
              }
              min={0}
              max={10}
              marks={true}
            />
          </Box>

          {/* Speed */}
          <TextField
            fullWidth
            label="Speed (m/s)"
            type="number"
            value={editedDrone.speed || 10}
            onChange={(e) =>
              setEditedDrone({
                ...editedDrone,
                speed: parseFloat(e.target.value)
              })
            }
            size="small"
            inputProps={{ step: 0.1, min: 1, max: 50 }}
          />

          {/* Sensor Range */}
          <TextField
            fullWidth
            label="Sensor Range (m)"
            type="number"
            value={editedDrone.sensorRange || 100}
            onChange={(e) =>
              setEditedDrone({
                ...editedDrone,
                sensorRange: parseFloat(e.target.value)
              })
            }
            size="small"
            inputProps={{ step: 10, min: 50, max: 500 }}
          />

          {/* Engagement Range */}
          <TextField
            fullWidth
            label="Engagement Range (m)"
            type="number"
            value={editedDrone.engagementRange || 50}
            onChange={(e) =>
              setEditedDrone({
                ...editedDrone,
                engagementRange: parseFloat(e.target.value)
              })
            }
            size="small"
            inputProps={{ step: 5, min: 10, max: 200 }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
