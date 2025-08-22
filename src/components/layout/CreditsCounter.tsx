
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSubAccount } from '@/contexts/SubAccountContext';

interface WalletBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

export const CreditsCounter = () => {
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const { currentSubAccount } = useSubAccount();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser && currentSubAccount) {
      loadWalletBalance();
    }
  }, [currentUser, currentSubAccount]);

  const loadWalletBalance = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real implementation, this would fetch from your backend/Firebase
      const mockBalance: WalletBalance = {
        balance: 47.82,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
      };
      
      setWalletBalance(mockBalance);
    } catch (error) {
      console.error('Error loading wallet balance:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet balance.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCredits = () => {
    toast({
      title: "Add Credits",
      description: "Redirecting to add credits page...",
    });
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(balance);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <Card className="shadow-none border-muted/50 bg-background/80">
      <CardContent className="flex items-center gap-2 p-2">
        <Wallet className="h-4 w-4 text-green-600" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {walletBalance ? formatBalance(walletBalance.balance) : '$0.00'}
          </span>
          <span className="text-xs text-muted-foreground">Credits</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 ml-1"
          onClick={handleAddCredits}
          title="Add Credits"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
};
