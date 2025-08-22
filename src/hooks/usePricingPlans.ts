import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { stripeService } from '@/services/stripeService';
import { Calculator, Bot, Users2 } from 'lucide-react';

export interface PricingPlan {
  id: string;
  priceId: string;
  name: string;
  monthlyPrice: number;
  setupFee: number | null;
  activationFee: number | null;
  perMinuteRate: number;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  features: string[];
  concurrentCalls?: string;
}

// Default plans that match the image design
const defaultPlans: PricingPlan[] = [
  {
    id: 'business',
    priceId: 'price_business_monthly',
    name: 'Business',
    monthlyPrice: 499,
    setupFee: 4000,
    activationFee: null,
    perMinuteRate: 0.20,
    icon: Calculator,
    popular: false,
    concurrentCalls: 'Unlimited concurrent calls',
    features: [
      'Done-for-you outbound calling agents',
      'Done-for-you AI receptionist',
      'Website & ad integration',
      'Connect to current systems',
      'Advanced analytics',
      'Dedicated account manager'
    ]
  },
  {
    id: 'ai-receptionist',
    priceId: 'price_ai_receptionist_monthly',
    name: 'AI Receptionist',
    monthlyPrice: 1000,
    setupFee: null,
    activationFee: 1997,
    perMinuteRate: 0.25,
    icon: Bot,
    popular: true,
    concurrentCalls: 'Unlimited concurrent calls',
    features: [
      'Whiteglove Onboarding',
      'Done-for-you AI receptionist',
      'CRM integration setup',
      'System integration',
      'Priority support',
      'Custom training'
    ]
  },
  {
    id: 'agency',
    priceId: 'price_agency_monthly',
    name: 'Agency',
    monthlyPrice: 1500,
    setupFee: null,
    activationFee: null,
    perMinuteRate: 0.16,
    icon: Users2,
    popular: false,
    concurrentCalls: 'Unlimited everything',
    features: [
      'Charge whatever you want',
      'Unlimited whitelabeling',
      'Custom branding solution',
      'Multi-tenant management',
      'Revenue sharing options',
      'White-label support'
    ]
  }
];

export const usePricingPlans = () => {
  const [plans, setPlans] = useState<PricingPlan[]>(defaultPlans);

  const plansQuery = useQuery({
    queryKey: ['pricingPlans'],
    queryFn: async () => {
      try {
        const apiPlans = await stripeService.getPlans();
        
        // Transform API response to match our PricingPlan interface
        // This is where you would map the Stripe products/prices to your plan structure
        if (apiPlans && apiPlans.length > 0) {
          return apiPlans.map(plan => ({
            id: plan.metadata?.plan_id || plan.id,
            priceId: plan.prices?.[0]?.id || plan.default_price,
            name: plan.name,
            monthlyPrice: plan.prices?.[0]?.unit_amount ? plan.prices[0].unit_amount / 100 : 0,
            setupFee: plan.metadata?.setup_fee ? parseInt(plan.metadata.setup_fee) : null,
            activationFee: plan.metadata?.activation_fee ? parseInt(plan.metadata.activation_fee) : null,
            perMinuteRate: plan.metadata?.per_minute_rate ? parseFloat(plan.metadata.per_minute_rate) : 0,
            icon: getIconForPlan(plan.metadata?.plan_id || plan.id),
            popular: plan.metadata?.popular === 'true',
            features: plan.metadata?.features ? JSON.parse(plan.metadata.features) : [],
            concurrentCalls: plan.metadata?.concurrent_calls
          }));
        }
        
        return defaultPlans;
      } catch (error) {
        console.error('Failed to fetch pricing plans:', error);
        return defaultPlans;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (plansQuery.data) {
      setPlans(plansQuery.data);
    }
  }, [plansQuery.data]);

  return {
    plans,
    isLoading: plansQuery.isLoading,
    error: plansQuery.error,
    refetch: plansQuery.refetch
  };
};

// Helper function to map plan IDs to icons
function getIconForPlan(planId: string) {
  switch (planId) {
    case 'business':
      return Calculator;
    case 'ai-receptionist':
      return Bot;
    case 'agency':
      return Users2;
    default:
      return Calculator;
  }
}