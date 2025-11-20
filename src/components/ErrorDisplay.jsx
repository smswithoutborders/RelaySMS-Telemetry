import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { ReloadOutlined } from '@ant-design/icons';

export default function ErrorDisplay({
  title = 'Something went wrong',
  message = "We couldn't load the data. Please check your connection and try again.",
  onRetry,
  fullHeight = false
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        flex: fullHeight ? 1 : undefined,
        p: 3,
        minHeight: fullHeight ? undefined : '200px'
      }}
    >
      <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: '400px' }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" startIcon={<ReloadOutlined />} onClick={onRetry} sx={{ mt: 1 }}>
          Refresh
        </Button>
      )}
    </Box>
  );
}

ErrorDisplay.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onRetry: PropTypes.func,
  fullHeight: PropTypes.bool
};
