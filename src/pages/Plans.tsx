
import React from 'react';
import { BillingProvider } from '@/components/billing/BillingProvider';
import { SubscriptionPlans } from '@/components/billing/SubscriptionPlans';

const Plans = () => {
  return (
    <BillingProvider>
      <div className="p-6">
        <SubscriptionPlans />
      </div>
    </BillingProvider>
  );
};

export default Plans;
