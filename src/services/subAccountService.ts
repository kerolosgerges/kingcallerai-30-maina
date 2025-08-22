import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SubAccount {
  id: string;
  name: string;
  ownerId: string;
  createdAt: any;
  updatedAt: any;
}

interface SubAccountMember {
  id?: string;
  userId: string;
  subAccountId: string;
  role: 'owner' | 'admin' | 'member';
  permissions: string[];
  joinedAt: any;
}

export const subAccountService = {
  // Get all sub-accounts for a user
  getUserSubAccounts: async (userId: string): Promise<SubAccount[]> => {
    try {
      console.log('🔍 Loading sub-accounts for user:', userId);
      
      // Get all sub-accounts where user is a member (using contained structure)
      const allSubAccountsSnap = await getDocs(collection(db, 'subAccounts'));
      const userSubAccounts: SubAccount[] = [];
      
      for (const subAccountDoc of allSubAccountsSnap.docs) {
        const subAccountId = subAccountDoc.id;
        const memberDoc = await getDoc(doc(db, 'subAccounts', subAccountId, 'members', userId));
        
        if (memberDoc.exists()) {
          userSubAccounts.push({
            id: subAccountDoc.id,
            ...subAccountDoc.data()
          } as SubAccount);
        }
      }
      
      console.log('✅ Found', userSubAccounts.length, 'sub-accounts for user');
      return userSubAccounts;
    } catch (error) {
      console.error('Error getting user sub-accounts:', error);
      return [];
    }
  },

  // Get sub-account by ID
  getSubAccountById: async (id: string): Promise<SubAccount | null> => {
    try {
      const subAccountDoc = await getDoc(doc(db, 'subAccounts', id));
      
      if (subAccountDoc.exists()) {
        return {
          id: subAccountDoc.id,
          ...subAccountDoc.data()
        } as SubAccount;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting sub-account:', error);
      return null;
    }
  },

  // Get user role in sub-account
  getUserRole: async (userId: string, subAccountId: string): Promise<string | null> => {
    try {
      // Check contained structure: /subAccounts/{subAccountId}/members/{userId}
      const memberRef = doc(db, 'subAccounts', subAccountId, 'members', userId);
      const memberSnap = await getDoc(memberRef);
      
      if (memberSnap.exists()) {
        return memberSnap.data().role;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  },

  // Update sub-account
  updateSubAccount: async (id: string, data: Partial<SubAccount>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'subAccounts', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating sub-account:', error);
      throw error;
    }
  },

  // Add member to sub-account
  addMember: async (memberData: Omit<SubAccountMember, 'id' | 'joinedAt'>): Promise<void> => {
    try {
      // Use contained structure: /subAccounts/{subAccountId}/members/{userId}
      const memberRef = doc(db, 'subAccounts', memberData.subAccountId, 'members', memberData.userId);
      await setDoc(memberRef, {
        ...memberData,
        joinedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  // Remove member from sub-account
  removeMember: async (userId: string, subAccountId: string): Promise<void> => {
    try {
      // Use contained structure: /subAccounts/{subAccountId}/members/{userId}
      const memberRef = doc(db, 'subAccounts', subAccountId, 'members', userId);
      await deleteDoc(memberRef);
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  }
};