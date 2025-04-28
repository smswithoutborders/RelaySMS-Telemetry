import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const Documentation = Loadable(lazy(() => import('pages/extra-pages/documentation')));
const Publications = Loadable(lazy(() => import('pages/publication/publications')));
const ReliabilityTable = Loadable(lazy(() => import('pages/reliability/reliabilityTable')));
const TestDetails = Loadable(lazy(() => import('pages/reliability/TestDetails')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'open-telemetry',
      element: <DashboardDefault />
    },
    {
      path: 'publications',
      element: <Publications />
    },
    {
      path: 'reliability',
      element: <ReliabilityTable />
    },
    {
      path: 'tests/:msisdn',
      element: <TestDetails />
    },
    {
      path: 'documentation',
      element: <Documentation />
    }
  ]
};

export default MainRoutes;
