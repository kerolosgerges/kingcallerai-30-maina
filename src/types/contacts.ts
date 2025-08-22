import { Contact } from '@/pages/Contacts';
import { FirebaseContactData } from '@/hooks/useContactsLogic';

export interface ContactsContextType {
  contacts: Contact[];
  filteredContacts: Contact[];
  selectedContacts: string[];
  selectedContact: Contact | null;
  searchTerm: string;
  statusFilter: string;
  tagFilter: string;
  isLoading: boolean;
  isCreating: boolean;
  showAddDialog: boolean;
  showImportDialog: boolean;
  showExportDialog: boolean;
  showContactModal: boolean;
  setSelectedContacts: (contacts: string[]) => void;
  setSelectedContact: (contact: Contact | null) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setTagFilter: (tag: string) => void;
  setShowAddDialog: (show: boolean) => void;
  setShowImportDialog: (show: boolean) => void;
  setShowExportDialog: (show: boolean) => void;
  setShowContactModal: (show: boolean) => void;
  handleContactSelect: (contactId: string, selected: boolean) => void;
  handleBulkSelectAll: (selected: boolean) => void;
  handleContactClick: (contact: Contact) => void;
  handleContactUpdate: (contact: Contact) => Promise<void>;
  handleBulkAction: (action: string) => Promise<void>;
  handleImportComplete: () => void;
  handleCreateContact: (data: FirebaseContactData) => Promise<string | null>;
  handleBulkCreateContacts: (contactsData: FirebaseContactData[]) => Promise<boolean>;
  handleDeleteContact: (contactId: string) => Promise<void>;
  // Pagination
  currentPage: number;
  totalContacts: number;
  contactsPerPage: number;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}