
import React, { createContext, useContext } from 'react';
import { useBilling } from '@/hooks/useBilling';

const BillingContext = createContext<ReturnType<typeof useBilling> | undefined>(undefined);

export const useBillingContext = () => {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBillingContext must be used within a BillingProvider');
  }
  return context;
};

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const billing = useBilling();

  return (
    <BillingContext.Provider value={billing}>
      {children}
    </BillingContext.Provider>
  );
};
