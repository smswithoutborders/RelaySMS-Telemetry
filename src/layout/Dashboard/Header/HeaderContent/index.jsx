// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

// project imports
import Profile from './Profile';
import ThemeToggle from './ThemeToggle';
// project import
import { GithubOutlined } from '@ant-design/icons';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

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

      <ThemeToggle />

      <Profile />
    </>
  );
}
