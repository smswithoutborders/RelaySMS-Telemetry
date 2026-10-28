import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { DRAWER_WIDTH } from 'config';

const CORNER_RADIUS = 14;

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  // set media wise responsive drawer
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />

      {/* rounded inner corner where the header and drawer borders meet */}
      {drawerOpen && !downLG && (
        <Box
          aria-hidden
          sx={(theme) => ({
            position: 'fixed',
            top: theme.mixins.toolbar.minHeight,
            left: DRAWER_WIDTH - 1,
            width: CORNER_RADIUS,
            height: CORNER_RADIUS,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 1200,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: CORNER_RADIUS * 2,
              height: CORNER_RADIUS * 2,
              borderTopLeftRadius: CORNER_RADIUS,
              borderTop: '1px solid',
              borderLeft: '1px solid',
              borderColor: 'divider',
              boxShadow: `0 0 0 ${CORNER_RADIUS}px ${theme.palette.background.paper}`
            }
          })}
        />
      )}

      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ mt: 'inherit' }} />
        <Box
          sx={{
            ...{ px: { xs: 0, sm: 2 } },
            width: '100%',
            maxWidth: 1440,
            mx: 'auto',
            position: 'relative',
            minHeight: 'calc(100vh - 110px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {pathname !== '/apps/profiles/account/my-account' && <Breadcrumbs />}
          <Outlet />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
