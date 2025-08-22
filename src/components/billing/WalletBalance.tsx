
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wallet, Plus, AlertTriangle, TrendingUp, RefreshCw, Loader2 } from 'lucide-react';
import { useBillingContext } from './BillingProvider';

export const WalletBalance = () => {
  const { 
    creditBalance, 
    loading, 
    addCredits, 
    refreshData, 
    isAddingCredits 
  } = useBillingContext();

  useEffect(() => {
    // Auto-refresh credit balance on component mount
    refreshData();
  }, [refreshData]);

  const handleAddCredits = async (amount: number) => {
    try {
      await addCredits(amount);
    } catch (error) {
      console.error('Error adding credits:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBalanceStatus = (balance: number) => {
    if (balance < 10) return { color: 'text-red-600', icon: AlertTriangle, message: 'Low balance' };
    if (balance < 25) return { color: 'text-yellow-600', icon: AlertTriangle, message: 'Medium balance' };
    return { color: 'text-green-600', icon: TrendingUp, message: 'Good balance' };
  };

  if (loading && !creditBalance) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading wallet information...</span>
      </div>
    );
  }

  const balance = creditBalance?.balance || 0;
  const monthlySpent = creditBalance?.monthly_spent || 0;
  const monthlyLimit = creditBalance?.monthly_limit || 500;
  const balanceStatus = getBalanceStatus(balance);
  const monthlyUsagePercent = monthlyLimit > 0 ? (monthlySpent / monthlyLimit) * 100 : 0;
  const StatusIcon = balanceStatus.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Current Balance */}
      <Card className="rounded-2xl shadow-lg border border-muted/60 bg-background/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-green-600" />
              Current Balance
            </CardTitle>
            <CardDescription>Your available credits for calls and SMS</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {formatCurrency(balance)}
            </div>
            <div className={`flex items-center justify-center gap-1 text-sm ${balanceStatus.color}`}>
              <StatusIcon className="h-4 w-4" />
              {balanceStatus.message}
            </div>
          </div>

          {creditBalance?.last_transaction && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last transaction:</span>
                <span className={creditBalance.last_transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                  {creditBalance.last_transaction.type === 'credit' ? '+' : '-'}
                  {formatCurrency(creditBalance.last_transaction.amount)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {creditBalance.last_transaction.description} • {new Date(creditBalance.last_transaction.timestamp).toLocaleDateString()}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button 
              onClick={() => handleAddCredits(50)} 
              disabled={isAddingCredits}
              size="sm"
              variant="outline"
            >
              {isAddingCredits ? <Loader2 className="h-3 w-3 animate-spin" /> : '+$50'}
            </Button>
            <Button 
              onClick={() => handleAddCredits(100)} 
              disabled={isAddingCredits}
              size="sm"
              variant="outline"
            >
              {isAddingCredits ? <Loader2 className="h-3 w-3 animate-spin" /> : '+$100'}
            </Button>
            <Button 
              onClick={() => handleAddCredits(250)} 
              disabled={isAddingCredits}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              {isAddingCredits ? <Loader2 className="h-3 w-3 animate-spin" /> : '+$250'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Usage */}
      <Card className="rounded-2xl shadow-lg border border-muted/60 bg-background/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Monthly Usage
          </CardTitle>
          <CardDescription>Track your spending against your monthly limit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">This month:</span>
              <span className="font-semibold">{formatCurrency(monthlySpent)}</span>
            </div>
            <Progress value={monthlyUsagePercent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>{Math.round(monthlyUsagePercent)}% used</span>
              <span>{formatCurrency(monthlyLimit)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Auto-recharge</span>
              <Button
                variant="outline"
                size="sm"
                className={creditBalance?.auto_recharge?.enabled ? 'bg-green-50 border-green-200 text-green-700' : ''}
              >
                {creditBalance?.auto_recharge?.enabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            {creditBalance?.auto_recharge?.enabled && (
              <div className="text-xs text-muted-foreground">
                Auto-add {formatCurrency(creditBalance.auto_recharge.amount)} when balance drops below {formatCurrency(creditBalance.auto_recharge.threshold)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="text-center p-2 bg-muted/30 rounded">
              <div className="text-xs text-muted-foreground">Remaining</div>
              <div className="font-semibold text-green-600">
                {formatCurrency(Math.max(0, monthlyLimit - monthlySpent))}
              </div>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded">
              <div className="text-xs text-muted-foreground">Days left</div>
              <div className="font-semibold">
                {Math.ceil((new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
