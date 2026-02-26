import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import MainMenu, { DRAWER_WIDTH, DRAWER_MINI_WIDTH } from '@/Shared/MainMenu';
import FlashMessages from '@/Shared/FlashMessages';
import TopHeader from '@/Shared/TopHeader';
import BottomHeader from '@/Shared/BottomHeader';

export default function Layout({ title, children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerWidth, setDrawerWidth] = useState(DRAWER_WIDTH);

  return (
    <div>
      <Helmet titleTemplate="%s | Alramz CRM" title={title} />
      <div className="flex flex-col h-screen">
        {/* Pass drawerWidth to TopHeader for responsive margin */}
        <div className="md:flex">
          <TopHeader drawerWidth={isMobile ? 0 : drawerWidth} />
          <BottomHeader />
        </div>
        <div className="flex flex-grow overflow-hidden">
          {!isMobile && (
            <MainMenu onToggle={setDrawerWidth} />
          )}
          <Box
            sx={{
              flexGrow: 1,
              ml: isMobile ? 0 : `${drawerWidth}px`,
              transition: theme.transitions.create('margin-left', {
                easing: theme.transitions.easing.sharp,
                duration: drawerWidth === DRAWER_WIDTH
                  ? theme.transitions.duration.enteringScreen
                  : theme.transitions.duration.leavingScreen,
              }),
              overflowY: 'auto',
              overflowX: 'hidden',
              minWidth: 0,
            }}
          >
            <div className="px-4 py-8 md:p-12">
              <FlashMessages />
              {children}
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}