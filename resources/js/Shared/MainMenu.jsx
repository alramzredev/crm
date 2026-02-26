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
  // Wrapper takes NO space in flex layout — paper is position:fixed anyway
  width: 0,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    backgroundColor: '#000',
    color: '#fff',
    borderRight: 'none',
    boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
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

export default function MainMenu({ className, onToggle, mobileOpen, setMobileOpen }) {
  const { auth } = usePage().props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [desktopOpen, setDesktopOpen] = useState(true);

  const drawerOpen = isMobile ? mobileOpen : desktopOpen;

  const toggleDesktop = () => {
    const next = !desktopOpen;
    setDesktopOpen(next);
    onToggle?.(next ? DRAWER_WIDTH : DRAWER_MINI_WIDTH);
  };

  const can = (permission) => auth.user?.permissions?.includes(permission) || false;

  const menuItems = [
    { text: 'Dashboard', link: 'dashboard', icon: 'dashboard' },
    { text: 'Projects', link: 'projects', icon: 'office', permission: 'projects.view' },
    { text: 'Import Batches', link: 'import-batches', icon: 'import-batch', permission: 'projects.import' },
    { text: 'Leads', link: 'leads', icon: 'users', permission: 'leads.view' },
    { text: 'Reservations', link: 'reservations', icon: 'book', permission: 'reservations.view' },
    { text: 'Owners', link: 'owners', icon: 'users', permission: 'owners.view' },
    { text: 'Users', link: 'users', icon: 'users', permission: 'users.view' },
  ];

  const drawerContent = (
    <>
      <DrawerHeader>
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: '#fff',
            opacity: drawerOpen ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          Alramz CRM
        </Typography>

        {!isMobile && (
          <IconButton
            onClick={toggleDesktop}
            size="small"
            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            {desktopOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}

        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            size="small"
            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <ChevronLeftIcon />
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
      {/* Remove the mobile hamburger button here, handled in TopHeader */}
      {isMobile ? (
        <MuiDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              backgroundColor: '#000',
              color: '#fff',
              borderRight: 'none',
              boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
            },
          }}
        >
          {drawerContent}
        </MuiDrawer>
      ) : (
        <StyledDrawer variant="permanent" open={desktopOpen}>
          {drawerContent}
        </StyledDrawer>
      )}
    </Box>
  );
}