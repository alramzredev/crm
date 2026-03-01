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
import { useTranslation } from 'react-i18next';

export default ({ drawerWidth = DRAWER_WIDTH, onMobileMenuOpen, onToggle, desktopOpen, anchor = 'left' }) => {
  const { auth } = usePage().props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);

  const userRole = auth.user.roles?.[0] || '';
  const isSalesSupervisor = userRole === 'sales_supervisor';
  const isSuperAdmin = userRole === 'super_admin';

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { i18n, t } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // Restore the language toggle handler
  const handleLangToggle = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', nextLang); // Store language in localStorage
  };

  // Compute dynamic style for AppBar based on anchor
  const getAppBarStyle = () => {
    if (isMobile) return { width: '100%' };
    if (anchor === 'left') {
      return {
        ml: `${drawerWidth}px`,
        width: `calc(100% - ${drawerWidth}px)`
      };
    }
    if (anchor === 'right') {
      return {
        mr: `${drawerWidth}px`,
        width: `calc(100% - ${drawerWidth}px)`
      };
    }
    return {};
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        ...getAppBarStyle(),
        transition: theme.transitions.create(
          anchor === 'left' ? ['margin-left', 'width'] : ['margin-right', 'width'],
          {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }
        ),
        zIndex: theme.zIndex.drawer - 1,
      }}
      className="bg-white border-b border-gray-200 text-black"
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: '56px !important',
          px: { xs: 2, md: 4 },
         }}
        className="bg-white text-black px-4"
      >
         <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }}
        >
          <IconButton
            edge="start"
            onClick={isMobile ? onMobileMenuOpen : onToggle}
            sx={{ color: '#000' }}
            aria-label="open menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: '-0.2px' }}
            className="font-semibold text-black"
          >
            {t('alramz')}
          </Typography>
        </div>

         <div className="flex items-center gap-2">
          <button
            onClick={handleLangToggle}
            className="relative px-3 py-1 rounded-full border border-gray-300 bg-white shadow transition hover:bg-indigo-50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: 48,
              minHeight: 32,
            }}
            aria-label="Toggle language"
          >
            <span className="inline-block">{i18n.language === 'en' ? '🇸🇦 AR' : '🇬🇧 EN'}</span>
            <svg
              className="w-4 h-4 text-indigo-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M12 19l7-7-7-7" />
            </svg>
          </button>

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
                {t('my_profile')}
              </MenuItem>

              {isSalesSupervisor && (
                <MenuItem component={Link} href={route('employees')} onClick={handleClose}>
                  {t('manage_team')}
                </MenuItem>
              )}

              {isSuperAdmin && (
                <MenuItem component={Link} href={route('users')} onClick={handleClose}>
                  {t('manage_users')}
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
                >
                  {t('logout')}
                </Link>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};