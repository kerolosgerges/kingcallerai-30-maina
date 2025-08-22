import { useState, useEffect } from 'react';
import { Contact } from '@/pages/Contacts';
import { useAuth } from '@/contexts/AuthContext';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { contactService } from '@/services/ServiceRegistry';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

// Firebase contact creation interface - simplified and clean
export interface FirebaseContactData {
  name: string;
  title?: string;
  company?: string;
  address?: string;
  pincode?: string;
  birthday?: string;
  notes?: string;
  phone?: string; // Add direct phone field
  profileImage?: string;
  tags?: string;
  leadSource?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'customer' | 'inactive';
  score?: number;
  customFields?: Record<string, any>;
  phoneNumbers?: Array<{
    countryCode: string;
    phoneNumber: string;
    label: string;
  }>;
  emails?: Array<{
    email: string;
    label: string;
  }>;
}

export const useContactsLogic = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const contactsPerPage = 20;

  const { currentUser } = useAuth();
  const { currentSubAccount } = useSubAccount();
  const { toast } = useToast();
  const location = useLocation();
  
  // Load contacts only when on specific pages - lazy loading
  const shouldLoadContacts = location.pathname.includes('/contacts') || location.pathname.includes('/conversations');

  // Lazy load contacts - only when user visits contacts page and after page load
  useEffect(() => {
    // Only load contacts when actually on contacts/conversations page
    if (!currentUser || !currentSubAccount || !shouldLoadContacts) {
      setIsLoading(false);
      return;
    }

    // Wait for page to be fully loaded before subscribing
    const timeoutId = setTimeout(() => {
      setIsLoading(true);
      console.log('📋 Setting up contacts subscription for sub-account:', currentSubAccount.id);

      const unsubscribe = contactService.subscribeToContacts(
        currentSubAccount.id,
        (contactsData) => {
          console.log('📋 Received contacts data:', contactsData);
          setTotalContacts(contactsData.length);
          setContacts(contactsData);
          setIsLoading(false);
        },
        (error) => {
          console.error('❌ Error loading contacts:', error);
          toast({
            title: "Error Loading Contacts",
            description: "Failed to load contacts. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    }, 100); // Small delay to ensure page is loaded

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentUser, currentSubAccount, toast, shouldLoadContacts]);

  // Filter contacts based on search and filters + pagination
  useEffect(() => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    if (tagFilter !== 'all') {
      filtered = filtered.filter(contact => contact.tags.includes(tagFilter));
    }

    // Apply pagination - only show first 20 contacts for current page
    const startIndex = (currentPage - 1) * contactsPerPage;
    const endIndex = startIndex + contactsPerPage;
    const paginatedContacts = filtered.slice(startIndex, endIndex);

    setFilteredContacts(paginatedContacts);
    setTotalContacts(filtered.length);
  }, [contacts, searchTerm, statusFilter, tagFilter, currentPage, contactsPerPage]);

  // Create a new contact with Firebase
  const handleCreateContact = async (data: FirebaseContactData) => {
    console.log('🔥 DEBUG: handleCreateContact called with data:', data);
    console.log('🔥 DEBUG: currentUser:', currentUser?.uid);
    console.log('🔥 DEBUG: currentSubAccount:', currentSubAccount?.id);
    
    if (!currentUser || !currentSubAccount) {
      console.log('🔥 DEBUG: Missing auth - User:', !!currentUser, 'SubAccount:', !!currentSubAccount);
      toast({
        title: "Error",
        description: "Please log in and select a sub-account to create contacts",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsCreating(true);
      console.log('🆕 Creating new contact:', data);

      // Convert the enhanced contact data to Firebase format
      const contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
        name: data.name,
        title: data.title || '',
        company: data.company || '',
        address: data.address || '',
        pincode: data.pincode || '',
        birthday: data.birthday || '',
        notes: data.notes || '',
        profileImage: data.profileImage || '',
        
        // Primary email and phone for backward compatibility
        email: data.emails?.[0]?.email || '',
        phone: data.phoneNumbers?.[0] ? 
          data.phoneNumbers[0].phoneNumber : data.phone || '', // Use direct phone if available
        
        // Enhanced contact fields
        phoneNumbers: data.phoneNumbers || (data.phone ? [{ 
          countryCode: '', 
          phoneNumber: data.phone, 
          label: 'Primary' 
        }] : []),
        emails: data.emails || [],
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        
        // Default values
        avatar: data.profileImage || '',
        status: 'new',
        leadSource: 'manual',
        score: 0,
        activities: [],
        customFields: {},
        subAccountId: currentSubAccount.id,
        createdBy: currentUser.uid,
      };

      console.log('🔥 DEBUG: Final contactData to be saved:', contactData);

      const contactId = await contactService.createContact(
        currentSubAccount.id,
        contactData,
        currentUser.uid
      );

      console.log('🔥 DEBUG: Contact creation result - contactId:', contactId);

      if (contactId) {
        toast({
          title: "Contact Created",
          description: `"${data.name}" has been created successfully.`,
        });
        console.log('✅ Contact created with ID:', contactId);
        return contactId;
      } else {
        throw new Error('Failed to create contact');
      }
    } catch (error) {
      console.error('❌ Error creating contact:', error);
      toast({
        title: "Error",
        description: "Failed to create contact. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  // Bulk create contacts for CSV import using optimized batch method
  const handleBulkCreateContacts = async (contactsData: FirebaseContactData[]) => {
    if (!currentUser || !currentSubAccount) {
      toast({
        title: "Error",
        description: "Please log in and select a sub-account to import contacts",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsCreating(true);
      console.log('📥 Bulk importing contacts with validation:', contactsData.length);

      // Convert Firebase contact data to Contact format for bulk creation
      const contactsBatch = contactsData.map(data => ({
        name: data.name,
        title: data.title || '',
        company: data.company || '',
        address: data.address || '',
        pincode: data.pincode || '',
        birthday: data.birthday || '',
        notes: data.notes || '',
        profileImage: data.profileImage || '',
        
        // Primary email and phone for backward compatibility
        email: data.emails?.[0]?.email || '',
        phone: data.phoneNumbers?.[0] ? 
          `${data.phoneNumbers[0].countryCode}${data.phoneNumbers[0].phoneNumber}` : '',
        
        // Enhanced contact fields
        phoneNumbers: data.phoneNumbers || [],
        emails: data.emails || [],
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        
        // Default values
        avatar: data.profileImage || '',
        status: 'new' as const,
        leadSource: 'import',
        score: 0,
        activities: [],
        customFields: {},
        subAccountId: currentSubAccount.id,
        createdBy: currentUser.uid,
      }));

      const result = await contactService.bulkCreateContacts(
        currentSubAccount.id,
        contactsBatch,
        currentUser.uid
      );

      console.log(`✅ Bulk creation result:`, result);
      
      // Show detailed results
      if (result.errors.length > 0 && result.errorCount > 0) {
        console.warn('Import validation errors:', result.errors.slice(0, 10)); // Log first 10 errors
      }
      
      if (result.successCount > 0) {
        toast({
          title: "Contacts Imported",
          description: `Successfully imported ${result.successCount} contacts.${result.errorCount > 0 ? ` ${result.errorCount} contacts failed validation.` : ''}`,
        });
      } else {
        toast({
          title: "Import Failed",
          description: `Import failed. ${result.errorCount} contacts had validation errors.`,
          variant: "destructive",
        });
      }

      // Show detailed error information for small numbers of errors
      if (result.errors.length > 0 && result.errors.length <= 3) {
        setTimeout(() => {
          toast({
            title: "Validation Details",
            description: result.errors.slice(0, 2).join('; '),
            variant: "destructive",
          });
        }, 1500);
      } else if (result.errors.length > 3) {
        setTimeout(() => {
          toast({
            title: "Multiple Validation Errors",
            description: `${result.errors.length} validation errors found. Check console for details.`,
            variant: "destructive",
          });
        }, 1500);
      }

      return result.successCount > 0;
    } catch (error) {
      console.error('❌ Error in bulk contact import:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "There was an error importing your contacts.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const handleContactSelect = (contactId: string, selected: boolean) => {
    if (selected) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const handleBulkSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedContacts(filteredContacts.map(c => c.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleContactClick = (contact: Contact) => {
    console.log('👆 Contact clicked:', contact.name, contact);
    setSelectedContact(contact);
    setShowContactModal(true);
    console.log('👆 Modal should now be open with contact:', contact.name);
  };

  const handleContactUpdate = async (updatedContact: Contact) => {
    if (!currentSubAccount) {
      toast({
        title: "Error",
        description: "Sub-account required to update contacts",
        variant: "destructive",
      });
      return;
    }

    const success = await contactService.updateContact(
      currentSubAccount.id,
      updatedContact.id,
      updatedContact
    );

    if (success) {
      setSelectedContact(updatedContact);
      toast({
        title: "Contact Updated",
        description: "Contact has been updated successfully.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (!currentSubAccount || selectedContacts.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select contacts to perform bulk actions.",
        variant: "destructive",
      });
      return;
    }

    try {
      switch (action) {
        case 'delete':
          const deleteSuccess = await contactService.bulkDeleteContacts(
            currentSubAccount.id,
            selectedContacts
          );
          if (deleteSuccess) {
            setSelectedContacts([]);
            toast({
              title: "Contacts Deleted",
              description: `${selectedContacts.length} contacts have been deleted.`,
            });
          } else {
            throw new Error('Failed to delete contacts');
          }
          break;
        case 'tag':
          toast({
            title: "Bulk Action",
            description: "Bulk tagging feature coming soon!",
          });
          break;
        default:
          toast({
            title: "Unknown Action",
            description: `Action "${action}" is not supported.`,
            variant: "destructive",
          });
      }
    } catch (error) {
      console.error('❌ Error performing bulk action:', error);
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "Failed to perform bulk action",
        variant: "destructive",
      });
    }
  };

  const handleImportComplete = () => {
    toast({
      title: "Import Complete",
      description: "Contacts have been imported successfully.",
    });
  };

  // Delete a single contact
  const handleDeleteContact = async (contactId: string) => {
    if (!currentSubAccount) {
      toast({
        title: "Error",
        description: "Sub-account required to delete contact",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await contactService.deleteContact(currentSubAccount.id, contactId);
      if (success) {
        setSelectedContact(null);
        setShowContactModal(false);
        toast({
          title: "Contact Deleted",
          description: "Contact has been deleted successfully.",
        });
      } else {
        throw new Error('Failed to delete contact');
      }
    } catch (error) {
      console.error('❌ Error deleting contact:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Pagination methods
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(totalContacts / contactsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    contacts,
    filteredContacts,
    selectedContacts,
    selectedContact,
    searchTerm,
    statusFilter,
    tagFilter,
    isLoading,
    isCreating,
    showAddDialog,
    showImportDialog,
    showExportDialog,
    showContactModal,
    setSelectedContacts,
    setSelectedContact,
    setSearchTerm,
    setStatusFilter,
    setTagFilter,
    setShowAddDialog,
    setShowImportDialog,
    setShowExportDialog,
    setShowContactModal,
    handleContactSelect,
    handleBulkSelectAll,
    handleContactClick,
    handleContactUpdate,
    handleBulkAction,
    handleImportComplete,
    handleCreateContact,
    handleBulkCreateContacts,
    handleDeleteContact,
    // Pagination
    currentPage,
    totalContacts,
    contactsPerPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  };
};