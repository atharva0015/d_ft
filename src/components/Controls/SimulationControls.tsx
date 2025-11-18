import React, { useCallback, useMemo } from 'react';
import {
  Paper,
  Box,
  Button,
  Slider,
  Typography,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Card,
  Chip,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as ResetIcon,
  Speed as SpeedIcon,
  Settings as SettingsIcon,
  GetApp as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useSimulationStore } from '../../store/simulationStore';
import { useSimulationService } from '../../services/simulationService';

interface SimulationControlsProps {
  onViewModeChange?: (mode: 'free' | 'topdown' | 'follow' | 'focus') => void;
  onDifficultyChange?: (difficulty: 'easy' | 'normal' | 'hard' | 'expert') => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  onViewModeChange,
  onDifficultyChange
}) => {
  const {
    isPlaying,
    setIsPlaying,
    currentTime,
    totalTime,
    speed,
    setSpeed,
    setCurrentTime,
    difficulty,
    setDifficulty,
    scenarioName,
    eventLogs
  } = useSimulationStore();

  const { pauseSimulation, resumeSimulation, resetSimulation, saveScenario, exportData } =
    useSimulationService();

  const [viewMode, setViewMode] = React.useState<'free' | 'topdown' | 'follow' | 'focus'>('free');
  const [showSettings, setShowSettings] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [visualizationOptions, setVisualizationOptions] = React.useState({
    showThreatZones: true,
    showPathfinding: false,
    showHealthBars: true,
    showStateLabels: true,
    showEngagementBeams: true,
    showHUD: true,
    enableSound: true,
    showTrails: false,
    showSensorRanges: false,
    showRangeIndicators: true
  });

  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseSimulation();
      setIsPlaying(false);
    } else {
      resumeSimulation();
      setIsPlaying(true);
    }
  }, [isPlaying, pauseSimulation, resumeSimulation, setIsPlaying]);

  // Handle reset
  const handleReset = useCallback(async () => {
    if (window.confirm('Reset simulation? This cannot be undone.')) {
      await resetSimulation();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [resetSimulation, setIsPlaying, setCurrentTime]);

  // Handle time slider change
  const handleTimeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (typeof newValue === 'number') {
        setCurrentTime(newValue);
        // Pause when scrubbing
        if (isPlaying) {
          pauseSimulation();
          setIsPlaying(false);
        }
      }
    },
    [setCurrentTime, isPlaying, pauseSimulation, setIsPlaying]
  );

  // Handle speed change
  const handleSpeedChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      if (typeof newValue === 'number') {
        setSpeed(newValue);
      }
    },
    [setSpeed]
  );

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (newMode: string) => {
      setViewMode(newMode as any);
      onViewModeChange?.(newMode as any);
    },
    [onViewModeChange]
  );

  // Handle difficulty change
  const handleDifficultyChange = useCallback(
    (newDifficulty: string) => {
      setDifficulty(newDifficulty as any);
      onDifficultyChange?.(newDifficulty as any);
    },
    [setDifficulty, onDifficultyChange]
  );

  // Handle visualization option toggle
  const handleVisualizationToggle = useCallback(
    (option: keyof typeof visualizationOptions) => {
      setVisualizationOptions(prev => ({
        ...prev,
        [option]: !prev[option]
      }));
    },
    []
  );

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      const data = {
        scenario: scenarioName,
        duration: currentTime,
        difficulty,
        eventCount: eventLogs.length,
        timestamp: new Date().toISOString()
      };
      await exportData(data);
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [scenarioName, currentTime, difficulty, eventLogs, exportData]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return totalTime > 0 ? (currentTime / totalTime) * 100 : 0;
  }, [currentTime, totalTime]);

  // Speed presets
  const speedPresets = [
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '4x', value: 4 }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Main Control Card */}
      <Card sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          Simulation Controls
        </Typography>

        {/* Scenario Info */}
        <Box sx={{ mb: 2, p: 1, backgroundColor: '#ffffff', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Scenario:</strong> {scenarioName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Difficulty:</strong>
            <Select
              value={difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              size="small"
              sx={{ ml: 1, minWidth: 120 }}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
              <MenuItem value="expert">Expert</MenuItem>
            </Select>
          </Typography>
        </Box>

        {/* Play/Pause Controls */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
          <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlayPause}
              startIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
              sx={{ minWidth: 100 }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </Tooltip>

          <Tooltip title="Reset simulation">
            <Button
              variant="outlined"
              onClick={handleReset}
              startIcon={<ResetIcon />}
            >
              Reset
            </Button>
          </Tooltip>

          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="textSecondary">
              {formatTime(currentTime)} / {formatTime(totalTime)}
            </Typography>
          </Box>

          <Tooltip title="Settings">
            <IconButton onClick={() => setShowSettings(true)}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Time Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Slider
            value={currentTime}
            onChange={handleTimeChange}
            min={0}
            max={totalTime}
            step={0.1}
            sx={{
              '& .MuiSlider-thumb': {
                backgroundColor: '#FF4500',
                '&:hover': { boxShadow: '0 0 0 8px rgba(255, 69, 0, 0.16)' }
              },
              '& .MuiSlider-track': {
                backgroundColor: '#FF4500'
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption">{formatTime(0)}</Typography>
            <Typography variant="caption" sx={{ textAlign: 'center' }}>
              {progressPercentage.toFixed(1)}%
            </Typography>
            <Typography variant="caption">{formatTime(totalTime)}</Typography>
          </Box>
        </Box>

        {/* Speed Control */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <SpeedIcon fontSize="small" />
            <Typography variant="body2">
              Playback Speed: <strong>{speed.toFixed(1)}x</strong>
            </Typography>
          </Box>
          <Slider
            value={speed}
            onChange={handleSpeedChange}
            min={0.5}
            max={4}
            step={0.25}
            marks={speedPresets.map(preset => ({
              value: preset.value,
              label: preset.label
            }))}
            sx={{
              '& .MuiSlider-thumb': {
                backgroundColor: '#1E90FF',
                '&:hover': { boxShadow: '0 0 0 8px rgba(30, 144, 255, 0.16)' }
              }
            }}
          />
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
            {speedPresets.map(preset => (
              <Button
                key={preset.value}
                size="small"
                variant={speed === preset.value ? 'contained' : 'outlined'}
                onClick={() => setSpeed(preset.value)}
                sx={{ minWidth: 50 }}
              >
                {preset.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* View Mode Selector */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Camera View Mode
          </Typography>
          <Select
            value={viewMode}
            onChange={(e) => handleViewModeChange(e.target.value)}
            fullWidth
          >
            <MenuItem value="free">Free Orbit</MenuItem>
            <MenuItem value="topdown">Top-Down View</MenuItem>
            <MenuItem value="follow">Drone Follow</MenuItem>
            <MenuItem value="focus">Asset Focus</MenuItem>
          </Select>
        </Box>

        {/* Export/Share Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => setShowExportDialog(true)}
            fullWidth
          >
            Export
          </Button>
          <Tooltip title="Copy scenario link">
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              fullWidth
            >
              Share
            </Button>
          </Tooltip>
        </Box>
      </Card>

      {/* Visualization Options Card */}
      <Card sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          Display Options
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(visualizationOptions).map(([key, value]) => (
            <Box key={key} sx={{ width: { xs: '100%', sm: 'calc(50% - 4px)' } }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={value}
                    onChange={() =>
                      handleVisualizationToggle(key as keyof typeof visualizationOptions)
                    }
                  />
                }
                label={formatOptionLabel(key)}
              />
            </Box>
          ))}
        </Box>
      </Card>

      {/* Status Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' } }}>
          <Card sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Status
            </Typography>
            <Chip
              label={isPlaying ? 'RUNNING ▶️' : 'PAUSED ⏸️'}
              color={isPlaying ? 'success' : 'default'}
              size="small"
            />
          </Card>
        </Box>

        <Box sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' } }}>
          <Card sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Speed
            </Typography>
            <Typography variant="h6">{speed.toFixed(1)}x</Typography>
          </Card>
        </Box>

        <Box sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' } }}>
          <Card sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Progress
            </Typography>
            <Typography variant="h6">{progressPercentage.toFixed(0)}%</Typography>
          </Card>
        </Box>

        <Box sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' } }}>
          <Card sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Remaining
            </Typography>
            <Typography variant="body2">
              {formatTime(totalTime - currentTime)}
            </Typography>
          </Card>
        </Box>
      </Box>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Simulation Settings</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Difficulty Info */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Current Difficulty: <strong>{difficulty.toUpperCase()}</strong>
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {getDifficultyDescription(difficulty)}
              </Typography>
            </Box>

            {/* Advanced Settings */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Advanced Settings
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable physics simulation"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable AI decision-making"
              />
              <FormControlLabel
                control={<Switch />}
                label="Enable recording"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Simulation Data</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Export options:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button variant="outlined" fullWidth onClick={handleExport}>
              📊 Export as CSV
            </Button>
            <Button variant="outlined" fullWidth>
              📹 Save as Video
            </Button>
            <Button variant="outlined" fullWidth>
              📋 Export Event Log
            </Button>
            <Button variant="outlined" fullWidth>
              📈 Export Statistics
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleExport}>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper function to format option labels
function formatOptionLabel(key: string): string {
  const labels: { [key: string]: string } = {
    showThreatZones: '🔴 Show Threat Zones',
    showPathfinding: '🔵 Show Pathfinding',
    showHealthBars: '❤️ Show Health Bars',
    showStateLabels: '🏷️ Show State Labels',
    showEngagementBeams: '⚡ Show Engagement Beams',
    showHUD: '📊 Show HUD',
    enableSound: '🔊 Enable Sound',
    showTrails: '🌌 Show Drone Trails',
    showSensorRanges: '📡 Show Sensor Ranges',
    showRangeIndicators: '📏 Show Range Indicators'
  };
  return labels[key] || key;
}

// Helper function to get difficulty description
function getDifficultyDescription(difficulty: string): string {
  const descriptions: { [key: string]: string } = {
    easy: 'More friendly drones, fewer hostiles. Great for learning the mechanics.',
    normal: 'Balanced scenario. Recommended for standard gameplay.',
    hard: 'Fewer friendly drones, advanced hostile tactics. For experienced players.',
    expert: 'Minimal friendly drones, maximum hostiles. Only for experts.'
  };
  return descriptions[difficulty] || '';
}
