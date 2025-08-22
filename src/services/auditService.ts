
import { addDoc, collection, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AuditLogEntry {
  userId: string;
  subAccountId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: any;
  userAgent?: string;
  ipAddress?: string;
}

export const auditService = {
  // Log any action with detailed context
  async logAction(entry: Omit<AuditLogEntry, 'timestamp' | 'userAgent' | 'ipAddress'>) {
    try {
      await addDoc(collection(db, 'subAccounts', entry.subAccountId, 'auditLogs'), {
        ...entry,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        ipAddress: 'unknown' // Would need backend to get real IP
      });
    } catch (error) {
      console.error('Failed to log audit entry:', error);
    }
  },

  // Get recent audit logs for a sub-account
  async getRecentLogs(subAccountId: string, limitCount = 50) {
    try {
      const q = query(
        collection(db, 'subAccounts', subAccountId, 'auditLogs'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }
  },

  // Get user-specific actions
  async getUserActions(subAccountId: string, userId: string, limitCount = 20) {
    try {
      const q = query(
        collection(db, 'subAccounts', subAccountId, 'auditLogs'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Failed to fetch user actions:', error);
      return [];
    }
  }
};
