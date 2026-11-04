import { lazy } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import RouteErrorPage from 'pages/extra-pages/error';
import RequireAuth from './RequireAuth';
import RequireScope from './RequireScope';
import { SCOPES } from 'utils/scopes';

// render - pages
const Publications = Loadable(lazy(() => import('pages/publication/publications')));
const PublicationLog = Loadable(lazy(() => import('pages/publication/PublicationLog')));
const Platforms = Loadable(lazy(() => import('pages/platforms/Platforms')));
const GatewayClients = Loadable(lazy(() => import('pages/gateway-clients/GatewayClients')));
const Credentials = Loadable(lazy(() => import('pages/credentials/Credentials')));
const Logs = Loadable(lazy(() => import('pages/logs/Logs')));
const NotFound = Loadable(lazy(() => import('pages/extra-pages/notfound')));

function RedirectKeepingQuery({ to }) {
  const { search } = useLocation();
  return <Navigate to={`${to}${search}`} replace />;
}

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <RequireAuth>
      <DashboardLayout />
    </RequireAuth>
  ),
  errorElement: <RouteErrorPage />,
  children: [
    {
      path: '/',
      element: (
        <RequireScope scope={SCOPES.STATS_READ}>
          <Publications />
        </RequireScope>
      )
    },
    {
      path: 'publications/log',
      element: (
        <RequireScope scope={SCOPES.STATS_READ}>
          <PublicationLog />
        </RequireScope>
      )
    },
    // Old bookmarks.
    { path: 'publications', element: <Navigate to="/" replace /> },
    { path: 'open-telemetry', element: <Navigate to="/" replace /> },
    { path: 'reliability', element: <Navigate to="/routing-numbers" replace /> },
    { path: 'gateway-clients', element: <Navigate to="/routing-numbers" replace /> },
    { path: 'credentials', element: <RedirectKeepingQuery to="/managers" /> },
    { path: 'users', element: <RedirectKeepingQuery to="/managers" /> },
    { path: 'documentation', element: <Navigate to="/" replace /> },
    { path: 'support', element: <Navigate to="/" replace /> },
    {
      path: 'platforms',
      element: <Platforms />
    },
    {
      path: 'routing-numbers',
      element: <GatewayClients />
    },
    {
      path: 'managers',
      element: (
        <RequireScope scope={SCOPES.CREDS_READ}>
          <Credentials />
        </RequireScope>
      )
    },
    {
      path: 'logs',
      element: (
        <RequireScope scope={SCOPES.AUDIT_READ}>
          <Logs />
        </RequireScope>
      )
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
};

export default MainRoutes;
