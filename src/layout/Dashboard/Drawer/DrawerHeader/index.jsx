import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

// project imports
import DrawerHeaderStyled from './DrawerHeaderStyled';
import fullLogo from '/full-logo.svg';
import logo from '/logo.svg';
import darkLogo from '/RelaySMSDark.png';

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const currentFullLogo = isDarkMode ? darkLogo : fullLogo;

  return (
    <DrawerHeaderStyled
      open={open}
      sx={{
        minHeight: '60px',
        width: 'initial',
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: open ? '24px' : 0
      }}
    >
      <img
        src={open ? currentFullLogo : logo}
        alt="Logo"
        style={{
          width: open ? 'auto' : 35,
          height: 35
        }}
      />
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
