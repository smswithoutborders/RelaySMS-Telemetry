import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import { PERMISSION_GROUPS, roleOf } from 'utils/scopes';

const ROLE_STYLES = {
  Administrator: { bgcolor: 'primary.main' },
  Editor: { bgcolor: '#c2760c' },
  Viewer: { bgcolor: '#64748B' }
};

export function PermissionSummary({ credential }) {
  if (credential.administrator) {
    return <Typography variant="body2">Full access to everything</Typography>;
  }
  const groups = PERMISSION_GROUPS.map((group) => ({
    ...group,
    granted: group.permissions.filter((permission) => credential.scopes.includes(permission.scope))
  })).filter((group) => group.granted.length > 0);

  if (groups.length === 0) return <Typography variant="body2">No access</Typography>;
  return (
    <Box sx={{ py: 0.5 }}>
      {groups.map((group) => (
        <Box key={group.id} sx={{ '&:not(:last-of-type)': { mb: 1 } }}>
          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
            {group.title}
          </Typography>
          {group.granted.map((permission) => (
            <Typography key={permission.scope} variant="caption" sx={{ display: 'block' }}>
              • {permission.label}
            </Typography>
          ))}
        </Box>
      ))}
    </Box>
  );
}

PermissionSummary.propTypes = { credential: PropTypes.object.isRequired };

export default function RoleChip({ credential, size = 'small' }) {
  const role = roleOf(credential);
  return (
    <Tooltip title={<PermissionSummary credential={credential} />} placement="bottom-start">
      <Chip size={size} label={role} sx={{ ...ROLE_STYLES[role], color: '#fff', fontWeight: 500, cursor: 'help' }} />
    </Tooltip>
  );
}

RoleChip.propTypes = { credential: PropTypes.object.isRequired, size: PropTypes.string };
