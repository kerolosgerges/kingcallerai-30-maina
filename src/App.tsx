
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SubAccountProvider } from './contexts/SubAccountContext';
import { Toaster } from './components/ui/sonner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FullScreenLoader } from './components/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';

import NotFound from './pages/NotFound';

// Route functions
import { getAuthRoutes } from './routes/auth/AuthRoutes';
import { getSubAccountRoutes } from './routes/subaccount/SubAccountRoutes';

// Component to handle root redirect
const RootRedirect = () => {
  const { authInitialized, currentUser, userProfile } = useAuth();

  // Show loading while checking authentication
  if (!authInitialized) {
    return <FullScreenLoader text="Initializing..." />;
  }

  // Only redirect from root path, not other paths
  const currentPath = window.location.pathname;
  if (currentPath !== '/') {
    return null; // Don't interfere with other routes
  }

  // Redirect authenticated users to their dashboard from root only
  if (currentUser && userProfile?.defaultSubAccountId) {
    return <Navigate to={`/${userProfile.defaultSubAccountId}/dashboard`} replace />;
  }

  // Redirect unauthenticated users to login from root only
  return <Navigate to="/login" replace />;
};

// Authenticated App Content - Only loads when user is authenticated
const AuthenticatedAppContent = () => {
  return (
    <SubAccountProvider>
      <ErrorBoundary>
        <Routes>
          {/* Auth routes for authenticated users */}
          {getAuthRoutes()}

          {/* Sub-account Routes */}
          {getSubAccountRoutes()}

          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </SubAccountProvider>
  );
};

// Main App Content Component
const AppContent = () => {
  const { currentUser, authInitialized } = useAuth();

  // Show loading while checking authentication
  if (!authInitialized) {
    return <FullScreenLoader text="Initializing..." />;
  }

  // If authenticated, load sub-account context and routes
  if (currentUser) {
    return <AuthenticatedAppContent />;
  }

  // If not authenticated, only show auth routes
  return (
    <Routes>
      {/* Authentication Routes */}
      {getAuthRoutes()}

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <AppContent />
            <Toaster />
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
