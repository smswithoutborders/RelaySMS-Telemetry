import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

// material-ui
import { Box, Typography, Button } from '@mui/material';
import { ReloadOutlined } from '@ant-design/icons';

// ==============================|| ERROR PAGE ||============================== //

// Plain UI so it can also render outside the router (see components/ErrorBoundary).
export function ErrorPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={2}
      sx={{ p: 3, bgcolor: 'background.default' }}
    >
      <Typography variant="h4" color="text.primary" sx={{ textAlign: 'center' }}>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', maxWidth: '500px' }}>
        We encountered an unexpected error. Please try refreshing the page. If the problem persists, contact support.
      </Typography>
      <Button variant="contained" startIcon={<ReloadOutlined />} onClick={() => window.location.reload()} sx={{ mt: 2 }}>
        Refresh Page
      </Button>
    </Box>
  );
}

// Used as the router's errorElement, which replaces react-router's default error screen.
export default function RouteErrorPage() {
  const error = useRouteError();

  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return <ErrorPage />;
}
