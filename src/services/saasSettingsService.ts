
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SaasSettings {
  id: string;
  saasId: string;
  ownerName: string;
  companyName: string;
  email: string; // readonly
  phone: string;
  website?: string;
  address: string;
  postalCode: string;
  industry: string;
  description?: string;
  logoUrl?: string;
  createdAt: any;
  updatedAt: any;
  createdBy: string;
}

export const saasSettingsService = {
  // Get SAAS settings for a sub-account
  getSaasSettings: async (subAccountId: string): Promise<SaasSettings | null> => {
    try {
      console.log('🔍 Loading SAAS settings for sub-account:', subAccountId);
      
      const settingsRef = doc(db, 'subAccounts', subAccountId, 'saas_settings', 'settings');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        return {
          id: settingsSnap.id,
          saasId: subAccountId,
          ...data
        } as SaasSettings;
      }
      
      console.log('❌ No SAAS settings found for sub-account:', subAccountId);
      return null;
    } catch (error) {
      console.error('Error getting SAAS settings:', error);
      return null;
    }
  },

  // Create SAAS settings
  createSaasSettings: async (subAccountId: string, data: Omit<SaasSettings, 'id' | 'saasId' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      console.log('✅ Creating SAAS settings for sub-account:', subAccountId);
      
      const settingsRef = doc(db, 'subAccounts', subAccountId, 'saas_settings', 'settings');
      await setDoc(settingsRef, {
        ...data,
        saasId: subAccountId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating SAAS settings:', error);
      throw error;
    }
  },

  // Update SAAS settings
  updateSaasSettings: async (subAccountId: string, data: Partial<Omit<SaasSettings, 'id' | 'saasId' | 'email' | 'createdAt'>>): Promise<void> => {
    try {
      console.log('🔄 Updating SAAS settings for sub-account:', subAccountId);
      
      const settingsRef = doc(db, 'subAccounts', subAccountId, 'saas_settings', 'settings');
      await updateDoc(settingsRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating SAAS settings:', error);
      throw error;
    }
  },

  // Create default settings from sub-account data
  createDefaultSettings: async (subAccountId: string, subAccountData: any, userId: string): Promise<void> => {
    try {
      const defaultSettings = {
        ownerName: subAccountData.name || 'Business Owner',
        companyName: subAccountData.name || 'My Business',
        email: subAccountData.email || '',
        phone: subAccountData.phone || '',
        website: subAccountData.website || '',
        address: subAccountData.address || '',
        postalCode: subAccountData.postalCode || '',
        industry: subAccountData.industry || '',
        description: subAccountData.description || '',
        logoUrl: subAccountData.logoUrl || '',
        createdBy: userId
      };

      await saasSettingsService.createSaasSettings(subAccountId, defaultSettings);
    } catch (error) {
      console.error('Error creating default SAAS settings:', error);
      throw error;
    }
  }
};
