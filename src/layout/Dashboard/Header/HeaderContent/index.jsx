// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// project imports
import Search from './Search';
import MobileSection from './MobileSection';
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
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      <IconButton
        component={Link}
        href="https://github.com/smswithoutborders/"
        target="_blank"
        disableRipple
        color="secondary"
        title="SMS Without Borders on GitHub"
        sx={{ color: 'text.primary', bgcolor: 'grey.100', mr: 1 }}
      >
        <GithubOutlined />
      </IconButton>

      {/* <IconButton onClick={toggleColorMode} color="inherit" title="Toggle Theme">
        {isDarkMode ? <SunOutlined /> : <SunFilled />}
      </IconButton> */}

      {downLG && <MobileSection />}
    </>
  );
}
