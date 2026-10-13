import { useState } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import { useAuth } from 'contexts/AuthContext';
import { useGetMenuMaster } from 'api/menu';
import { roleOf } from 'utils/scopes';
import { PermissionSummary } from 'sections/credentials/RoleChip';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';

// ==============================|| DRAWER - SIGNED-IN USER ||============================== //

export default function NavUser() {
  const { status, credential, logout } = useAuth();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const [anchorEl, setAnchorEl] = useState(null);
  const [signingOut, setSigningOut] = useState(false);

  // Pages are guarded, so the drawer only renders once signed in.
  if (status !== 'authenticated') return null;

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
      setAnchorEl(null);
    }
  };

  const avatar = (
    <Avatar sx={{ width: 34, height: 34, fontSize: '0.875rem', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
      {credential.username.charAt(0).toUpperCase()}
    </Avatar>
  );

  if (!drawerOpen) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <IconButton
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-label="Account menu"
          aria-controls={anchorEl ? 'drawer-account-menu' : undefined}
          aria-haspopup="true"
          sx={{ p: 0.25 }}
        >
          {avatar}
        </IconButton>
        <Menu
          id="drawer-account-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Box sx={{ px: 2, py: 1, maxWidth: 240 }}>
            <Typography variant="subtitle1" noWrap>
              {credential.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {roleOf(credential)}
            </Typography>
          </Box>
          <MenuItem onClick={handleLogout} disabled={signingOut}>
            <ListItemIcon>
              <LogoutOutlined />
            </ListItemIcon>
            {signingOut ? 'Signing out…' : 'Sign out'}
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, px: 2.5, py: 1.5, borderTop: 1, borderColor: 'divider' }}>
      {avatar}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" noWrap title={credential.username}>
          {credential.username}
        </Typography>
        <Tooltip title={<PermissionSummary credential={credential} />} placement="top-start">
          <Typography variant="caption" color="text.secondary" noWrap component="div" sx={{ cursor: 'help', width: 'fit-content' }}>
            {roleOf(credential)}
          </Typography>
        </Tooltip>
      </Box>
      <Tooltip title="Sign out">
        <span>
          <IconButton onClick={handleLogout} disabled={signingOut} aria-label="Sign out" color="secondary">
            <LogoutOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
