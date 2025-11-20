export const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toFixed(decimals);
  };
  
  export const formatPercent = (value: number): string => {
    return `${Math.round(value)}%`;
  };
  
  export const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };
  
  export const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };
  
  export const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  