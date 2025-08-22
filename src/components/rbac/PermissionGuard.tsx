
import { useRBAC } from '@/hooks/useRBAC';

interface PermissionGuardProps {
  resource: string;
  action?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({ resource, action = 'read', children, fallback = null }: PermissionGuardProps) => {
  const { hasPermission } = useRBAC();

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
