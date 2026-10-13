import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import LoginBackground from 'sections/auth/LoginBackground';
import { useAuth } from 'contexts/AuthContext';
import { getErrorMessage } from 'api/admin';
import fullLogo from '/full-logo.svg';
import darkLogo from '/RelaySMSDark.png';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ==============================|| LOGIN ||============================== //

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, login, endReason, clearEndReason } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}` : '/';

  if (status === 'loading') return <Loader />;
  if (status === 'authenticated') return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid username or password.'));
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        p: 2
      }}
    >
      <LoginBackground />
      <MainCard
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.3 : 0.35),
          backdropFilter: 'blur(2px) saturate(140%)',
          borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.white, 0.7),
          '& .MuiOutlinedInput-root': { bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.35 : 0.6) },
          '&, &:hover': {
            boxShadow: `0 24px 64px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.5 : 0.12)}`
          }
        }}
        contentSX={{ p: { xs: 3, sm: 4 } }}
      >
        <Stack component="form" onSubmit={handleSubmit} noValidate spacing={3}>
          <Stack spacing={1} sx={{ alignItems: 'center' }}>
            <img src={theme.palette.mode === 'dark' ? darkLogo : fullLogo} alt="RelaySMS" style={{ height: 35 }} />
            <Typography sx={{ pt: 1.5 }} variant="h4">
              Admin sign in
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', pb: 1.5 }}>
              Sign in to access RelaySMS telemetry dashboard.
            </Typography>
          </Stack>

          {error ? (
            <Alert severity="error" role="alert">
              {error}
            </Alert>
          ) : endReason === 'session-ended' ? (
            <Alert severity="warning" role="status" onClose={clearEndReason}>
              <strong>You&apos;ve been signed out.</strong> Your session expired, or an administrator signed you out or changed your access.
              Sign in again to continue.
            </Alert>
          ) : endReason === 'signed-out' ? (
            <Alert severity="success" role="status" onClose={clearEndReason}>
              You&apos;ve signed out.
            </Alert>
          ) : null}

          <TextField
            label="Username"
            type="text"
            autoComplete="username"
            autoFocus
            required
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 254 } }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              htmlInput: { maxLength: 256 },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      color="secondary"
                    >
                      {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />

          <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </Stack>
      </MainCard>
    </Box>
  );
}
