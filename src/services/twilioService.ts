// Twilio Service for managing subaccounts
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { twilioConfig } from '@/config/twilioConfig';

export interface TwilioSubAccount {
  auth_token: string;
  date_created: string;
  date_updated: string;
  friendly_name: string;
  owner_account_sid: string;
  sid: string;
  status: string;
  subresource_uris: {
    addresses: string;
    applications: string;
    authorized_connect_apps: string;
    available_phone_numbers: string;
    balance: string;
    calls: string;
    conferences: string;
    connect_apps: string;
    incoming_phone_numbers: string;
    keys: string;
    messages: string;
    notifications: string;
    outgoing_caller_ids: string;
    queues: string;
    recordings: string;
    short_codes: string;
    signing_keys: string;
    sip: string;
    transcriptions: string;
    usage: string;
  };
  type: string;
  uri: string;
}

export class TwilioService {
  private static instance: TwilioService;
  
  private constructor() {}
  
  public static getInstance(): TwilioService {
    if (!TwilioService.instance) {
      TwilioService.instance = new TwilioService();
    }
    return TwilioService.instance;
  }

  /**
   * Create a new Twilio subaccount
   */
  async createSubAccount(friendlyName: string): Promise<TwilioSubAccount | null> {
    try {
      const config = twilioConfig;
      
      // Check if we have the required credentials
      if (!config.accountSid || !config.authToken) {
        console.error('Twilio credentials not configured');
        throw new Error('Twilio credentials not configured');
      }

      // Create the authorization header
      const credentials = btoa(`${config.accountSid}:${config.authToken}`);
      
      // Prepare form data
      const formData = new FormData();
      formData.append('FriendlyName', friendlyName);

      const response = await fetch('https://api.twilio.com/2010-04-01/Accounts.json', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Twilio API Error:', response.status, errorText);
        throw new Error(`Twilio API Error: ${response.status} ${response.statusText}`);
      }

      const twilioSubAccount: TwilioSubAccount = await response.json();
      console.log('✅ Twilio subaccount created:', twilioSubAccount.sid);
      
      return twilioSubAccount;
    } catch (error) {
      console.error('Failed to create Twilio subaccount:', error);
      throw error;
    }
  }

  /**
   * Store Twilio subaccount data in Firebase
   */
  async storeTwilioSubAccount(subAccountId: string, twilioData: TwilioSubAccount): Promise<void> {
    try {
      const twilioDocRef = doc(db, 'twilio_subaccounts', subAccountId);
      
      await setDoc(twilioDocRef, {
        ...twilioData,
        linkedSubAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('✅ Twilio subaccount data stored in Firebase');
    } catch (error) {
      console.error('Failed to store Twilio subaccount data:', error);
      throw error;
    }
  }

  /**
   * Get Twilio subaccount data from Firebase
   */
  async getTwilioSubAccount(subAccountId: string): Promise<TwilioSubAccount | null> {
    try {
      const twilioDocRef = doc(db, 'twilio_subaccounts', subAccountId);
      const twilioDoc = await getDoc(twilioDocRef);
      
      if (twilioDoc.exists()) {
        return twilioDoc.data() as TwilioSubAccount;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get Twilio subaccount data:', error);
      throw error;
    }
  }

  /**
   * Create Twilio subaccount and store in Firebase (combined operation)
   */
  async createAndStoreSubAccount(subAccountId: string): Promise<TwilioSubAccount | null> {
    try {
      console.log('🔄 Creating Twilio subaccount for:', subAccountId);
      
      // Create Twilio subaccount with the Firebase subaccount ID as friendly name
      const twilioSubAccount = await this.createSubAccount(subAccountId);
      
      if (twilioSubAccount) {
        // Store in Firebase
        await this.storeTwilioSubAccount(subAccountId, twilioSubAccount);
        console.log('✅ Twilio subaccount created and stored successfully');
        return twilioSubAccount;
      }
      return null;
    } catch (error) {
      console.error('Failed to create and store Twilio subaccount:', error);
      throw error;
    }
  }

  
}

// Export singleton instance
export const twilioService = TwilioService.getInstance();