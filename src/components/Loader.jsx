// material-ui
import Box from '@mui/material/Box';
import { keyframes } from '@mui/material/styles';

// assets

// ==============================|| Loader ||============================== //

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export default function Loader({ size = 40, fullScreen = true }) {
  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        <Box
          component="img"
          src="/RelaySMS-Icon-Default.png"
          alt="Loading..."
          sx={{
            width: size,
            height: size,
            animation: `${spin} 1s linear infinite`
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: size * 2
      }}
    >
      <Box
        component="img"
        src="/RelaySMS-Icon-Default.png"
        alt="Loading..."
        sx={{
          width: size,
          height: size,
          animation: `${spin} 1s linear infinite`
        }}
      />
    </Box>
  );
}
