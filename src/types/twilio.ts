
export interface TwilioSubAccount {
  sid: string;
  friendly_name: string;
  status: 'active' | 'suspended' | 'closed';
  auth_token?: string;
  date_created: string;
  date_updated: string;
  owner_account_sid?: string;
}

export interface TwilioPhoneNumber {
  sid: string;
  phone_number: string;
  friendly_name: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
  status: string;
  date_created: string;
  date_updated: string;
}

export interface CreateSubAccountRequest {
  friendly_name: string;
}

export interface PurchasePhoneNumberRequest {
  country_code: string;
  phone_number_type?: 'local' | 'toll_free';
  area_code?: string;
  contains?: string;
  phone_number?: string;
}

export interface TwilioApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
