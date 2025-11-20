import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Dashboard, Warning, Timeline, Assessment, Bolt } from '@mui/icons-material';
import { useUIStore } from '../../store/uiStore';

const panels = [
  { key: 'metrics', label: 'Metrics', icon: <Dashboard /> },
  { key: 'threats', label: 'Threats', icon: <Warning /> },
  { key: 'events', label: 'Events', icon: <Timeline /> },
  { key: 'probability', label: 'Win Probability', icon: <Assessment /> },
  { key: 'performance', label: 'Performance', icon: <Bolt /> },
];

const Sidebar: React.FC = () => {
  const activePanels = useUIStore((state) => state.activePanels);
  const togglePanel = useUIStore((state) => state.togglePanel);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 220,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 220,
          bgcolor: '#2A2A2A',
          color: '#B8C8D7',
          boxSizing: 'border-box',
          borderRight: '1px solid #202020'
        }
      }}
    >
      <Box sx={{ mt: 8 }}>
        <List>
          {panels.map(panel => (
            <ListItem
              key={panel.key}
              disablePadding
              sx={{
                mb: 1,
              }}
            >
              <ListItemButton
                selected={activePanels.includes(panel.key as any)}
                onClick={() => togglePanel(panel.key as any)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: activePanels.includes(panel.key as any) ? '#202020' : 'inherit'
                }}
              >
                <ListItemIcon sx={{ color: '#FF4628' }}>{panel.icon}</ListItemIcon>
                <ListItemText primary={panel.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
