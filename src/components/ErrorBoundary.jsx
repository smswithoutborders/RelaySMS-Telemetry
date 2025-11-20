import { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { ReloadOutlined } from '@ant-design/icons';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
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
          <Button variant="contained" startIcon={<ReloadOutlined />} onClick={() => this.handleReset()} sx={{ mt: 2 }}>
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
