
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSubAccount } from './SubAccountContext';
import { stripeService } from '@/services/stripeService';
import { Customer, Subscription, CreditBalance, PaymentHistory } from '@/types/stripe';
import { toast } from 'sonner';

interface StripeContextType {
  customer: Customer | null;
  subscription: Subscription | null;
  creditBalance: CreditBalance | null;
  paymentHistory: PaymentHistory[];
  loading: boolean;
  error: string | null;
  
  // Actions
  createCustomer: () => Promise<void>;
  createSubscription: (priceId: string) => Promise<void>;
  updateSubscription: (priceId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { currentSubAccount } = useSubAccount();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saasId = currentSubAccount?.id;

  const createCustomer = useCallback(async () => {
    if (!currentUser || !currentSubAccount) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const customerData = await stripeService.createCustomer({
        saas_id: currentSubAccount.id,
        email: currentUser.email!,
        name: currentSubAccount.name
      });
      setCustomer(customerData);
      toast.success('Customer account created successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create customer';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [currentUser, currentSubAccount]);

  const createSubscription = useCallback(async (priceId: string) => {
    if (!saasId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const subscriptionData = await stripeService.createSubscription({
        price_id: priceId,
        plan_id: priceId // Using price_id as plan_id for simplicity
      }, saasId);
      setSubscription(subscriptionData.subscription);
      toast.success('Subscription created successfully');
      
      // Redirect to Stripe checkout if needed
      if (subscriptionData.client_secret) {
        // Handle payment confirmation if needed
        console.log('Payment confirmation required:', subscriptionData.client_secret);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create subscription';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [saasId]);

  const updateSubscription = useCallback(async (priceId: string) => {
    if (!subscription) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedSubscription = await stripeService.updateSubscription(subscription.id, {
        new_price_id: priceId
      });
      setSubscription(updatedSubscription);
      toast.success('Subscription updated successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update subscription';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [subscription]);

  const cancelSubscription = useCallback(async () => {
    if (!subscription) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await stripeService.cancelSubscription(subscription.id);
      setSubscription(null);
      toast.success('Subscription cancelled successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [subscription]);

  const addCredits = useCallback(async (amount: number) => {
    if (!saasId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const paymentIntent = await stripeService.createPaymentIntent({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        description: `Add ${amount} credits`
      }, saasId);
      
      // In a real implementation, you'd handle the payment confirmation
      // For now, we'll just show the payment intent was created
      toast.success('Payment intent created. Please complete payment.');
      console.log('Payment intent:', paymentIntent);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add credits';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [saasId]);

  const refreshData = useCallback(async () => {
    if (!saasId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load all data in parallel
      const [customerData, subscriptionData, creditData, historyData] = await Promise.allSettled([
        stripeService.getCustomer(saasId),
        stripeService.getSubscription(saasId),
        stripeService.getCreditBalance({ saas_id: saasId, amount: 0 }),
        stripeService.getPaymentHistory(saasId)
      ]);

      if (customerData.status === 'fulfilled') {
        setCustomer(customerData.value);
      }
      
      if (subscriptionData.status === 'fulfilled') {
        setSubscription(subscriptionData.value);
      }
      
      if (creditData.status === 'fulfilled') {
        setCreditBalance(creditData.value);
      }
      
      if (historyData.status === 'fulfilled') {
        setPaymentHistory(historyData.value);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to refresh data';
      setError(errorMsg);
      console.error('Error refreshing stripe data:', err);
    } finally {
      setLoading(false);
    }
  }, [saasId]);

  // Auto-load data when subaccount changes
  useEffect(() => {
    if (currentUser && currentSubAccount) {
      refreshData();
    }
  }, [currentUser, currentSubAccount, refreshData]);

  // Auto-create customer if needed
  useEffect(() => {
    if (currentUser && currentSubAccount && !customer && !loading) {
      createCustomer();
    }
  }, [currentUser, currentSubAccount, customer, loading, createCustomer]);

  const value = {
    customer,
    subscription,
    creditBalance,
    paymentHistory,
    loading,
    error,
    createCustomer,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    addCredits,
    refreshData
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};
