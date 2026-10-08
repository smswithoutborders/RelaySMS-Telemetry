import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';

// render - login
const Login = Loadable(lazy(() => import('pages/auth/Login')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/login',
  element: <Login />
};

export default LoginRoutes;
