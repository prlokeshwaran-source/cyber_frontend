import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }) {
  const { credentials } = useAuth();
  const currentLocation = useLocation();

  return credentials
    ? children
    : <Navigate to="/login" replace state={{ from: currentLocation }} />;
}
