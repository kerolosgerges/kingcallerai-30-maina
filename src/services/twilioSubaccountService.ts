
import { 
  TwilioSubAccount, 
  TwilioPhoneNumber, 
  CreateSubAccountRequest, 
  PurchasePhoneNumberRequest,
  TwilioApiResponse 
} from '@/types/twilio';

export class TwilioSubaccountService {
  private baseUrl = 'https://voiceai.kingcaller.ai';
  private saasId: string | null = null;
  
  setSaasId(saasId: string) {
    this.saasId = saasId;
  }

  private getHeaders(includeSubaccountSid?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.saasId) {
      headers['X-Saas-Id'] = this.saasId;
    }

    if (includeSubaccountSid) {
      headers['X-Subaccount-Sid'] = includeSubaccountSid;
    }

    return headers;
  }
  
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {},
    subaccountSid?: string
  ): Promise<TwilioApiResponse<T>> {
    try {
      console.log(`🔄 Making request to: ${this.baseUrl}${endpoint}`);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(subaccountSid),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('❌ Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async createSubAccount(request: CreateSubAccountRequest): Promise<TwilioApiResponse<TwilioSubAccount>> {
    console.log('🏗️ Creating Twilio subaccount:', request);
    
    return this.makeRequest<TwilioSubAccount>('/subaccounts', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async listSubAccounts(): Promise<TwilioApiResponse<TwilioSubAccount[]>> {
    console.log('📋 Fetching Twilio subaccounts');
    
    return this.makeRequest<TwilioSubAccount[]>('/subaccounts');
  }

  async getSubAccountDetails(subAccountSid: string): Promise<TwilioApiResponse<TwilioSubAccount>> {
    console.log('🔍 Fetching subaccount details:', subAccountSid);
    
    return this.makeRequest<TwilioSubAccount>(`/subaccounts/${subAccountSid}`);
  }

  async purchasePhoneNumber(request: PurchasePhoneNumberRequest, subAccountSid: string): Promise<TwilioApiResponse<TwilioPhoneNumber>> {
    console.log('📞 Purchasing phone number:', request);
    
    return this.makeRequest<TwilioPhoneNumber>('/purchase_phone_number', {
      method: 'POST',
      body: JSON.stringify(request),
    }, subAccountSid);
  }

  async getSubAccountPhoneNumbers(subAccountSid: string): Promise<TwilioApiResponse<TwilioPhoneNumber[]>> {
    console.log('📱 Fetching phone numbers for subaccount:', subAccountSid);
    
    return this.makeRequest<TwilioPhoneNumber[]>(`/subaccounts/${subAccountSid}/phone-numbers`);
  }
}

export const twilioSubaccountService = new TwilioSubaccountService();
