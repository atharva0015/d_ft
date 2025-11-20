import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Box, Card, CardContent, Typography, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';

const AssetManager: React.FC = () => {
  const assets = useSimulationStore((state) => state.assets);
  const updateAsset = useSimulationStore((state) => state.updateAsset);

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ backgroundColor: '#2A2A2A' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ color: '#FF4628', mb: 1 }}>
            🛡️ Asset Management
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {assets.map(asset => (
              <Box key={asset.id} sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#B8C8D7' }}>
                  {asset.name}
                </Typography>
                <TextField
                  label="Pinned"
                  value={asset.isPinned ? 'Yes' : 'No'}
                  InputProps={{ readOnly: true }}
                  size="small"
                  sx={{ width: 80, background: '#202020', color: '#B8C8D7', ml: 2 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={asset.isChaseMode}
                      onChange={() => updateAsset(asset.id, { isChaseMode: !asset.isChaseMode })}
                      sx={{ color: '#FF4628' }}
                    />
                  }
                  label="Chase Mode"
                />
                <Button
                  size="small"
                  variant="contained"
                  color={asset.isChaseMode ? "primary" : "secondary"}
                  onClick={() =>
                    updateAsset(asset.id, { isChaseMode: !asset.isChaseMode })
                  }
                >
                  Toggle Chase
                </Button>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AssetManager;
