import React, { useMemo } from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField
} from '@mui/material';
import { useSimulationStore } from '../../store/simulationStore';

export const DroneLogViewer: React.FC = () => {
  const store = useSimulationStore();
  const eventLogs = (store as any).eventLogs ?? [];
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const filteredLogs = useMemo(() => {
    return eventLogs
      .filter((log: { type: string; }) => filter === 'all' || log.type === filter)
      .filter((log: { message: string; }) => log.message.toLowerCase().includes(search.toLowerCase()))
      .slice(-50); // Last 50 events
  }, [eventLogs, filter, search]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'engagement':
        return 'error';
      case 'threat':
        return 'warning';
      case 'state_change':
        return 'info';
      case 'asset_threatened':
        return 'error';
      case 'neutralized':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Event Logs</Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Box>

      <Box
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: 1,
          p: 1
        }}
      >
        <List dense>
          {filteredLogs.map((log: { type: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; message: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; timestamp: number; }, idx: number) => (
            <ListItem key={idx} sx={{ py: 1 }}>
              <Chip
                label={log.type}
                color={getLogColor(typeof log.type === 'string' ? log.type : String(log.type))}
                size="small"
                sx={{ mr: 1 }}
              />
              <ListItemText
                primary={log.message}
                secondary={formatTime(log.timestamp)}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};
