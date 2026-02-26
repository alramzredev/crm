import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MainMenu, { DRAWER_WIDTH, DRAWER_MINI_WIDTH } from '@/Shared/MainMenu';
import TopHeader from '@/Shared/TopHeader';
import FlashMessages from '@/Shared/FlashMessages';

export default function Layout({ title, children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [drawerWidth, setDrawerWidth] = useState(DRAWER_WIDTH);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOpen = drawerWidth === DRAWER_WIDTH;

  return (
    <div>
      <Helmet titleTemplate="%s | Alramz CRM" title={title} />

      {/* Navbar — burger icon calls setMobileOpen(true) */}
      <TopHeader
        drawerWidth={isMobile ? 0 : drawerWidth}
        onMobileMenuOpen={() => setMobileOpen(true)}
      />

      {/* Sidebar — receives and controls mobileOpen */}
      <MainMenu
        onToggle={setDrawerWidth}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          ml: isMobile ? 0 : `${drawerWidth}px`,
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: isOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        {/* Spacer for fixed AppBar */}
        <Toolbar sx={{ minHeight: '56px !important' }} />

        <div className="px-4 py-6 md:px-8 md:py-8">
          <FlashMessages />
          {children}
        </div>
      </Box>
    </div>
  );
}