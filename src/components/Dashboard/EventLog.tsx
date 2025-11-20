import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { useMetricsStore } from '../../store/metricsStore';
import { formatTime } from '../../utils/formatters';

const EventLog: React.FC = () => {
  const events = useMetricsStore((state) => state.events);
  const clearEvents = useMetricsStore((state) => state.clearEvents);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredEvents = events.filter((event) => {
    const matchesFilter = filter === 'all' || event.severity === filter;
    const matchesSearch =
      search === '' ||
      event.message.toLowerCase().includes(search.toLowerCase()) ||
      event.droneId?.includes(search);
    return matchesFilter && matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return '#FF4628';
      case 'warning':
        return '#FFC107';
      case 'success':
        return '#4CAF50';
      default:
        return '#B8C8D7';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'spawn':
        return '➕';
      case 'destroy':
        return '💥';
      case 'engage':
        return '⚔️';
      case 'rtb':
        return '🔙';
      case 'state_change':
        return '🔄';
      case 'asset_damage':
        return '🛡️';
      default:
        return '📌';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#FF4628' }}>
          📜 Event Log
        </Typography>
        <IconButton onClick={clearEvents} size="small" sx={{ color: '#B8C8D7' }}>
          <ClearIcon />
        </IconButton>
      </Box>

      <Card sx={{ backgroundColor: '#2A2A2A' }}>
        <CardContent>
          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#202020',
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Severity</InputLabel>
              <Select
                value={filter}
                label="Severity"
                onChange={(e) => setFilter(e.target.value)}
                sx={{ backgroundColor: '#202020' }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Event list */}
          <List
            sx={{
              maxHeight: 400,
              overflow: 'auto',
              '& .MuiListItem-root': {
                borderBottom: '1px solid #202020',
              },
            }}
          >
            {filteredEvents.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No events"
                  secondary="Events will appear here as the simulation runs"
                  primaryTypographyProps={{ color: '#B8C8D7' }}
                  secondaryTypographyProps={{ color: '#666' }}
                />
              </ListItem>
            ) : (
              filteredEvents.map((event) => (
                <ListItem key={event.id} alignItems="flex-start" className="slide-in">
                  <Box sx={{ mr: 2, fontSize: '20px' }}>{getEventIcon(event.type)}</Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: '#FFF', flexGrow: 1 }}>
                          {event.message}
                        </Typography>
                        <Chip
                          label={event.severity}
                          size="small"
                          sx={{
                            backgroundColor: getSeverityColor(event.severity),
                            color: '#FFF',
                            fontSize: '10px',
                            height: 20,
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: '#B8C8D7' }}>
                        {formatTime(event.timestamp)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventLog;
