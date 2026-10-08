import { useState } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// project imports
import { useAuth } from 'contexts/AuthContext';
import RoleChip from 'sections/credentials/RoleChip';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';

// ==============================|| HEADER - ACCOUNT MENU ||============================== //

// The same account details and sign out as the sidebar footer, reachable on phones where the drawer starts closed.
export default function Profile() {
  const { status, credential, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [signingOut, setSigningOut] = useState(false);

  // Pages are guarded, so the header only renders once signed in.
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

  return (
    <>
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-label="Account menu"
        aria-controls={anchorEl ? 'header-account-menu' : undefined}
        aria-haspopup="true"
        title={credential.username}
        sx={{ p: 0.25, flexShrink: 0 }}
      >
        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          {credential.username.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        id="header-account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220, mt: 1 } } }}
      >
        <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Signed in as
          </Typography>
          <Typography variant="subtitle1" noWrap sx={{ maxWidth: 240, mb: 0.75 }}>
            {credential.username}
          </Typography>
          {/* Hover the role to see what this login can do. */}
          <RoleChip credential={credential} />
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout} disabled={signingOut} sx={{ mt: 0.5 }}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          {signingOut ? 'Signing out…' : 'Sign out'}
        </MenuItem>
      </Menu>
    </>
  );
}
