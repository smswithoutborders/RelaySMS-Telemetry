// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// project imports
import { useThemeCustomization } from '../../../../themes';
// project import
import { GithubOutlined, SunFilled, SunOutlined } from '@ant-design/icons';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { toggleColorMode } = useThemeCustomization();

  return (
    <>
      <Box sx={{ width: '100%', ml: 1 }} />
      <IconButton
        component={Link}
        href="https://github.com/smswithoutborders/"
        target="_blank"
        disableRipple
        color="secondary"
        title="SMS Without Borders on GitHub"
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: 'grey.100',
          ...theme.applyStyles('dark', { bgcolor: 'background.default' }),
          mr: 1
        })}
      >
        <GithubOutlined />
      </IconButton>

      <IconButton
        onClick={toggleColorMode}
        disableRipple
        color="secondary"
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: 'grey.100',
          ...theme.applyStyles('dark', { bgcolor: 'background.default' }),
          mr: 1
        })}
      >
        {isDarkMode ? <SunOutlined /> : <SunFilled />}
      </IconButton>
    </>
  );
}
