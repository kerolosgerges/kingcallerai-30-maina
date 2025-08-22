import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { useBillingContext } from './BillingProvider';
import { toast } from 'sonner';
import { usePricingPlans } from '@/hooks/usePricingPlans';

const DynamicPricingPage = () => {
  const { subscription, createSubscription, isCreatingSubscription } = useBillingContext();
  const { plans, isLoading: isLoadingPlans } = usePricingPlans();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: any) => {
    setLoadingPlan(plan.id);
    
    try {
      await createSubscription(plan.priceId, plan.id);
      toast.success(`Successfully subscribed to ${plan.name} plan`);
    } catch (error) {
      console.error('Error selecting plan:', error);
      toast.error('Failed to subscribe to plan');
    } finally {
      setLoadingPlan(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return subscription?.plan_id === planId;
  };

  const isPlanLoading = (planId: string) => {
    return loadingPlan === planId || isCreatingSubscription;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoadingPlans) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Select the perfect plan for your business needs. All plans include our powerful AI technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const isActive = isCurrentPlan(plan.id);
          const isLoading = isPlanLoading(plan.id);
          
          return (
            <Card 
              key={plan.id}
              className={`relative p-8 ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-xl transform scale-105' 
                  : 'border border-gray-200'
              } ${isActive ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    ✨ Most Popular
                  </Badge>
                </div>
              )}

              {isActive && (
                <Badge 
                  variant="default" 
                  className="absolute -top-3 right-4 bg-green-600"
                >
                  Current Plan
                </Badge>
              )}

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                {plan.setupFee && (
                  <p className="text-sm text-gray-600">
                    {formatPrice(plan.setupFee)} setup fee
                  </p>
                )}
                {plan.activationFee && (
                  <p className="text-sm text-gray-600">
                    {formatPrice(plan.activationFee)} activation fee
                  </p>
                )}
                {!plan.setupFee && !plan.activationFee && (
                  <p className="text-sm text-gray-600">No setup fee</p>
                )}
              </div>

              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{formatPrice(plan.monthlyPrice)}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  + ${plan.perMinuteRate}/minute
                </p>
                {plan.concurrentCalls && (
                  <p className="text-xs text-gray-500 mt-1">
                    {plan.concurrentCalls}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular && !isActive
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : ''
                }`}
                variant={isActive ? "secondary" : plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan)}
                disabled={isActive || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isActive ? 'Current Plan' : isLoading ? 'Processing...' : 'Select Plan'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicPricingPage;