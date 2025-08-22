import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubAccount } from '@/contexts/SubAccountContext';

interface DebugPanelProps {
  show?: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ show = false }) => {
  const { currentUser, userProfile, authInitialized, loading } = useAuth();
  const { currentSubAccount, userSubAccounts } = useSubAccount();

  if (!show || import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Auth Initialized: {authInitialized ? '✅' : '❌'}</div>
        <div>Loading: {loading ? '⏳' : '✅'}</div>
        <div>Current User: {currentUser ? '✅' : '❌'}</div>
        <div>User Profile: {userProfile ? '✅' : '❌'}</div>
        <div>Current SubAccount: {currentSubAccount ? '✅' : '❌'}</div>
        <div>SubAccounts Count: {userSubAccounts.length}</div>
        {currentUser && (
          <div>User Email: {currentUser.email}</div>
        )}
        {userProfile && (
          <div>Default SubAccount: {userProfile.defaultSubAccountId}</div>
        )}
        {currentSubAccount && (
          <div>Current SubAccount: {currentSubAccount.id}</div>
        )}
      </div>
    </div>
  );
};