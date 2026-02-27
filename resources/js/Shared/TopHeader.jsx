import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DRAWER_WIDTH } from '@/Shared/MainMenu';
import { DRAWER_MINI_WIDTH } from '@/Shared/MainMenu';

export default ({ drawerWidth = DRAWER_WIDTH, onMobileMenuOpen, onToggle, desktopOpen }) => {
  const { auth } = usePage().props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);

  const userRole = auth.user.roles?.[0] || '';
  const isSalesSupervisor = userRole === 'sales_supervisor';
  const isSuperAdmin = userRole === 'super_admin';

  const toggleDesktop = () => {
    const next = !desktopOpen;
    setDesktopOpen(next);
    onToggle?.(next ? DRAWER_WIDTH : DRAWER_MINI_WIDTH);
  };

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        // Remove MUI color and border, use Tailwind via className below
        ml: isMobile ? 0 : `${drawerWidth}px`,
        width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin-left', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex: theme.zIndex.drawer - 1,
      }}
      className="bg-white border-b border-gray-200 text-black"
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: '56px !important',
          px: { xs: 2, md: 4 },
          // Remove MUI color, use Tailwind below
        }}
        className="bg-white text-black px-4"
      >
        {/* Left: burger icon always visible */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconButton
            edge="start"
            onClick={isMobile ? onMobileMenuOpen : onToggle}
            sx={{ color: '#000', mr: 1 }} // project black
            aria-label="open menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: '-0.2px' }}
            className="font-semibold text-black"
          >
            Alramz
          </Typography>
        </div>

        {/* Right: user menu */}
        <div>
          <IconButton
            onClick={handleMenu}
            disableRipple
            sx={{
              borderRadius: 2,
              px: 1.5,
              gap: 0.5,
              color: '#374151',
              '&:hover': { bgcolor: '#f3f4f6' },
            }}
            className="rounded-md px-2 gap-1 text-gray-700 hover:bg-gray-100"
          >
            <AccountCircle className="text-gray-400" />
            <Typography variant="body2" sx={{ fontWeight: 500, mx: 0.5 }} className="font-medium mx-1">
              {auth.user.first_name}
              {' '}
              <span className="hidden md:inline">{auth.user.last_name}</span>
            </Typography>
            <KeyboardArrowDownIcon fontSize="small" className="text-gray-400" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 0.5,
                minWidth: 180,
                borderRadius: 2,
                '& .MuiMenuItem-root': {
                  fontSize: '0.875rem',
                  px: 2,
                  py: 1,
                  '&:hover': { bgcolor: '#eef2ff', color: '#4f46e5' },
                },
              },
              className: "bg-white rounded-lg shadow-lg"
            }}
          >
            <MenuItem component={Link} href={route('users.edit', auth.user.id)} onClick={handleClose}>
              My Profile
            </MenuItem>

            {isSalesSupervisor && (
              <MenuItem component={Link} href={route('employees')} onClick={handleClose}>
                Manage Team
              </MenuItem>
            )}

            {isSuperAdmin && (
              <MenuItem component={Link} href={route('users')} onClick={handleClose}>
                Manage Users
              </MenuItem>
            )}

            <MenuItem
              onClick={handleClose}
              className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Link
                href={route('logout')}
                method="post"
                as="button"
                className="w-full text-left block"
                style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
              >
                Logout
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};