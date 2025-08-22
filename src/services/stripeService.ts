
import {
  Customer,
  Subscription,
  PaymentIntent,
  CreditBalance,
  PaymentHistory,
  CreateCustomerRequest,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  UpdateSubscriptionRequest,
  CreatePaymentIntentRequest,
  CreditBalanceRequest
} from '@/types/stripe';

class StripeService {
  private baseUrl = 'https://voiceai.kingcaller.ai/billing';

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Customer operations
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return this.makeRequest<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCustomer(saasId: string): Promise<Customer> {
    return this.makeRequest<Customer>(`/customers/${saasId}`);
  }

  // Subscription operations
  async createSubscription(
    data: CreateSubscriptionRequest,
    saasId: string
  ): Promise<CreateSubscriptionResponse> {
    return this.makeRequest<CreateSubscriptionResponse>('/subscriptions', {
      method: 'POST',
      headers: {
        'X-Saas-Id': saasId,
      },
      body: JSON.stringify(data),
    });
  }

  async getSubscription(saasId: string): Promise<Subscription> {
    return this.makeRequest<Subscription>(`/subscriptions/${saasId}`);
  }

  async updateSubscription(
    subscriptionId: string,
    data: UpdateSubscriptionRequest
  ): Promise<Subscription> {
    return this.makeRequest<Subscription>(`/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    return this.makeRequest<void>(`/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
    });
  }

  // Payment operations
  async createPaymentIntent(
    data: CreatePaymentIntentRequest,
    saasId: string
  ): Promise<PaymentIntent> {
    return this.makeRequest<PaymentIntent>('/payments/intents', {
      method: 'POST',
      headers: {
        'X-Saas-Id': saasId,
      },
      body: JSON.stringify(data),
    });
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    return this.makeRequest<PaymentIntent>(`/payments/confirm/${paymentIntentId}`, {
      method: 'POST',
      body: JSON.stringify({ payment_method_id: paymentMethodId }),
    });
  }

  async getPaymentHistory(saasId: string): Promise<PaymentHistory[]> {
    const response = await this.makeRequest<{ payments: PaymentHistory[] }>(`/payments/history/${saasId}`);
    return response.payments || [];
  }

  // Credit operations
  async getCreditBalance(data: CreditBalanceRequest): Promise<CreditBalance> {
    const response = await this.makeRequest<{ saas_id: string; credit_balance: number }>('/credits/balance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Transform the API response to match our CreditBalance interface
    return {
      saas_id: response.saas_id,
      balance: response.credit_balance,
      currency: 'usd',
      last_updated: new Date().toISOString(),
    };
  }

  // Usage operations
  async recordUsage(saasId: string, serviceType: string, quantity: number, metadata?: Record<string, any>): Promise<void> {
    return this.makeRequest<void>('/usage/record', {
      method: 'POST',
      headers: {
        'X-Saas-Id': saasId,
      },
      body: JSON.stringify({
        service_type: serviceType,
        quantity,
        metadata,
      }),
    });
  }

  async getUsage(saasId: string, period?: string): Promise<any> {
    const url = period ? `/usage/${saasId}?period=${period}` : `/usage/${saasId}`;
    return this.makeRequest<any>(url);
  }
}

export const stripeService = new StripeService();
