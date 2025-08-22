import React from 'react';
import { BillingProvider } from '@/components/billing/BillingProvider';
import DynamicPricingPage from '@/components/billing/DynamicPricingPage';

const PricingExample = () => {
  return (
    <BillingProvider>
      <div className="min-h-screen bg-gray-50">
        <DynamicPricingPage />
      </div>
    </BillingProvider>
  );
};

export default PricingExample;