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
            '&.Mui-selected': {
              bgcolor: 'rgba(255,255,255,0.15)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              '& .MuiListItemIcon-root': { color: '#fff' },
            },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: drawerOpen ? 2 : 'auto',
              justifyContent: 'center',
              color: active ? '#fff' : 'rgba(255,255,255,0.7)',
              transition: 'margin 0.3s ease',
            }}
          >
            <Icon name={icon} className="w-5 h-5 fill-current" />
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