
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, RefreshCw } from 'lucide-react';
import { useBillingContext } from './BillingProvider';

export const WalletCreditsTracker = () => {
  const { creditBalance, refreshData, loading } = useBillingContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBalanceColor = (balance: number) => {
    if (balance < 10) return 'text-red-600';
    if (balance < 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  const balance = creditBalance?.balance || 0;

  return (
    <Card className="shadow-sm border-muted/50 bg-background/90">
      <CardContent className="flex items-center gap-3 p-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-green-600" />
          <div className="flex flex-col">
            <span className={`text-sm font-semibold ${getBalanceColor(balance)}`}>
              {loading ? 'Loading...' : formatCurrency(balance)}
            </span>
            <span className="text-xs text-muted-foreground">Credits</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-auto">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            title="Refresh Balance"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            title="Add Credits"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
