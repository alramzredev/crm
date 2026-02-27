import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Shared/Icon';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';

export default ({ text, link, icon, drawerOpen = true }) => {
  const { url } = usePage().props;

  const isActive = () => {
    try {
      const routeUrl = route(link);
      return url && url.startsWith(routeUrl);
    } catch (e) {
      return false;
    }
  };

  const active = isActive();

  return (
    <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
      <Tooltip title={!drawerOpen ? text : ''} placement="right" arrow>
        <ListItemButton
          component={Link}
          href={route(link)}
          selected={active}
          sx={{
            minHeight: 48,
            justifyContent: drawerOpen ? 'initial' : 'center',
            px: 2,
            borderRadius: 2,
            transition: 'all 0.2s ease',
            // Remove MUI color logic, use Tailwind below
          }}
          className={
            active
              ? 'bg-white text-black border-l-4 border-indigo-500 shadow font-semibold'
              : 'text-white hover:bg-gray-900 hover:text-white'
          }
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: drawerOpen ? 2 : 'auto',
              justifyContent: 'center',
              color: 'inherit',
              transition: 'margin 0.3s ease',
            }}
          >
            <Icon
              name={icon}
              className={
                active
                  ? 'w-5 h-5 fill-current text-indigo-600'
                  : 'w-5 h-5 fill-current text-white group-hover:text-white'
              }
            />
          </ListItemIcon>
          <ListItemText
            primary={text}
            sx={{
              opacity: drawerOpen ? 1 : 0,
              transition: 'opacity 0.25s ease',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              '& .MuiTypography-root': {
                fontWeight: active ? 600 : 400,
                fontSize: '0.875rem',
              },
            }}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};