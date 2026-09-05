import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Wrap a route element; redirects to /login if not authenticated,
 *  or to / if adminOnly is required but the user isn't an admin. */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children;
}
