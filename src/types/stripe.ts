
export interface Customer {
  id: string;
  saas_id: string;
  stripe_customer_id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  stripe_subscription_id: string;
  customer_id: string;
  plan_id: string;
  price_id: string;
  status: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  created_at: string;
}

export interface CreditBalance {
  saas_id: string;
  balance: number;
  currency: string;
  last_updated: string;
  monthly_spent?: number;
  monthly_limit?: number;
  last_transaction?: {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    timestamp: string;
  };
  auto_recharge?: {
    enabled: boolean;
    amount: number;
    threshold: number;
  };
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'succeeded' | 'pending' | 'failed';
  created_at: string;
  created: string; // Add this for compatibility
  payment_method?: string;
}

export interface UsageRecord {
  id: string;
  saas_id: string;
  usage_type: string;
  quantity: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Request/Response types
export interface CreateCustomerRequest {
  saas_id: string;
  email: string;
  name: string;
}

export interface CreateSubscriptionRequest {
  price_id: string;
  plan_id: string;
}

export interface CreateSubscriptionResponse {
  subscription: Subscription;
  client_secret?: string;
}

export interface UpdateSubscriptionRequest {
  new_price_id: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  description?: string;
}

export interface CreditBalanceRequest {
  saas_id: string;
  amount: number;
}
