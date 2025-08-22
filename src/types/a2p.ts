import { Timestamp } from 'firebase/firestore';

export interface A2PRegistration {
  id: string;
  subAccountId: string;
  status: 'draft' | 'brand_pending' | 'campaign_pending' | 'submitted' | 'approved' | 'rejected';
  currentStep: number;
  brandId?: string;
  campaignId?: string;
  phoneNumbers: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  submittedAt?: Timestamp;
  approvedAt?: Timestamp;
  completedBy: string;
  
  // Store form data for each step
  brandData?: any;
  campaignData?: any;
  phoneNumberData?: any;
  complianceData?: any;
}

export interface A2PBrand {
  id: string;
  subAccountId: string;
  registrationId: string;
  companyName: string;
  website: string;
  supportEmail: string;
  supportPhone: string;
  businessType: string;
  ein: string;
  registrationNumber: string;
  vertical: string;
  status: 'pending' | 'approved' | 'rejected';
  twilioSid?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface A2PCampaign {
  id: string;
  subAccountId: string;
  registrationId: string;
  brandId: string;
  campaignName: string;
  description: string;
  useCase: string;
  vertical: string;
  trafficType: string;
  sampleMessages: string[];
  sampleUrls: string[];
  status: 'pending' | 'approved' | 'rejected';
  twilioSid?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TwilioAttempt {
  id: string;
  subAccountId: string;
  registrationId: string;
  attemptType: 'brand_registration' | 'campaign_registration' | 'phone_assignment' | 'status_check';
  requestData: any;
  responseData?: any;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
  twilioSid?: string;
  createdAt: Timestamp;
  completedAt?: Timestamp;
}