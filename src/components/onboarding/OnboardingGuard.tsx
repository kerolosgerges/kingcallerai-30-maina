import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface OnboardingGuardProps {
  children?: React.ReactNode;
}

export const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const { authInitialized, loading } = useAuth();

  // Wait for auth to initialize
  if (!authInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render children - simple MVP approach
  return children ? <>{children}</> : null;
};