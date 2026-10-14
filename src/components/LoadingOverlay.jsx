import PropTypes from 'prop-types';

// material-ui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';

// project imports
import Loader from 'components/Loader';

// ==============================|| LOADING OVERLAY ||============================== //

export default function LoadingOverlay({ loading, children, minHeight = 0, size = 40, sx }) {
  return (
    <Box sx={[{ position: 'relative', minHeight: loading ? minHeight : 0 }, ...(Array.isArray(sx) ? sx : [sx])]} aria-busy={loading}>
      {children}
      {loading && (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            // Spinner near the top of tall content, so it's on screen without scrolling.
            pt: 'min(120px, 30%)',
            borderRadius: 'inherit',
            bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.55 : 0.6),
            backdropFilter: 'blur(1px)',
            transition: 'opacity 0.2s'
          })}
        >
          <Loader size={size} fullScreen={false} />
        </Box>
      )}
    </Box>
  );
}

LoadingOverlay.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node,
  minHeight: PropTypes.number,
  size: PropTypes.number,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};
