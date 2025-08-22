
import React from 'react';
import { ContactHeader } from '@/components/contacts/ContactHeader';
import { ContactsContent } from '@/components/contacts/ContactsContent';
import { SimpleContactModal } from '@/components/contacts/SimpleContactModal';
import { ContactsPagination } from '@/components/contacts/ContactsPagination';
import { ContactModalErrorBoundary } from '@/components/contacts/ContactModalErrorBoundary';
import { ImportExportDialog } from '@/components/contacts/ImportExportDialog';
import { AdvancedCSVImportDialog } from '@/components/contacts/AdvancedCSVImportDialog';
import { useContacts } from '@/components/contacts/ContactsContext';

export const ContactsLayout: React.FC = () => {
  const {
    contacts,
    selectedContact,
    selectedContacts,
    showAddDialog,
    showImportDialog,
    showExportDialog,
    showContactModal,
    setShowAddDialog,
    setShowImportDialog,
    setShowExportDialog,
    setShowContactModal,
    handleContactUpdate,
    handleImportComplete,
    handleCreateContact,
    handleBulkCreateContacts,
    handleDeleteContact,
    isLoading,
    isCreating,
    // Pagination
    currentPage,
    totalContacts,
    contactsPerPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = useContacts();

  if (isLoading) {
    console.log('📋 ContactsLayout: Loading contacts...');
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Manage your contact database</p>
        </div>
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  console.log('📋 ContactsLayout: Rendered with', contacts.length, 'contacts', { 
    selectedContact: selectedContact?.name || 'none', 
    showContactModal 
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ContactHeader 
        onAddContact={() => setShowAddDialog(true)}
        onImportContacts={() => setShowImportDialog(true)}
        onExportContacts={() => setShowExportDialog(true)}
      />

      <div className="flex-1 overflow-hidden">
        <ContactsContent />
      </div>

      {/* Pagination */}
      <ContactsPagination
        currentPage={currentPage}
        totalContacts={totalContacts}
        contactsPerPage={contactsPerPage}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
      />

      {/* Create Contact Dialog */}
      <SimpleContactModal
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        mode="create"
        onSubmit={async (data) => {
          const firebaseData = {
            name: data.name,
            company: data.company,
            emails: data.email ? [{ email: data.email, label: 'Primary' }] : undefined,
            phone: data.phone, // Use direct phone field
            title: data.title,
            address: data.address,
            notes: data.notes,
            status: data.status,
            leadSource: data.leadSource,
          };
          await handleCreateContact(firebaseData);
        }}
        isLoading={isCreating}
      />

      <AdvancedCSVImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={async (mappedData) => {
          const success = await handleBulkCreateContacts(mappedData);
          if (success) {
            handleImportComplete();
          }
        }}
        isLoading={isCreating}
      />

      <ImportExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        mode="export"
        selectedContacts={selectedContacts}
        contacts={contacts}
      />

      {/* Contact View/Edit/Delete Modal */}
      <ContactModalErrorBoundary>
        <SimpleContactModal
          open={showContactModal}
          onOpenChange={setShowContactModal}
          contact={selectedContact}
          mode="view"
          onUpdate={handleContactUpdate}
          onDelete={handleDeleteContact}
        />
      </ContactModalErrorBoundary>
    </div>
  );
};
