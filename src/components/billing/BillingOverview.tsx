
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import { useBillingContext } from './BillingProvider';
import { format } from 'date-fns';

export const BillingOverview = () => {
  const { subscription, creditBalance, paymentHistory, loading, refreshData } = useBillingContext();

  const getSubscriptionStatus = () => {
    if (!subscription) return { label: 'No Subscription', variant: 'outline' as const };
    
    switch (subscription.status) {
      case 'active':
        return { label: 'Active', variant: 'default' as const };
      case 'past_due':
        return { label: 'Past Due', variant: 'destructive' as const };
      case 'canceled':
        return { label: 'Cancelled', variant: 'secondary' as const };
      case 'trialing':
        return { label: 'Trial', variant: 'outline' as const };
      default:
        return { label: subscription.status, variant: 'outline' as const };
    }
  };

  const getTotalSpent = () => {
    return paymentHistory
      .filter(payment => payment.status === 'succeeded')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const statusInfo = getSubscriptionStatus();
  const totalSpent = getTotalSpent();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading billing overview...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Subscription Overview */}
      <Card className="rounded-2xl shadow-lg border border-muted/60 bg-background/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Current Subscription
            </CardTitle>
            <CardDescription>Your active plan and billing information</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Status</span>
            <Badge variant={statusInfo.variant}>
              {statusInfo.label}
            </Badge>
          </div>
          
          {subscription && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium">Plan ID</span>
                <span className="text-sm text-muted-foreground">
                  {subscription.plan_id}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Next Billing</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}
                </span>
              </div>
              
              {subscription.cancel_at_period_end && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cancels At</span>
                  <span className="text-sm text-orange-600">
                    {format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
            </>
          )}
          
          <Separator />
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Manage Subscription
            </Button>
            {!subscription && (
              <Button className="w-full">
                Choose Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Summary */}
      <Card className="rounded-2xl shadow-lg border border-muted/60 bg-background/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Account Summary
          </CardTitle>
          <CardDescription>Overview of your account activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Balance</span>
            <span className="text-lg font-bold text-green-600">
              {creditBalance ? formatCurrency(creditBalance.balance * 100) : '$0.00'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Payments</span>
            <span className="text-lg font-bold">
              {paymentHistory.length}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Spent</span>
            <span className="text-lg font-bold">
              {formatCurrency(totalSpent)}
            </span>
          </div>
          
          {creditBalance?.monthly_spent && (
            <div className="flex items-center justify-between">
              <span className="font-medium">This Month</span>
              <span className="text-lg font-bold">
                {formatCurrency(creditBalance.monthly_spent * 100)}
              </span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Last updated</span>
            <span>
              {creditBalance?.last_updated 
                ? format(new Date(creditBalance.last_updated), 'MMM dd, HH:mm')
                : 'Never'
              }
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
