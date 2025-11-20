import { createTheme } from '@mui/material/styles';

export const alchiFlyTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF4628', // Aa - Primary accent
      light: '#FF6B52',
      dark: '#CC381F',
    },
    secondary: {
      main: '#B8C8D7', // Xx - Secondary accent
      light: '#D4E0EB',
      dark: '#93A3B2',
    },
    background: {
      default: '#202020', // Ff - Dark background
      paper: '#2A2A2A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B8C8D7',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FFA726',
    },
    error: {
      main: '#FF4628',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#2A2A2A',
        },
      },
    },
  },
});

// Drone colors
export const DRONE_COLORS = {
  FRIENDLY: '#1E90FF', // Blue
  HOSTILE_AIR: '#FF0000', // Red
  HOSTILE_GROUND: '#FF0000', // Red (with white spots)
  SPOT_COLOR: '#FFFFFF', // White spots for ground attack
};

// Threat score color mapping
export const THREAT_COLORS = {
  SAFE: '#4CAF50', // Green (0-20)
  LOW: '#8BC34A', // Yellow-Green (21-40)
  MEDIUM: '#FFC107', // Yellow (41-60)
  HIGH: '#FF9800', // Orange (61-80)
  CRITICAL: '#FF4628', // Red (81-100)
};

export const getThreatColor = (ST: number): string => {
  if (ST <= 20) return THREAT_COLORS.SAFE;
  if (ST <= 40) return THREAT_COLORS.LOW;
  if (ST <= 60) return THREAT_COLORS.MEDIUM;
  if (ST <= 80) return THREAT_COLORS.HIGH;
  return THREAT_COLORS.CRITICAL;
};
