
import { useRBAC } from '@/hooks/useRBAC';

type Role = 'owner' | 'admin' | 'member';

interface RoleGuardProps {
  roles: Role | Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard = ({ roles, children, fallback = null }: RoleGuardProps) => {
  const { currentRole } = useRBAC();

  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const hasAccess = allowedRoles.includes(currentRole as Role);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
