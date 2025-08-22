import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { subAccountService } from '@/services/subAccountService';

interface SubAccount {
  id: string;
  name: string;
  ownerId: string;
  createdAt: any;
  updatedAt: any;
}

interface SubAccountContextType {
  currentSubAccount: SubAccount | null;
  userSubAccounts: SubAccount[];
  userRole: string | null;
  loading: boolean;
  refreshSubAccounts: () => Promise<void>;
  switchSubAccount: (id: string) => Promise<void>;
}

const SubAccountContext = createContext<SubAccountContextType | undefined>(undefined);

export const useSubAccount = () => {
  const context = useContext(SubAccountContext);
  if (context === undefined) {
    throw new Error('useSubAccount must be used within a SubAccountProvider');
  }
  return context;
};

export const SubAccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, currentSubAccount, switchSubAccount: authSwitchSubAccount } = useAuth();
  const [userSubAccounts, setUserSubAccounts] = useState<SubAccount[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fast load user's sub-accounts
  const refreshSubAccounts = async () => {
    if (!currentUser) {
      setUserSubAccounts([]);
      return;
    }

    // Skip loading for faster dashboard
    if (currentSubAccount) {
      setUserSubAccounts([currentSubAccount]);
      return;
    }

    setLoading(true);
    try {
      const subAccounts = await subAccountService.getUserSubAccounts(currentUser.uid);
      setUserSubAccounts(subAccounts);
    } catch (error) {
      console.error('Error loading sub-accounts:', error);
      // Set current sub-account as fallback
      if (currentSubAccount) {
        setUserSubAccounts([currentSubAccount]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fast load user's role
  const loadUserRole = async () => {
    if (!currentUser || !currentSubAccount) {
      setUserRole(null);
      return;
    }

    // Default to owner for faster loading
    setUserRole('owner');
    
    // Load actual role in background
    try {
      const role = await subAccountService.getUserRole(currentUser.uid, currentSubAccount.id);
      setUserRole(role);
    } catch (error) {
      console.error('Error loading user role:', error);
      // Keep default role
    }
  };

  const switchSubAccount = async (id: string) => {
    await authSwitchSubAccount(id);
  };

  useEffect(() => {
    if (currentUser && currentSubAccount) {
      // Only refresh if we don't have sub-accounts yet
      if (userSubAccounts.length === 0) {
        refreshSubAccounts();
      }
    }
  }, [currentUser, currentSubAccount]);

  useEffect(() => {
    if (currentUser && currentSubAccount) {
      loadUserRole();
    }
  }, [currentUser, currentSubAccount]);

  const value = {
    currentSubAccount,
    userSubAccounts,
    userRole,
    loading,
    refreshSubAccounts,
    switchSubAccount
  };

  return (
    <SubAccountContext.Provider value={value}>
      {children}
    </SubAccountContext.Provider>
  );
};