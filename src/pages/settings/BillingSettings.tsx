
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert } from 'lucide-react';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import { BillingProvider } from '@/components/billing/BillingProvider';
import { BillingOverview } from '@/components/billing/BillingOverview';
import { WalletBalance } from '@/components/billing/WalletBalance';
import { UsageHistory } from '@/components/billing/UsageHistory';
import { WalletCreditsTracker } from '@/components/billing/WalletCreditsTracker';
import BillingTab from '@/components/settings/BillingTab';

const BillingSettings = () => {
  return (
    <div className="min-h-screen p-0 font-poppins bg-gradient-to-br from-background via-accent/50 to-muted/40">
      <div className="px-6 pt-8 pb-4 w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-primary">
                Billing & Invoices
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                View invoices, payment history, and billing details
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
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="wallet">Wallet</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <BillingOverview />
                </TabsContent>
                
                <TabsContent value="wallet" className="space-y-6">
                  <WalletBalance />
                </TabsContent>
                
                <TabsContent value="usage" className="space-y-6">
                  <UsageHistory />
                </TabsContent>
                
                <TabsContent value="invoices" className="space-y-6">
                  <BillingTab />
                </TabsContent>
              </Tabs>
            </BillingProvider>
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;
