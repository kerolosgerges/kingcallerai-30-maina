import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp,
  writeBatch,
  collectionGroup,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  SubAccount, 
  UserProfile, 
  Assistant, 
  Contact, 
  PhoneNumber 
} from '@/types/platform';

interface UserAccess {
  userId: string;
  agencies: Record<string, string[]>; // agencyId -> permissions
  subAccounts: Record<string, {
    role: string;
    permissions: string[];
    lastAccess: string;
  }>;
  lastUpdated: string;
}

interface SubAccountMember {
  userId: string;
  role: string;
  permissions: string[];
  joinedAt: string;
  assignedBy: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

interface SubAccountAggregates {
  memberCount: number;
  assistantCount: number;
  contactCount: number;
  campaignCount: number;
  workflowCount: number;
  lastUpdated: string;
}

export class ContainedSubAccountService {
  private static instance: ContainedSubAccountService;
  private userAccessCache: Map<string, { data: UserAccess; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ContainedSubAccountService {
    if (!ContainedSubAccountService.instance) {
      ContainedSubAccountService.instance = new ContainedSubAccountService();
    }
    return ContainedSubAccountService.instance;
  }

  // ==================== USER ACCESS MANAGEMENT ====================

  async getUserAccess(userId: string): Promise<UserAccess | null> {
    try {
      // Check cache first
      const cached = this.userAccessCache.get(userId);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const userAccessDoc = await getDoc(doc(db, 'userAccess', userId));
      if (!userAccessDoc.exists()) {
        // Create initial user access document
        const userAccess = await this.createUserAccess(userId);
        return userAccess;
      }

      const userAccess = userAccessDoc.data() as UserAccess;
      
      // Update cache
      this.userAccessCache.set(userId, {
        data: userAccess,
        timestamp: Date.now()
      });

      return userAccess;
    } catch (error) {
      console.error('Error getting user access:', error);
      return null;
    }
  }

  private async createUserAccess(userId: string): Promise<UserAccess> {
    try {
      // Scan for existing memberships across all sub-accounts
      const memberQuery = query(
        collectionGroup(db, 'members'),
        where('userId', '==', userId),
        where('isActive', '==', true)
      );
      
      const memberSnapshot = await getDocs(memberQuery);
      const subAccounts: Record<string, any> = {};
      
      memberSnapshot.docs.forEach(doc => {
        const memberData = doc.data() as SubAccountMember;
        const subAccountId = doc.ref.parent.parent?.id;
        if (subAccountId) {
          subAccounts[subAccountId] = {
            role: memberData.role,
            permissions: memberData.permissions,
            lastAccess: new Date().toISOString()
          };
        }
      });

      // Check for agency membership
      const agencyMemberQuery = query(
        collection(db, 'agencyMembers'),
        where('userId', '==', userId),
        where('isActive', '==', true)
      );
      
      const agencySnapshot = await getDocs(agencyMemberQuery);
      const agencies: Record<string, string[]> = {};
      
      agencySnapshot.docs.forEach(doc => {
        const agencyData = doc.data();
        agencies[agencyData.agencyId] = agencyData.permissions || [];
      });

      const userAccess: UserAccess = {
        userId,
        agencies,
        subAccounts,
        lastUpdated: new Date().toISOString()
      };

      await setDoc(doc(db, 'userAccess', userId), {
        ...userAccess,
        lastUpdated: serverTimestamp()
      });

      return userAccess;
    } catch (error) {
      console.error('Error creating user access:', error);
      throw error;
    }
  }

  async updateUserAccess(userId: string, updates: Partial<UserAccess>): Promise<void> {
    try {
      await updateDoc(doc(db, 'userAccess', userId), {
        ...updates,
        lastUpdated: serverTimestamp()
      });

      // Clear cache
      this.userAccessCache.delete(userId);
    } catch (error) {
      console.error('Error updating user access:', error);
      throw error;
    }
  }

  // ==================== SUB-ACCOUNT OPERATIONS ====================

  async createSubAccount(
    userId: string,
    agencyId: string,
    subAccountData: Omit<SubAccount, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ): Promise<{ subAccount: SubAccount; member: SubAccountMember }> {
    try {
      const batch = writeBatch(db);
      
      // Create sub-account document
      const subAccountRef = doc(collection(db, 'subAccounts'));
      const subAccountId = subAccountRef.id;
      
      const subAccount: SubAccount = {
        id: subAccountId,
        ...subAccountData,
        agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: userId,
        isActive: true
      };
      
      batch.set(subAccountRef, {
        ...subAccountData,
        agencyId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userId,
        isActive: true
      });

      // Create owner member in sub-account
      const member: SubAccountMember = {
        userId,
        role: 'owner',
        permissions: ['*'],
        joinedAt: new Date().toISOString(),
        assignedBy: userId,
        isActive: true
      };

      batch.set(doc(db, 'subAccounts', subAccountId, 'members', userId), {
        ...member,
        joinedAt: serverTimestamp()
      });

      // Initialize aggregates
      const aggregates: SubAccountAggregates = {
        memberCount: 1,
        assistantCount: 0,
        contactCount: 0,
        campaignCount: 0,
        workflowCount: 0,
        lastUpdated: new Date().toISOString()
      };

      batch.set(doc(db, 'subAccounts', subAccountId, 'aggregates', 'counts'), {
        ...aggregates,
        lastUpdated: serverTimestamp()
      });

      // Update user access cache
      const userAccess = await this.getUserAccess(userId);
      if (userAccess) {
        const updatedSubAccounts = {
          ...(userAccess.subAccounts || {}),
          [subAccountId]: {
            role: 'owner',
            permissions: ['*'],
            lastAccess: new Date().toISOString()
          }
        };

        batch.update(doc(db, 'userAccess', userId), {
          subAccounts: updatedSubAccounts,
          lastUpdated: serverTimestamp()
        });
      }

      await batch.commit();
      
      return { subAccount, member };
    } catch (error) {
      console.error('Error creating contained sub-account:', error);
      throw error;
    }
  }

  async getSubAccountWithAccess(userId: string, subAccountId: string): Promise<{
    subAccount: SubAccount | null;
    member: SubAccountMember | null;
    hasAccess: boolean;
  }> {
    try {
      // Check user access first
      const userAccess = await this.getUserAccess(userId);
      const hasDirectAccess = userAccess?.subAccounts[subAccountId] != null;
      const isAgencyAdmin = Object.keys(userAccess?.agencies || {}).length > 0;

      if (!hasDirectAccess && !isAgencyAdmin) {
        return { subAccount: null, member: null, hasAccess: false };
      }

      // Get sub-account
      const subAccountDoc = await getDoc(doc(db, 'subAccounts', subAccountId));
      if (!subAccountDoc.exists()) {
        return { subAccount: null, member: null, hasAccess: false };
      }

      const subAccount = { id: subAccountDoc.id, ...subAccountDoc.data() } as SubAccount;

      // Get member data
      let member: SubAccountMember | null = null;
      if (hasDirectAccess) {
        const memberDoc = await getDoc(doc(db, 'subAccounts', subAccountId, 'members', userId));
        if (memberDoc.exists()) {
          member = memberDoc.data() as SubAccountMember;
        }
      } else if (isAgencyAdmin) {
        // Create virtual admin member
        member = {
          userId,
          role: 'owner',
          permissions: ['*'],
          joinedAt: new Date().toISOString(),
          assignedBy: 'system',
          isActive: true
        };
      }

      return { subAccount, member, hasAccess: true };
    } catch (error) {
      console.error('Error getting sub-account with access:', error);
      return { subAccount: null, member: null, hasAccess: false };
    }
  }

  // ==================== MEMBER MANAGEMENT ====================

  async addMember(
    subAccountId: string,
    userId: string,
    role: string,
    permissions: string[],
    assignedBy: string
  ): Promise<boolean> {
    try {
      const batch = writeBatch(db);

      // Add member to sub-account
      const member: SubAccountMember = {
        userId,
        role,
        permissions,
        joinedAt: new Date().toISOString(),
        assignedBy,
        isActive: true
      };

      batch.set(doc(db, 'subAccounts', subAccountId, 'members', userId), {
        ...member,
        joinedAt: serverTimestamp()
      });

      // Update user access cache
      const userAccess = await this.getUserAccess(userId);
      if (userAccess) {
        const updatedSubAccounts = {
          ...(userAccess.subAccounts || {}),
          [subAccountId]: {
            role,
            permissions,
            lastAccess: new Date().toISOString()
          }
        };

        batch.update(doc(db, 'userAccess', userId), {
          subAccounts: updatedSubAccounts,
          lastUpdated: serverTimestamp()
        });
      }

      // Update aggregates
      const aggregatesRef = doc(db, 'subAccounts', subAccountId, 'aggregates', 'counts');
      const aggregatesDoc = await getDoc(aggregatesRef);
      if (aggregatesDoc.exists()) {
        const currentAggregates = aggregatesDoc.data() as SubAccountAggregates;
        batch.update(aggregatesRef, {
          memberCount: currentAggregates.memberCount + 1,
          lastUpdated: serverTimestamp()
        });
      }

      await batch.commit();
      
      // Clear cache
      this.userAccessCache.delete(userId);
      
      return true;
    } catch (error) {
      console.error('Error adding member:', error);
      return false;
    }
  }

  async removeMember(subAccountId: string, userId: string): Promise<boolean> {
    try {
      const batch = writeBatch(db);

      // Soft delete member
      batch.update(doc(db, 'subAccounts', subAccountId, 'members', userId), {
        isActive: false,
        removedAt: serverTimestamp()
      });

      // Update user access cache
      const userAccess = await this.getUserAccess(userId);
      if (userAccess) {
        const updatedSubAccounts = { ...(userAccess.subAccounts || {}) };
        delete updatedSubAccounts[subAccountId];

        batch.update(doc(db, 'userAccess', userId), {
          subAccounts: updatedSubAccounts,
          lastUpdated: serverTimestamp()
        });
      }

      // Update aggregates
      const aggregatesRef = doc(db, 'subAccounts', subAccountId, 'aggregates', 'counts');
      const aggregatesDoc = await getDoc(aggregatesRef);
      if (aggregatesDoc.exists()) {
        const currentAggregates = aggregatesDoc.data() as SubAccountAggregates;
        batch.update(aggregatesRef, {
          memberCount: Math.max(0, currentAggregates.memberCount - 1),
          lastUpdated: serverTimestamp()
        });
      }

      await batch.commit();
      
      // Clear cache
      this.userAccessCache.delete(userId);
      
      return true;
    } catch (error) {
      console.error('Error removing member:', error);
      return false;
    }
  }

  // ==================== DATA OPERATIONS ====================

  async getSubAccountData<T>(
    subAccountId: string,
    collectionName: string,
    queryOptions?: {
      where?: { field: string; operator: any; value: any }[];
      orderBy?: { field: string; direction: 'asc' | 'desc' };
      limit?: number;
      startAfter?: DocumentSnapshot;
    }
  ): Promise<T[]> {
    try {
      let q = collection(db, 'subAccounts', subAccountId, collectionName);
      let queryRef: any = q;

      if (queryOptions?.where) {
        queryOptions.where.forEach(condition => {
          queryRef = query(queryRef, where(condition.field, condition.operator, condition.value));
        });
      }

      if (queryOptions?.orderBy) {
        queryRef = query(queryRef, orderBy(queryOptions.orderBy.field, queryOptions.orderBy.direction));
      }

      if (queryOptions?.limit) {
        queryRef = query(queryRef, limit(queryOptions.limit));
      }

      if (queryOptions?.startAfter) {
        queryRef = query(queryRef, startAfter(queryOptions.startAfter));
      }

      const snapshot = await getDocs(queryRef);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...(typeof data === 'object' && data !== null ? data : {}) } as T;
      });
    } catch (error) {
      console.error(`Error getting ${collectionName} data:`, error);
      return [];
    }
  }

  async addSubAccountData<T extends Record<string, any>>(
    subAccountId: string,
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
    createdBy: string
  ): Promise<string | null> {
    try {
      const docData = {
        ...((data ?? {}) as Record<string, any>),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy
      };

      const docRef = await addDoc(collection(db, 'subAccounts', subAccountId, collectionName), docData);

      // Update aggregates if needed
      await this.updateAggregateCount(subAccountId, collectionName, 1);

      return docRef.id;
    } catch (error) {
      console.error(`Error adding ${collectionName} data:`, error);
      return null;
    }
  }

  private async updateAggregateCount(subAccountId: string, collectionName: string, increment: number): Promise<void> {
    try {
      const aggregatesRef = doc(db, 'subAccounts', subAccountId, 'aggregates', 'counts');
      const aggregatesDoc = await getDoc(aggregatesRef);
      
      if (aggregatesDoc.exists()) {
        const currentAggregates = aggregatesDoc.data() as SubAccountAggregates;
        const fieldName = `${collectionName}Count` as keyof SubAccountAggregates;
        
        if (typeof currentAggregates[fieldName] === 'number') {
          await updateDoc(aggregatesRef, {
            [fieldName]: Math.max(0, currentAggregates[fieldName] as number + increment),
            lastUpdated: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error updating aggregate count:', error);
    }
  }

  // ==================== MIGRATION HELPERS ====================

  async migratePhoneNumbersToSubAccount(subAccountId: string): Promise<boolean> {
    try {
      // Get phone numbers that should belong to this sub-account
      const phoneQuery = query(
        collection(db, 'phoneNumbers'),
        where('subAccountId', '==', subAccountId)
      );
      
      const phoneSnapshot = await getDocs(phoneQuery);
      const batch = writeBatch(db);

      phoneSnapshot.docs.forEach(phoneDoc => {
        const phoneData = phoneDoc.data() as PhoneNumber;
        
        // Add to sub-account subcollection
        const newPhoneRef = doc(db, 'subAccounts', subAccountId, 'phoneNumbers', phoneDoc.id);
        batch.set(newPhoneRef, phoneData);
        
        // Mark old document for deletion
        batch.update(phoneDoc.ref, { migrated: true, migratedAt: serverTimestamp() });
      });

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error migrating phone numbers:', error);
      return false;
    }
  }

  // ==================== CACHE MANAGEMENT ====================

  clearUserCache(userId: string): void {
    this.userAccessCache.delete(userId);
  }

  clearAllCaches(): void {
    this.userAccessCache.clear();
  }
}

export const containedSubAccountService = ContainedSubAccountService.getInstance();
