
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  deleteDoc,
  writeBatch 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Invitation {
  id: string;
  subAccountId: string;
  subAccountName?: string;
  email: string;
  role: string;
  invitedBy: string;
  invitedByName: string;
  invitedByEmail: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  acceptedAt?: string;
  acceptedBy?: string;
}

export const invitationService = {
  // Send invitation to join sub-account
  async sendInvitation(
    subAccountId: string, 
    email: string, 
    role: string, 
    invitedBy: string
  ): Promise<{ success: boolean; error?: string; invitationId?: string }> {
    
    try {
      console.log('🚀 Starting invitation process:', { subAccountId, email, role, invitedBy });
      
      // Get inviter's information
      const inviterDoc = await getDoc(doc(db, 'users', invitedBy));
      if (!inviterDoc.exists()) {
        return { success: false, error: 'Inviter not found' };
      }

      const inviterData = inviterDoc.data();
      const invitedByName = inviterData.displayName || inviterData.name || inviterData.email || 'Unknown User';
      const invitedByEmail = inviterData.email || '';

      // Get sub-account information
      const subAccountDoc = await getDoc(doc(db, 'subAccounts', subAccountId));
      const subAccountName = subAccountDoc.exists() ? subAccountDoc.data().name : 'Unknown Sub-Account';

      // Check if user is already a member by email using contained structure
      console.log('🔍 Checking for existing members...');
      const membersRef = collection(db, 'subAccounts', subAccountId, 'members');
      const memberDocs = await getDocs(membersRef);
      
      // Check if any existing member has this email (we need to check user profiles)
      for (const memberDoc of memberDocs.docs) {
        const memberData = memberDoc.data();
        const userDoc = await getDoc(doc(db, 'users', memberData.userId));
        if (userDoc.exists() && userDoc.data().email === email) {
          console.log('❌ User already exists as member');
          return { success: false, error: 'User is already a member of this sub-account' };
        }
      }

      // Check for existing pending invitation
      console.log('🔍 Checking for existing invitations...');
      const invitationsRef = collection(db, 'invitations');
      const q = query(
        invitationsRef,
        where('subAccountId', '==', subAccountId),
        where('email', '==', email),
        where('status', '==', 'pending')
      );
      const existingInvites = await getDocs(q);
      
      if (!existingInvites.empty) {
        console.log('❌ Invitation already pending');
        return { success: false, error: 'Invitation already pending for this email' };
      }

      // Create invitation with better ID
      const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      const invitation: Omit<Invitation, 'id'> = {
        subAccountId,
        subAccountName,
        email,
        role,
        invitedBy,
        invitedByName,
        invitedByEmail,
        invitedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: 'pending'
      };

      await setDoc(doc(db, 'invitations', invitationId), {
        ...invitation,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Invitation created successfully:', invitationId);
      return { success: true, invitationId };

    } catch (error) {
      console.error('💥 Failed to send invitation:', error);
      return { success: false, error: 'Failed to send invitation' };
    }
  },

  // Accept invitation with enhanced user management
  async acceptInvitation(
    invitationId: string, 
    userId: string
  ): Promise<{ success: boolean; error?: string; subAccountId?: string }> {
    try {
      console.log('📨 Starting invitation acceptance for:', { invitationId, userId });
      
      const inviteDoc = await getDoc(doc(db, 'invitations', invitationId));
      
      if (!inviteDoc.exists()) {
        return { success: false, error: 'Invitation not found' };
      }

      const invite = { id: inviteDoc.id, ...inviteDoc.data() } as Invitation;

      if (invite.status !== 'pending') {
        return { success: false, error: 'Invitation is no longer valid' };
      }

      if (new Date() > new Date(invite.expiresAt)) {
        await updateDoc(doc(db, 'invitations', invitationId), {
          status: 'expired',
          updatedAt: serverTimestamp()
        });
        return { success: false, error: 'Invitation has expired' };
      }

      // Check if user is already a member using contained structure
      const memberRef = doc(db, 'subAccounts', invite.subAccountId, 'members', userId);
      const existingMember = await getDoc(memberRef);
      
      if (existingMember.exists()) {
        console.log('❌ User is already a member');
        return { success: false, error: 'You are already a member of this sub-account' };
      }

      // Use batch to ensure all operations succeed together
      const batch = writeBatch(db);

      // Add user to sub-account members using contained structure
      const memberData = {
        userId,
        subAccountId: invite.subAccountId,
        role: invite.role,
        permissions: invite.role === 'owner' ? ['*'] : this.getRolePermissions(invite.role),
        assignedBy: invite.invitedBy,
        assignedAt: serverTimestamp(),
        joinedAt: serverTimestamp()
      };

      // Use contained structure: /subAccounts/{subAccountId}/members/{userId}
      const newMemberRef = doc(db, 'subAccounts', invite.subAccountId, 'members', userId);
      batch.set(newMemberRef, memberData);

      // Update invitation status
      batch.update(doc(db, 'invitations', invitationId), {
        status: 'accepted',
        acceptedAt: serverTimestamp(),
        acceptedBy: userId,
        updatedAt: serverTimestamp()
      });

      await batch.commit();

      console.log('✅ Invitation accepted successfully:', invitationId);
      return { success: true, subAccountId: invite.subAccountId };

    } catch (error) {
      console.error('💥 Failed to accept invitation:', error);
      return { success: false, error: 'Failed to accept invitation' };
    }
  },

  // Get role permissions
  getRolePermissions(role: string): string[] {
    const rolePermissions: Record<string, string[]> = {
      'admin': ['manage_team', 'manage_settings', 'view_analytics', 'manage_assistants', 'manage_campaigns'],
      'manager': ['manage_assistants', 'manage_campaigns', 'view_analytics'],
      'user': ['create_campaigns', 'view_assistants', 'manage_contacts'],
      'viewer': ['view_only']
    };
    
    return rolePermissions[role] || ['view_only'];
  },

  // Get pending invitations for a sub-account
  async getPendingInvitations(subAccountId: string): Promise<Invitation[]> {
    try {
      const q = query(
        collection(db, 'invitations'),
        where('subAccountId', '==', subAccountId),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Invitation[];
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
      return [];
    }
  },

  // Cancel invitation
  async cancelInvitation(invitationId: string, cancelledBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      const inviteDoc = await getDoc(doc(db, 'invitations', invitationId));
      if (!inviteDoc.exists()) return { success: false, error: 'Invitation not found' };

      await updateDoc(doc(db, 'invitations', invitationId), {
        status: 'declined',
        cancelledBy,
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
      return { success: false, error: 'Failed to cancel invitation' };
    }
  }
};
