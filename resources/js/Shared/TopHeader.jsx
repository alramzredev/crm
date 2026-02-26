import React, { useState } from 'react';
import logo from '../../images/logo-white-2-1-1.svg';
import { Link } from '@inertiajs/react';
import Logo from '@/Shared/Logo';
import MainMenu, { DRAWER_WIDTH, DRAWER_MINI_WIDTH } from '@/Shared/MainMenu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default ({ drawerWidth = DRAWER_WIDTH }) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div
      className="flex items-center justify-between px-6 py-4 bg-indigo-900 md:flex-shrink-0 md:justify-center relative transition-all duration-300"
      style={{
        marginLeft: isMobile ? 0 : drawerWidth,
        transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <Link className="mt-1" href="/">
        <Logo className="text-white fill-current" width="120" height="28" />
      </Link>
      <div className="relative md:hidden">
        <svg
          onClick={() => setMenuOpened(true)}
          className="w-6 h-6 text-white cursor-pointer fill-current"
          xmlns={logo}
          viewBox="0 0 20 20"
        >
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
        {menuOpened && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black opacity-25"
              onClick={() => setMenuOpened(false)}
            ></div>
            <div
              className="fixed top-0 left-0 z-40"
              style={{ width: DRAWER_WIDTH, height: '100vh' }}
            >
              <MainMenu
                className="h-full"
                mobileOpen={menuOpened}
                setMobileOpen={setMenuOpened}
                onToggle={() => {}} // no-op for mobile
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
