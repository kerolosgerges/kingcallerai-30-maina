
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import { BillingProvider } from '@/components/billing/BillingProvider';
import { SubscriptionPlans } from '@/components/billing/SubscriptionPlans';
import { WalletCreditsTracker } from '@/components/billing/WalletCreditsTracker';

const PlansSettings = () => {
  return (
    <div className="min-h-screen p-0 font-poppins bg-gradient-to-br from-background via-accent/50 to-muted/40">
      <div className="px-6 pt-8 pb-4 w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-primary">
                Plans & Billing
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Manage your subscription plans and billing information
              </p>
            </div>
            <BillingProvider>
              <WalletCreditsTracker />
            </BillingProvider>
          </div>
        </div>
        
        <div className="bg-card/70 rounded-2xl shadow-xl p-5 md:p-8 border border-muted/70 w-full">
          <PermissionGuard 
            resource="manage_billing"
            fallback={
              <Alert>
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  You don't have permission to manage billing. Contact your account administrator.
                </AlertDescription>
              </Alert>
            }
          >
            <BillingProvider>
              <SubscriptionPlans />
            </BillingProvider>
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
};

export default PlansSettings;
