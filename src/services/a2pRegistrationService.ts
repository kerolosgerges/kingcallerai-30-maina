import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { A2PRegistration, TwilioAttempt } from '@/types/a2p';

export class A2PRegistrationService {
  
  static async createRegistration(subAccountId: string, completedBy: string): Promise<string> {
    const registrationData = {
      subAccountId,
      status: 'draft' as const,
      currentStep: 0,
      phoneNumbers: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completedBy
    };

    const docRef = await addDoc(collection(db, 'a2pRegistrations'), registrationData);
    return docRef.id;
  }

  static async getRegistration(registrationId: string): Promise<A2PRegistration | null> {
    try {
      const docRef = doc(db, 'a2pRegistrations', registrationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as A2PRegistration;
      }
      return null;
    } catch (error) {
      console.error('Error getting registration:', error);
      return null;
    }
  }

  static async getActiveRegistration(subAccountId: string): Promise<A2PRegistration | null> {
    try {
      const q = query(
        collection(db, 'a2pRegistrations'),
        where('subAccountId', '==', subAccountId),
        where('status', 'in', ['draft', 'brand_pending', 'campaign_pending']),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as A2PRegistration;
      }
      return null;
    } catch (error) {
      console.error('Error getting active registration:', error);
      return null;
    }
  }

  static async updateRegistration(registrationId: string, data: Partial<A2PRegistration>): Promise<void> {
    try {
      const docRef = doc(db, 'a2pRegistrations', registrationId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating registration:', error);
      throw error;
    }
  }

  static async updateStep(registrationId: string, step: number, stepData: any): Promise<void> {
    try {
      const updateData: any = {
        currentStep: step,
        updatedAt: serverTimestamp()
      };

      // Store step-specific data
      switch (step) {
        case 1:
          updateData.brandData = stepData;
          break;
        case 2:
          updateData.campaignData = stepData;
          break;
        case 3:
          updateData.phoneNumberData = stepData;
          updateData.phoneNumbers = stepData.phoneNumbers || [];
          break;
        case 4:
          updateData.complianceData = stepData;
          break;
      }

      await this.updateRegistration(registrationId, updateData);
    } catch (error) {
      console.error('Error updating step:', error);
      throw error;
    }
  }

  static async submitRegistration(registrationId: string): Promise<void> {
    try {
      await this.updateRegistration(registrationId, {
        status: 'submitted',
        submittedAt: serverTimestamp() as Timestamp
      });
    } catch (error) {
      console.error('Error submitting registration:', error);
      throw error;
    }
  }

  static subscribeToRegistration(
    registrationId: string, 
    callback: (registration: A2PRegistration | null) => void
  ): () => void {
    const docRef = doc(db, 'a2pRegistrations', registrationId);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as A2PRegistration);
      } else {
        callback(null);
      }
    });
  }

  static async logTwilioAttempt(
    subAccountId: string,
    registrationId: string,
    attemptType: TwilioAttempt['attemptType'],
    requestData: any
  ): Promise<string> {
    try {
      const attemptData = {
        subAccountId,
        registrationId,
        attemptType,
        requestData,
        status: 'pending' as const,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'twilioAttempts'), attemptData);
      return docRef.id;
    } catch (error) {
      console.error('Error logging Twilio attempt:', error);
      throw error;
    }
  }

  static async updateTwilioAttempt(
    attemptId: string,
    responseData: any,
    status: 'success' | 'error',
    errorMessage?: string,
    twilioSid?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, 'twilioAttempts', attemptId);
      await updateDoc(docRef, {
        responseData,
        status,
        errorMessage,
        twilioSid,
        completedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating Twilio attempt:', error);
      throw error;
    }
  }

  static async getRegistrationAttempts(registrationId: string): Promise<TwilioAttempt[]> {
    try {
      const q = query(
        collection(db, 'twilioAttempts'),
        where('registrationId', '==', registrationId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TwilioAttempt));
    } catch (error) {
      console.error('Error getting registration attempts:', error);
      return [];
    }
  }
}