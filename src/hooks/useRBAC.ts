// Simplified RBAC for MVP
import { useAuth } from '@/contexts/AuthContext';
import { useSubAccount } from '@/contexts/SubAccountContext';

export const useRBAC = () => {
  const { currentUser } = useAuth();
  const { currentSubAccount, userRole } = useSubAccount();

  const hasPermission = (resource: string, action: string): boolean => {
    // Simple permission check - owner/admin can do everything
    return userRole === 'owner' || userRole === 'admin';
  };

  const canAccess = (resource: string): boolean => {
    return hasPermission(resource, 'read');
  };

  const canEdit = (resource: string): boolean => {
    return hasPermission(resource, 'write');
  };

  const canDelete = (resource: string): boolean => {
    return hasPermission(resource, 'delete');
  };

  return {
    hasPermission,
    canAccess,
    canEdit,
    canDelete,
    currentRole: userRole,
    isOwner: userRole === 'owner',
    isAdmin: userRole === 'admin' || userRole === 'owner',
    isMember: userRole === 'member'
  };
};