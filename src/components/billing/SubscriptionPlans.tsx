
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Phone, Bot, Building, Users, Loader2 } from 'lucide-react';
import { useBillingContext } from './BillingProvider';
import { toast } from 'sonner';

const plans = [
  {
    id: 'basic',
    priceId: 'price_basic_monthly', // Replace with actual Stripe price ID
    name: 'Basic',
    price: '$30',
    period: '/month',
    setup: 'Free for 10 minutes',
    perMinute: '$0.45/minute',
    maxCalls: '20 concurrent calls',
    icon: Phone,
    popular: false,
    features: [
      'Free 10 minutes trial',
      'Up to 20 concurrent calls',
      'Create your own agents',
      'API Access',
      'Basic analytics',
      'Email support'
    ]
  },
  {
    id: 'ai-receptionist',
    priceId: 'price_ai_receptionist_monthly', // Replace with actual Stripe price ID
    name: 'AI Receptionist',
    price: '$997',
    period: '/month',
    setup: '$1,997 activation fee',
    perMinute: '$0.25/minute',
    maxCalls: 'Unlimited concurrent calls',
    icon: Bot,
    popular: true,
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
    id: 'business',
    priceId: 'price_business_monthly', // Replace with actual Stripe price ID
    name: 'Business',
    price: '$497',
    period: '/month',
    setup: '$4,000 setup fee',
    perMinute: '$0.20/minute',
    maxCalls: 'Unlimited concurrent calls',
    icon: Building,
    popular: false,
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
    id: 'agency',
    priceId: 'price_agency_monthly', // Replace with actual Stripe price ID
    name: 'Agency',
    price: '$6,500',
    period: '/month',
    setup: 'No setup fee',
    perMinute: '$0.16/minute',
    maxCalls: 'Unlimited everything',
    icon: Users,
    popular: false,
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

export const SubscriptionPlans = () => {
  const { subscription, createSubscription, isCreatingSubscription } = useBillingContext();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    setLoadingPlan(plan.id);
    
    try {
      await createSubscription(plan.priceId, plan.id);
      toast.success(`Selected ${plan.name} plan`);
    } catch (error) {
      console.error('Error selecting plan:', error);
      toast.error('Failed to select plan');
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your business needs. All plans include our powerful AI technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const isActive = isCurrentPlan(plan.id);
          const isLoading = isPlanLoading(plan.id);
          
          return (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-200 ${
                plan.popular ? 'border-primary shadow-lg scale-105' : ''
              } ${isActive ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              {isActive && (
                <Badge 
                  variant="default" 
                  className="absolute -top-2 right-4 bg-green-600"
                >
                  Current Plan
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.setup}</CardDescription>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    + {plan.perMinute}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {plan.maxCalls}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={isActive ? "secondary" : plan.popular ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isActive || isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isActive ? 'Current Plan' : isLoading ? 'Processing...' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center space-y-4 pt-8">
        <h3 className="text-2xl font-semibold">Need a Custom Solution?</h3>
        <p className="text-muted-foreground">
          Contact our sales team for enterprise pricing and custom features.
        </p>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </div>
  );
};
