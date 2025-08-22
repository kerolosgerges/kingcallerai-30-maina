import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { FullScreenLoader } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, authInitialized } = useAuth();
  const location = useLocation();

  // Show loading while authentication is being checked
  if (!authInitialized) {
    return <FullScreenLoader text="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};