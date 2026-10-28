// material-ui
import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// project imports
import { useThemeCustomization } from '../../../../themes';

// assets
import { MoonFilled, SunFilled } from '@ant-design/icons';

const TRACK_WIDTH = 84;
const TRACK_HEIGHT = 48;
const PADDING = 6;
const KNOB_SIZE = TRACK_HEIGHT - PADDING * 2;

// ==============================|| HEADER - THEME TOGGLE ||============================== //

export default function ThemeToggle() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { toggleColorMode } = useThemeCustomization();

  return (
    <ButtonBase
      role="switch"
      aria-checked={isDarkMode}
      aria-label="Dark mode"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      onClick={toggleColorMode}
      disableRipple
      sx={(theme) => ({
        position: 'relative',
        flexShrink: 0,
        width: TRACK_WIDTH,
        height: TRACK_HEIGHT,
        borderRadius: TRACK_HEIGHT / 2,
        bgcolor: 'grey.100',
        border: '1px solid',
        borderColor: 'divider',
        mr: 1,
        transition: theme.transitions.create('background-color'),
        '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
        ...theme.applyStyles('dark', { bgcolor: 'background.default' })
      })}
    >
      {/* track icons */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '9px',
          fontSize: '0.8125rem',
          color: 'text.secondary'
        }}
      >
        <SunFilled />
        <MoonFilled />
      </Box>

      {/* sliding knob */}
      <Box
        aria-hidden
        sx={(theme) => ({
          position: 'absolute',
          top: PADDING - 1,
          left: PADDING - 1,
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          bgcolor: 'background.paper',
          color: isDarkMode ? 'primary.light' : 'warning.main',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
          transform: `translateX(${isDarkMode ? TRACK_WIDTH - KNOB_SIZE - PADDING * 2 : 0}px)`,
          transition: theme.transitions.create('transform', { duration: 250 }),
          ...theme.applyStyles('dark', { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' })
        })}
      >
        {isDarkMode ? <MoonFilled /> : <SunFilled />}
      </Box>
    </ButtonBase>
  );
}
