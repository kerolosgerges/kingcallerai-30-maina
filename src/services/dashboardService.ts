
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface DashboardSettings {
  gridOrder: string[];
  lastUpdated: string;
}

export const saveDashboardOrder = async (userId: string, gridOrder: string[]): Promise<void> => {
  try {
    const userSettingsRef = doc(db, 'users', userId, 'settings', 'dashboard');
    const settings: DashboardSettings = {
      gridOrder,
      lastUpdated: new Date().toISOString()
    };
    
    await setDoc(userSettingsRef, settings, { merge: true });
    console.log('Dashboard order saved successfully');
  } catch (error) {
    console.error('Error saving dashboard order:', error);
    throw error;
  }
};

export const loadDashboardOrder = async (userId: string): Promise<string[]> => {
  try {
    const userSettingsRef = doc(db, 'users', userId, 'settings', 'dashboard');
    const docSnap = await getDoc(userSettingsRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as DashboardSettings;
      return data.gridOrder || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error loading dashboard order:', error);
    return [];
  }
};
