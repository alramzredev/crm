import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MainMenuItem from '@/Shared/MainMenuItem';
import Logo from '@/Shared/Logo';
import { useTranslation } from 'react-i18next';

export const DRAWER_WIDTH = 240;
export const DRAWER_MINI_WIDTH = 64;

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: DRAWER_MINI_WIDTH,
});

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: 0,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    borderRight: 'none',
    boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
    backgroundColor: '#000', // <-- force black background
    color: '#fff',           // <-- force white text
    ...(open ? openedMixin(theme) : closedMixin(theme)),
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 2),
  minHeight: 64,
  borderBottom: '1px solid rgba(255,255,255,0.1)',
}));

export default function MainMenu({ className, onToggle, mobileOpen, setMobileOpen, desktopOpen, setDesktopOpen }) {
  const { auth } = usePage().props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, i18n } = useTranslation();

  const drawerOpen = isMobile ? mobileOpen : desktopOpen;

  const toggleDesktop = () => {
    const next = !desktopOpen;
    setDesktopOpen(next);
    onToggle?.(next ? DRAWER_WIDTH : DRAWER_MINI_WIDTH);
  };

  const can = (permission) => auth.user?.permissions?.includes(permission) || false;

  const menuItems = [
    { text: t('dashboard'), link: 'dashboard', icon: 'dashboard' },
    { text: t('projects'), link: 'projects', icon: 'office', permission: 'projects.view' },
    { text: t('import_batches'), link: 'import-batches', icon: 'import-batch', permission: 'projects.import' },
    { text: t('leads'), link: 'leads', icon: 'users', permission: 'leads.view' },
    { text: t('units'), link: 'units', icon: 'store-front', permission: 'units.view' }, 
    { text: t('reservations'), link: 'reservations', icon: 'book', permission: 'reservations.view' },
    { text: t('owners'), link: 'owners', icon: 'users', permission: 'owners.view' },
    { text: t('users'), link: 'users', icon: 'users', permission: 'users.view' },
  ];

  // Determine anchor based on language direction
  const anchor = i18n.dir() === 'rtl' ? 'right' : 'left';

  const drawerContent = (
    <>
      <DrawerHeader>
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.5px',
            // Remove color and opacity here, handled by Tailwind below
            // color: '#fff',
            // opacity: drawerOpen ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
          className={`font-bold tracking-tight transition-opacity duration-200 ${drawerOpen ? 'opacity-100' : 'opacity-0'} text-white`}
        >
          <Logo
            style={{
              height: 32,
              width: drawerOpen ? 120 : 32,
              objectFit: 'contain',
              objectPosition: 'left center',
              transition: 'width 0.3s ease',
              flexShrink: 0,
            }}
          />
        </Typography>

        {!isMobile && (
          <IconButton
            onClick={toggleDesktop}
            size="small"
            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            {desktopOpen
              ? (anchor === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />)
              : (anchor === 'left' ? <ChevronRightIcon /> : <ChevronLeftIcon />)
            }
          </IconButton>
        )}

        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            size="small"
            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            {anchor === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </DrawerHeader>

      <List sx={{ px: 1, pt: 1, flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {menuItems.map(
          ({ permission, text, link, icon }) =>
            (!permission || can(permission)) && (
              <MainMenuItem key={link} text={text} link={link} icon={icon} drawerOpen={drawerOpen} />
            )
        )}
        {auth.roles?.includes('sales_supervisor') && (
          <MainMenuItem text="Team" link="employees" icon="users" drawerOpen={drawerOpen} />
        )}
      </List>
    </>
  );

  return (
    <Box className={className}>
      {isMobile ? (
        <MuiDrawer
          anchor={anchor}
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              borderRight: anchor === 'left' ? 'none' : undefined,
              borderLeft: anchor === 'right' ? 'none' : undefined,
              boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
              backgroundColor: '#000', // <-- force black background
              color: '#fff',           // <-- force white text
            },
          }}
        >
          {drawerContent}
        </MuiDrawer>
      ) : (
        <StyledDrawer
          anchor={anchor}
          variant="permanent"
          open={desktopOpen}
          sx={{
            '& .MuiDrawer-paper': {
              borderRight: anchor === 'left' ? 'none' : undefined,
              borderLeft: anchor === 'right' ? 'none' : undefined,
              backgroundColor: '#000', // <-- force black background
              color: '#fff',           // <-- force white text
            },
          }}
        >
          {drawerContent}
        </StyledDrawer>
      )}
    </Box>
  );
}