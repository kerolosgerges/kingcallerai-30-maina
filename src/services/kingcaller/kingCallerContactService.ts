import { 
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  BulkCreateContactsRequest,
  BulkImportPincodeRequest,
  ContactListResponse,
  ContactDetailsResponse,
  ApiResponse
} from './kingCallerTypes';
import { KingCallerAuthService } from './kingCallerAuthService';

export class KingCallerContactService {
  constructor(private authService: KingCallerAuthService) {}

  async createContact(contactData: CreateContactRequest): Promise<string | null> {
    try {
      console.log('KingCaller: Creating contact:', contactData);
      
      const response = await this.authService.makeAuthenticatedRequest('/v1/contacts/create', {
        method: 'POST',
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create contact: ${response.status}`);
      }

      const data: ApiResponse<Contact> = await response.json();
      
      if (!data.success) {
        throw new Error(`Failed to create contact: ${data.message}`);
      }

      console.log('KingCaller: Contact created successfully:', data.data);
      return data.data?.id || null;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async getContactList(
    page: number = 1, 
    limit: number = 100, 
    search: string = ''
  ): Promise<Contact[]> {
    try {
      let url = `/v1/contacts/list?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await this.authService.makeAuthenticatedRequest(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch contacts: ${response.status}`);
      }

      const data: ContactListResponse = await response.json();
      console.log('KingCaller: Fetched contacts:', data.data);
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async getContactById(contactId: string): Promise<Contact | null> {
    try {
      const response = await this.authService.makeAuthenticatedRequest(
        `/v1/contacts/findById/${contactId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch contact: ${response.status}`);
      }

      const data: ContactDetailsResponse = await response.json();
      console.log('KingCaller: Fetched contact details:', data.data);
      return data.success && data.data ? data.data : null;
    } catch (error) {
      console.error('Error fetching contact details:', error);
      throw error;
    }
  }

  async updateContact(contactId: string, contactData: UpdateContactRequest): Promise<Contact | null> {
    try {
      console.log('KingCaller: Updating contact:', { contactId, contactData });
      
      const response = await this.authService.makeAuthenticatedRequest(`/v1/contacts/update/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update contact: ${response.status}`);
      }

      const data: ApiResponse<Contact> = await response.json();
      
      if (!data.success) {
        throw new Error(`Failed to update contact: ${data.message}`);
      }

      console.log('KingCaller: Contact updated successfully:', data.data);
      return data.data || null;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async deleteContact(contactId: string): Promise<boolean> {
    try {
      console.log('KingCaller: Deleting contact:', contactId);
      
      const response = await this.authService.makeAuthenticatedRequest(`/v1/contacts/delete/${contactId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete contact: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(`Failed to delete contact: ${data.message}`);
      }

      console.log('KingCaller: Contact deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  async bulkCreateContacts(bulkData: BulkCreateContactsRequest): Promise<boolean> {
    try {
      console.log('KingCaller: Bulk creating contacts:', bulkData);
      
      const response = await this.authService.makeAuthenticatedRequest('/v1/contacts/bulk-create', {
        method: 'POST',
        body: JSON.stringify(bulkData)
      });

      if (!response.ok) {
        throw new Error(`Failed to bulk create contacts: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(`Failed to bulk create contacts: ${data.message}`);
      }

      console.log('KingCaller: Contacts bulk created successfully');
      return true;
    } catch (error) {
      console.error('Error bulk creating contacts:', error);
      throw error;
    }
  }

  async bulkImportPincode(pincodeData: BulkImportPincodeRequest): Promise<boolean> {
    try {
      console.log('KingCaller: Bulk importing pincodes:', pincodeData);
      
      const response = await this.authService.makeAuthenticatedRequest('/v1/contacts/allowed-pincode/create', {
        method: 'POST',
        body: JSON.stringify(pincodeData)
      });

      if (!response.ok) {
        throw new Error(`Failed to bulk import pincodes: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(`Failed to bulk import pincodes: ${data.message}`);
      }

      console.log('KingCaller: Pincodes bulk imported successfully');
      return true;
    } catch (error) {
      console.error('Error bulk importing pincodes:', error);
      throw error;
    }
  }
}