
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { stripeService } from '@/services/stripeService';
import { CreditBalance, PaymentHistory, Subscription } from '@/types/stripe';
import { toast } from 'sonner';

export interface BillingState {
  subscription: Subscription | null;
  creditBalance: CreditBalance | null;
  paymentHistory: PaymentHistory[];
  loading: boolean;
  error: string | null;
}

export const useBilling = () => {
  const { currentUser } = useAuth();
  const { currentSubAccount } = useSubAccount();
  const queryClient = useQueryClient();
  const [billingState, setBillingState] = useState<BillingState>({
    subscription: null,
    creditBalance: null,
    paymentHistory: [],
    loading: false,
    error: null
  });

  const saasId = currentSubAccount?.id;

  // Query for subscription data
  const subscriptionQuery = useQuery({
    queryKey: ['subscription', saasId],
    queryFn: () => {
      if (!saasId) throw new Error('No sub-account selected');
      return stripeService.getSubscription(saasId);
    },
    enabled: !!saasId,
    retry: false,
    refetchOnWindowFocus: false
  });

  // Query for credit balance
  const creditBalanceQuery = useQuery({
    queryKey: ['creditBalance', saasId],
    queryFn: () => {
      if (!saasId) throw new Error('No sub-account selected');
      return stripeService.getCreditBalance({ saas_id: saasId, amount: 0 });
    },
    enabled: !!saasId,
    retry: false,
    refetchOnWindowFocus: false
  });

  // Query for payment history
  const paymentHistoryQuery = useQuery({
    queryKey: ['paymentHistory', saasId],
    queryFn: () => {
      if (!saasId) throw new Error('No sub-account selected');
      return stripeService.getPaymentHistory(saasId);
    },
    enabled: !!saasId,
    retry: false,
    refetchOnWindowFocus: false
  });

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async () => {
      if (!saasId || !currentUser?.email || !currentSubAccount?.name) {
        throw new Error('Missing required data for customer creation');
      }
      return stripeService.createCustomer({
        saas_id: saasId,
        email: currentUser.email,
        name: currentSubAccount.name
      });
    },
    onSuccess: () => {
      toast.success('Customer account created successfully');
      queryClient.invalidateQueries({ queryKey: ['subscription', saasId] });
    },
    onError: (error) => {
      console.error('Failed to create customer:', error);
      toast.error('Failed to create customer account');
    }
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async ({ priceId, planId }: { priceId: string; planId: string }) => {
      if (!saasId) throw new Error('No sub-account selected');
      return stripeService.createSubscription({ price_id: priceId, plan_id: planId }, saasId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscription', saasId] });
      toast.success('Subscription created successfully');
      
      // Handle client secret for payment confirmation if needed
      if (data.client_secret) {
        console.log('Payment confirmation required:', data.client_secret);
      }
    },
    onError: (error) => {
      console.error('Failed to create subscription:', error);
      toast.error('Failed to create subscription');
    }
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!billingState.subscription) throw new Error('No active subscription');
      return stripeService.cancelSubscription(billingState.subscription.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', saasId] });
      toast.success('Subscription cancelled successfully');
    },
    onError: (error) => {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  });

  // Add credits mutation (creates payment intent)
  const addCreditsMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!saasId) throw new Error('No sub-account selected');
      return stripeService.createPaymentIntent({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        description: `Add $${amount} credits`
      }, saasId);
    },
    onSuccess: (data) => {
      toast.success('Payment intent created. Complete payment to add credits.');
      console.log('Payment intent:', data);
      
      // In a real implementation, you would redirect to Stripe checkout
      // or show a payment form using the client_secret
      if (data.client_secret) {
        // Handle payment flow here
        console.log('Client secret for payment:', data.client_secret);
      }
    },
    onError: (error) => {
      console.error('Failed to add credits:', error);
      toast.error('Failed to add credits');
    }
  });

  // Update billing state when queries change
  useEffect(() => {
    const loading = subscriptionQuery.isLoading || creditBalanceQuery.isLoading || paymentHistoryQuery.isLoading;
    const error = subscriptionQuery.error?.message || creditBalanceQuery.error?.message || paymentHistoryQuery.error?.message || null;

    setBillingState({
      subscription: subscriptionQuery.data || null,
      creditBalance: creditBalanceQuery.data || null,
      paymentHistory: paymentHistoryQuery.data || [],
      loading,
      error
    });
  }, [
    subscriptionQuery.data, subscriptionQuery.isLoading, subscriptionQuery.error,
    creditBalanceQuery.data, creditBalanceQuery.isLoading, creditBalanceQuery.error,
    paymentHistoryQuery.data, paymentHistoryQuery.isLoading, paymentHistoryQuery.error
  ]);

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['subscription', saasId] });
    queryClient.invalidateQueries({ queryKey: ['creditBalance', saasId] });
    queryClient.invalidateQueries({ queryKey: ['paymentHistory', saasId] });
  }, [queryClient, saasId]);

  const createCustomer = useCallback(async () => {
    return createCustomerMutation.mutateAsync();
  }, [createCustomerMutation]);

  const createSubscription = useCallback(async (priceId: string, planId: string) => {
    return createSubscriptionMutation.mutateAsync({ priceId, planId });
  }, [createSubscriptionMutation]);

  const cancelSubscription = useCallback(async () => {
    return cancelSubscriptionMutation.mutateAsync();
  }, [cancelSubscriptionMutation]);

  const addCredits = useCallback(async (amount: number) => {
    return addCreditsMutation.mutateAsync(amount);
  }, [addCreditsMutation]);

  return {
    ...billingState,
    refreshData,
    createCustomer,
    createSubscription,
    cancelSubscription,
    addCredits,
    isCreatingCustomer: createCustomerMutation.isPending,
    isCreatingSubscription: createSubscriptionMutation.isPending,
    isCancellingSubscription: cancelSubscriptionMutation.isPending,
    isAddingCredits: addCreditsMutation.isPending
  };
};
