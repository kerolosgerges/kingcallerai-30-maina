import { 
  PhoneNumber,
  ImportPhoneNumberRequest,
  AvailablePhoneNumber,
  BuyPhoneNumberRequest,
  ApiResponse
} from './kingCallerTypes';
import { KingCallerAuthService } from './kingCallerAuthService';

export class KingCallerPhoneService {
  constructor(private authService: KingCallerAuthService) {}

  async importPhoneNumber(importData: ImportPhoneNumberRequest): Promise<PhoneNumber | null> {
    try {
      console.log('KingCaller: Importing phone number:', importData);
      
      const response = await this.authService.makeAuthenticatedRequest('/v1/phone-numbers/import', {
        method: 'POST',
        body: JSON.stringify(importData)
      });

      if (!response.ok) {
        throw new Error(`Failed to import phone number: ${response.status}`);
      }

      const data: ApiResponse<PhoneNumber> = await response.json();
      
      if (!data.success) {
        throw new Error(`Failed to import phone number: ${data.message}`);
      }

      console.log('KingCaller: Phone number imported successfully:', data.data);
      return data.data || null;
    } catch (error) {
      console.error('Error importing phone number:', error);
      throw error;
    }
  }

  async getPhoneNumberList(): Promise<PhoneNumber[]> {
    try {
      const response = await this.authService.makeAuthenticatedRequest('/v1/phone-numbers/list');

      if (!response.ok) {
        throw new Error(`Failed to fetch phone numbers: ${response.status}`);
      }

      const data: ApiResponse<PhoneNumber[]> = await response.json();
      console.log('KingCaller: Fetched phone numbers:', data.data);
      return data.success && data.data ? data.data : [];
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      throw error;
    }
  }

  async getAvailablePhoneNumbers(areaCode?: string): Promise<AvailablePhoneNumber[]> {
    try {
      let url = '/api/v1/phone-numbers/available';
      if (areaCode) {
        url += `?areaCode=${areaCode}`;
      }

      const response = await this.authService.makeAuthenticatedRequest(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch available phone numbers: ${response.status}`);
      }

      const data: ApiResponse<AvailablePhoneNumber[]> = await response.json();
      console.log('KingCaller: Fetched available phone numbers:', data.data);
      return data.success && data.data ? data.data : [];
    } catch (error) {
      console.error('Error fetching available phone numbers:', error);
      throw error;
    }
  }

  async buyPhoneNumber(buyData: BuyPhoneNumberRequest): Promise<PhoneNumber | null> {
    try {
      console.log('KingCaller: Buying phone number:', buyData);
      
      const response = await this.authService.makeAuthenticatedRequest('/api/v1/phone-numbers/buy', {
        method: 'POST',
        body: JSON.stringify(buyData)
      });

      if (!response.ok) {
        throw new Error(`Failed to buy phone number: ${response.status}`);
      }

      const data: ApiResponse<PhoneNumber> = await response.json();
      
      if (!data.success) {
        throw new Error(`Failed to buy phone number: ${data.message}`);
      }

      console.log('KingCaller: Phone number purchased successfully:', data.data);
      return data.data || null;
    } catch (error) {
      console.error('Error buying phone number:', error);
      throw error;
    }
  }

  async getSubAccountPhoneNumbers(subAccountId: string): Promise<PhoneNumber[]> {
    try {
      const response = await this.authService.makeAuthenticatedRequest(
        `/api/v1/phone-numbers/sub-account/${subAccountId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch sub-account phone numbers: ${response.status}`);
      }

      const data: ApiResponse<PhoneNumber[]> = await response.json();
      console.log('KingCaller: Fetched sub-account phone numbers:', data.data);
      return data.success && data.data ? data.data : [];
    } catch (error) {
      console.error('Error fetching sub-account phone numbers:', error);
      throw error;
    }
  }
}