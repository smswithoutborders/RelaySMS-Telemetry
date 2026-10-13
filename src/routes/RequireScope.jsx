import PropTypes from 'prop-types';

// material-ui
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import { useAuth } from 'contexts/AuthContext';
import { PERMISSION_LABELS } from 'utils/scopes';

// ==============================|| SCOPE GUARD ||============================== //

export default function RequireScope({ scope, children }) {
  const { hasScope } = useAuth();
  if (hasScope(scope)) return children;
  return (
    <MainCard>
      <Typography variant="h5" gutterBottom>
        No access
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This page needs the “{PERMISSION_LABELS[scope] || scope}” permission. Ask an administrator to give it to you.
      </Typography>
    </MainCard>
  );
}

RequireScope.propTypes = { scope: PropTypes.string.isRequired, children: PropTypes.node };
