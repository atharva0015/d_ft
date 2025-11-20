import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: '#202020', display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <TopBar />
      <Box sx={{ display: 'flex', flexGrow: 1, width: '100%', height: '100%' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, height: '100%', overflow: 'auto', position: 'relative' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
