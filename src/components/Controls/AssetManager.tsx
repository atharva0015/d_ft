import React, { useState } from 'react';
import { Box, Button, Paper, List, ListItem, ListItemText, Chip, TextField } from '@mui/material';
import { useSimulationStore } from '../../store/simulationStore';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';

export const AssetManager: React.FC = () => {
  const { assets, addAsset, updateAsset } = useSimulationStore();
  const [assetName, setAssetName] = useState('');
  const [isMoving, setIsMoving] = useState<string | null>(null);

  const handlePinAsset = () => {
    if (assetName) {
      addAsset({
        id: `ASSET-${assets.length + 1}`,
        position: { x: 0, y: 0, z: 0 },
        isMoving: false,
        isPinned: true,
        name: assetName
      });
      setAssetName('');
    }
  };

  const handleChaseMode = (assetId: string) => {
    setIsMoving(isMoving === assetId ? null : assetId);
    const asset = assets.find((a: any) => a.id === assetId);
    if (asset) {
      updateAsset(assetId, { ...asset, isMoving: isMoving !== assetId });
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          placeholder="Asset name"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<PushPinOutlinedIcon />}
          onClick={handlePinAsset}
        >
          Pin Asset
        </Button>
      </Box>

      <List dense>
        {assets.map((asset: any) => (
          <ListItem key={asset.id}>
            <ListItemText
              primary={`${asset.id} - ${asset.name || 'Unnamed'}`}
              secondary={`Pos: (${asset.position.x.toFixed(0)}, ${asset.position.y.toFixed(0)}, ${asset.position.z.toFixed(0)})`}
            />
            <Button
              size="small"
              variant={asset.isMoving ? 'contained' : 'outlined'}
              startIcon={<LocationSearchingIcon />}
              onClick={() => handleChaseMode(asset.id)}
              sx={{ ml: 1 }}
            >
              {asset.isMoving ? 'Moving' : 'Chase'}
            </Button>
            <Chip
              label={asset.isThreatened ? 'âš ï¸ THREATENED' : 'âœ“ SAFE'}
              color={asset.isThreatened ? 'error' : 'success'}
              size="small"
              sx={{ ml: 1 }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
