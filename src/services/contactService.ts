
import { 
  doc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Contact } from '@/pages/Contacts';

export class ContactService {
  // Get contacts collection reference for a sub-account
  private getContactsCollection(subAccountId: string) {
    return collection(db, 'subAccounts', subAccountId, 'contacts');
  }

  // Create a new contact
  async createContact(subAccountId: string, contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>, createdBy: string): Promise<string | null> {
    try {
      console.log('🔥 DEBUG: contactService.createContact called');
      console.log('🔥 DEBUG: subAccountId:', subAccountId);
      console.log('🔥 DEBUG: contactData:', contactData);
      console.log('🔥 DEBUG: createdBy:', createdBy);
      
      const contactsRef = this.getContactsCollection(subAccountId);
      console.log('🔥 DEBUG: contactsRef path:', contactsRef.path);
      
      const docData = {
        ...contactData,
        subAccountId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy
      };

      console.log('🔥 DEBUG: Final docData to save:', docData);

      const docRef = await addDoc(contactsRef, docData);
      console.log('🔥 DEBUG: Document created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('🔥 ERROR creating contact:', error);
      return null;
    }
  }

  // Update a contact
  async updateContact(subAccountId: string, contactId: string, updates: Partial<Contact>): Promise<boolean> {
    try {
      const contactRef = doc(db, 'subAccounts', subAccountId, 'contacts', contactId);
      await updateDoc(contactRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating contact:', error);
      return false;
    }
  }

  // Delete a contact
  async deleteContact(subAccountId: string, contactId: string): Promise<boolean> {
    try {
      const contactRef = doc(db, 'subAccounts', subAccountId, 'contacts', contactId);
      await deleteDoc(contactRef);
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      return false;
    }
  }

  // Get a single contact
  async getContact(subAccountId: string, contactId: string): Promise<Contact | null> {
    try {
      const contactRef = doc(db, 'subAccounts', subAccountId, 'contacts', contactId);
      const contactDoc = await getDoc(contactRef);
      
      if (contactDoc.exists()) {
        return {
          id: contactDoc.id,
          ...contactDoc.data(),
          createdAt: contactDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: contactDoc.data().updatedAt?.toDate() || new Date(),
        } as Contact;
      }
      return null;
    } catch (error) {
      console.error('Error getting contact:', error);
      return null;
    }
  }

  // Subscribe to contacts changes
  subscribeToContacts(subAccountId: string, callback: (contacts: Contact[]) => void, onError?: (error: Error) => void) {
    const contactsRef = this.getContactsCollection(subAccountId);
    const q = query(contactsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const contacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Contact[];
      
      callback(contacts);
    }, (error) => {
      console.error('Error in contacts subscription:', error);
      onError?.(error);
    });
  }

  // Bulk operations
  async bulkDeleteContacts(subAccountId: string, contactIds: string[]): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      
      contactIds.forEach(contactId => {
        const contactRef = doc(db, 'subAccounts', subAccountId, 'contacts', contactId);
        batch.delete(contactRef);
      });

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error bulk deleting contacts:', error);
      return false;
    }
  }

  async bulkUpdateContacts(subAccountId: string, contactIds: string[], updates: Partial<Contact>): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      
      contactIds.forEach(contactId => {
        const contactRef = doc(db, 'subAccounts', subAccountId, 'contacts', contactId);
        batch.update(contactRef, {
          ...updates,
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error bulk updating contacts:', error);
      return false;
    }
  }

  // Data validation helper
  private validateContactData(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    if (!contactData.name || contactData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    if (contactData.name && contactData.name.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }
    if (contactData.name && !/^[a-zA-Z\s\-'\.]+$/.test(contactData.name.trim())) {
      errors.push('Name contains invalid characters');
    }

    // Email validation
    if (contactData.emails?.length) {
      contactData.emails.forEach((email, index) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.email)) {
          errors.push(`Email ${index + 1} is invalid`);
        }
        if (email.email.length > 254) {
          errors.push(`Email ${index + 1} is too long`);
        }
      });
    }

    // Phone validation
    if (contactData.phoneNumbers?.length) {
      contactData.phoneNumbers.forEach((phone, index) => {
        const phoneClean = phone.phoneNumber.replace(/\D/g, '');
        if (phoneClean.length < 7 || phoneClean.length > 15) {
          errors.push(`Phone ${index + 1} length is invalid`);
        }
        if (!phone.countryCode.match(/^\+\d{1,4}$/)) {
          errors.push(`Phone ${index + 1} country code is invalid`);
        }
      });
    }

    // Contact method validation
    const hasValidPhone = contactData.phoneNumbers?.some(p => p.phoneNumber.replace(/\D/g, '').length >= 7);
    const hasValidEmail = contactData.emails?.some(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email));
    if (!hasValidPhone && !hasValidEmail) {
      errors.push('At least one valid phone number or email address is required');
    }

    // Other field validations
    if (contactData.company && contactData.company.length > 200) {
      errors.push('Company name cannot exceed 200 characters');
    }
    if (contactData.title && contactData.title.length > 100) {
      errors.push('Job title cannot exceed 100 characters');
    }
    if (contactData.address && contactData.address.length > 500) {
      errors.push('Address cannot exceed 500 characters');
    }
    if (contactData.notes && contactData.notes.length > 1000) {
      errors.push('Notes cannot exceed 1000 characters');
    }
    if (contactData.profileImage) {
      try {
        new URL(contactData.profileImage);
        if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(contactData.profileImage)) {
          errors.push('Profile image must be a valid image URL');
        }
      } catch {
        errors.push('Profile image URL is invalid');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  // Bulk create contacts with validation
  async bulkCreateContacts(subAccountId: string, contactsData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[], createdBy: string): Promise<{ successCount: number; errorCount: number; errors: string[] }> {
    try {
      console.log('🔄 Starting bulk contact creation with validation:', contactsData.length);
      
      const allErrors: string[] = [];
      const validContacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[] = [];
      
      // Validate all contacts first
      contactsData.forEach((contactData, index) => {
        const validation = this.validateContactData(contactData);
        if (validation.isValid) {
          validContacts.push(contactData);
        } else {
          allErrors.push(`Contact ${index + 1} (${contactData.name || 'Unknown'}): ${validation.errors.join(', ')}`);
        }
      });

      console.log(`✅ ${validContacts.length} valid contacts, ${allErrors.length} invalid`);

      if (validContacts.length === 0) {
        return { successCount: 0, errorCount: contactsData.length, errors: allErrors };
      }

      // Process valid contacts in batches (Firestore batch limit is 500)
      const batchSize = 450; // Leave some margin
      let totalSuccessCount = 0;
      let totalErrorCount = allErrors.length;

      for (let i = 0; i < validContacts.length; i += batchSize) {
        const batch = writeBatch(db);
        const batchContacts = validContacts.slice(i, i + batchSize);
        const contactsRef = this.getContactsCollection(subAccountId);
        
        batchContacts.forEach(contactData => {
          const docRef = doc(contactsRef);
          const docData = {
            ...contactData,
            subAccountId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy,
            // Ensure proper data sanitization
            name: contactData.name.trim(),
            emails: contactData.emails?.map(e => ({ ...e, email: e.email.toLowerCase().trim() })),
            phoneNumbers: contactData.phoneNumbers?.map(p => ({ 
              ...p, 
              phoneNumber: p.phoneNumber.replace(/\D/g, ''),
              countryCode: p.countryCode.trim()
            })),
            title: contactData.title?.trim(),
            company: contactData.company?.trim(),
            address: contactData.address?.trim(),
            notes: contactData.notes?.trim(),
            tags: Array.isArray(contactData.tags) ? contactData.tags : (contactData.tags ? [contactData.tags] : []),
          };
          
          batch.set(docRef, docData);
        });

        try {
          await batch.commit();
          totalSuccessCount += batchContacts.length;
          console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} created ${batchContacts.length} contacts`);
        } catch (error) {
          console.error('❌ Error committing batch:', error);
          totalErrorCount += batchContacts.length;
          allErrors.push(`Batch ${Math.floor(i / batchSize) + 1} failed: ${error}`);
        }
      }

      console.log(`🎉 Bulk creation complete: ${totalSuccessCount} success, ${totalErrorCount} errors`);
      return { successCount: totalSuccessCount, errorCount: totalErrorCount, errors: allErrors };
    } catch (error) {
      console.error('❌ Error in bulk contact creation:', error);
      return { 
        successCount: 0, 
        errorCount: contactsData.length, 
        errors: [`Bulk creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`] 
      };
    }
  }

  // Add note to contact
  async addNoteToContact(subAccountId: string, contactId: string, note: string): Promise<boolean> {
    try {
      const contactRef = doc(db, 'subAccounts', subAccountId, 'contacts', contactId);
      const contactDoc = await getDoc(contactRef);
      
      if (!contactDoc.exists()) {
        console.error('Contact not found');
        return false;
      }

      const contactData = contactDoc.data() as Contact;
      const newActivity = {
        id: `note_${Date.now()}`,
        type: 'note' as const,
        description: note,
        timestamp: new Date().toISOString()
      };

      const updatedActivities = [...(contactData.activities || []), newActivity];

      await updateDoc(contactRef, {
        activities: updatedActivities,
        notes: note, // Also update the main notes field
        updatedAt: serverTimestamp()
      });

      console.log('✅ Note added to contact successfully');
      return true;
    } catch (error) {
      console.error('❌ Error adding note to contact:', error);
      return false;
    }
  }

  // Add tag to contact
  async addTagToContact(subAccountId: string, contactId: string, tag: string): Promise<boolean> {
    try {
      const contactRef = doc(db, 'subAccounts', subAccountId, 'contacts', contactId);
      const contactDoc = await getDoc(contactRef);
      
      if (!contactDoc.exists()) {
        console.error('Contact not found');
        return false;
      }

      const contactData = contactDoc.data() as Contact;
      const currentTags = contactData.tags || [];
      
      // Check if tag already exists
      if (currentTags.includes(tag)) {
        console.log('Tag already exists on contact');
        return true;
      }

      const updatedTags = [...currentTags, tag];

      await updateDoc(contactRef, {
        tags: updatedTags,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Tag added to contact successfully');
      return true;
    } catch (error) {
      console.error('❌ Error adding tag to contact:', error);
      return false;
    }
  }

  // Remove tag from contact
  async removeTagFromContact(subAccountId: string, contactId: string, tag: string): Promise<boolean> {
    try {
      const contactRef = doc(db, 'subAccounts', subAccountId, 'contacts', contactId);
      const contactDoc = await getDoc(contactRef);
      
      if (!contactDoc.exists()) {
        console.error('Contact not found');
        return false;
      }

      const contactData = contactDoc.data() as Contact;
      const currentTags = contactData.tags || [];
      const updatedTags = currentTags.filter(t => t !== tag);

      await updateDoc(contactRef, {
        tags: updatedTags,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Tag removed from contact successfully');
      return true;
    } catch (error) {
      console.error('❌ Error removing tag from contact:', error);
      return false;
    }
  }

  // Add message to conversation
  async addMessageToConversation(subAccountId: string, contactId: string, message: {
    content: string;
    type: 'user' | 'agent' | 'system';
    sender?: string;
  }): Promise<boolean> {
    try {
      const contactRef = doc(db, 'subAccounts', subAccountId, 'contacts', contactId);
      const contactDoc = await getDoc(contactRef);
      
      if (!contactDoc.exists()) {
        console.error('Contact not found');
        return false;
      }

      const contactData = contactDoc.data() as Contact;
      const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: message.type,
        content: message.content,
        timestamp: new Date(),
        sender: message.sender || 'system',
        status: 'sent' as const
      };

      // Add to activities for tracking
      const newActivity = {
        id: `activity_${Date.now()}`,
        type: 'note' as const, // Using 'note' as it's a valid Activity type
        description: `${message.type === 'user' ? 'Received' : 'Sent'}: ${message.content}`,
        timestamp: new Date().toISOString()
      };

      const updatedActivities = [...(contactData.activities || []), newActivity];

      await updateDoc(contactRef, {
        activities: updatedActivities,
        lastContactedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Message added to conversation successfully');
      return true;
    } catch (error) {
      console.error('❌ Error adding message to conversation:', error);
      return false;
    }
  }

  // Get conversation messages for a contact
  async getConversationMessages(subAccountId: string, contactId: string): Promise<any[]> {
    try {
      const contactRef = doc(db, 'subAccounts', subAccountId, 'contacts', contactId);
      const contactDoc = await getDoc(contactRef);
      
      if (!contactDoc.exists()) {
        return [];
      }

      const contactData = contactDoc.data() as Contact;
      return contactData.activities
        ?.filter(activity => activity.description.includes('Received:') || activity.description.includes('Sent:'))
        ?.map(activity => ({
          id: activity.id,
          type: activity.description.startsWith('Received:') ? 'user' : 'agent',
          content: activity.description.replace(/^(Received:|Sent:)\s/, ''),
          timestamp: new Date(activity.timestamp),
          sender: 'system'
        })) || [];
    } catch (error) {
      console.error('❌ Error getting conversation messages:', error);
      return [];
    }
  }
}

// Singleton removed - use ServiceRegistry instead
