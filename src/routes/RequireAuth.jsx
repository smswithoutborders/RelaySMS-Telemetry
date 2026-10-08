import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

// project imports
import Loader from 'components/Loader';
import { useAuth } from 'contexts/AuthContext';

// ==============================|| ROUTE GUARD ||============================== //

export default function RequireAuth({ children }) {
  const location = useLocation();
  const { status } = useAuth();

  if (status === 'loading') return <Loader />;
  if (status === 'anonymous') return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

RequireAuth.propTypes = { children: PropTypes.node };
