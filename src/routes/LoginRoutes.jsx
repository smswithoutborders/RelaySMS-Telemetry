import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import RouteErrorPage from 'pages/extra-pages/error';

// render - login
const Login = Loadable(lazy(() => import('pages/auth/Login')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/login',
  element: <Login />,
  errorElement: <RouteErrorPage />
};

export default LoginRoutes;
