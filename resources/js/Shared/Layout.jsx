import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MainMenu, { DRAWER_WIDTH, DRAWER_MINI_WIDTH } from '@/Shared/MainMenu';
import TopHeader from '@/Shared/TopHeader';
import FlashMessages from '@/Shared/FlashMessages';
import { useTranslation } from 'react-i18next';

export default function Layout({ title, children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { i18n } = useTranslation();

  const [drawerWidth, setDrawerWidth] = useState(DRAWER_WIDTH);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const handleToggleDesktop = () => {
    const next = !desktopOpen;
    setDesktopOpen(next);
    setDrawerWidth(next ? DRAWER_WIDTH : DRAWER_MINI_WIDTH);
  };

  const isOpen = drawerWidth === DRAWER_WIDTH;

  // Determine anchor based on language direction
  const anchor = i18n.dir() === 'rtl' ? 'right' : 'left';

  // Helper for dynamic margin style
  const getMainMargin = () => {
    if (isMobile) return {};
    if (anchor === 'left') return { marginLeft: `${drawerWidth}px` };
    if (anchor === 'right') return { marginRight: `${drawerWidth}px` };
    return {};
  };

  return (
    <div>
      <Helmet titleTemplate="%s | Alramz CRM" title={title} />

      {/* Navbar — burger icon calls setMobileOpen(true) */}
      <TopHeader
        drawerWidth={isMobile ? 0 : drawerWidth}
        onMobileMenuOpen={() => setMobileOpen(true)}
        onToggle={handleToggleDesktop}
        desktopOpen={desktopOpen}
        anchor={anchor}
      />

      {/* Sidebar — receives and controls mobileOpen */}
      <MainMenu
        onToggle={setDrawerWidth}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        desktopOpen={desktopOpen}
        setDesktopOpen={setDesktopOpen}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          ...getMainMargin(),
          transition: theme.transitions.create(
            anchor === 'left' ? 'margin-left' : 'margin-right',
            {
              easing: theme.transitions.easing.sharp,
              duration: isOpen
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }
          ),
          minHeight: '100vh',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Spacer for fixed AppBar */}
        <Toolbar sx={{ minHeight: '56px !important' }} />

        <div className="px-4 py-6 md:px-8 md:py-8 flex-1">
          <FlashMessages />
          {children}
        </div>

        {/* All rights reserved footer */}
        <footer className="w-full text-center py-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Alramz. All rights reserved.
        </footer>
      </Box>
    </div>
  );
}