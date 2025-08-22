import React from 'react';
import { ContactList } from './ContactList';
import { BulkActionsToolbar } from './BulkActionsToolbar';
import { Button } from '@/components/ui/button';
import { Grid } from 'lucide-react';
import { useContacts } from './ContactsContext';
import { Badge } from '@/components/ui/badge';

export const ContactsContent: React.FC = () => {
  const {
    filteredContacts,
    selectedContacts,
    selectedContact,
    isLoading,
    searchTerm,
    statusFilter,
    handleContactSelect,
    handleBulkSelectAll,
    handleContactClick,
  } = useContacts();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Results Info and Bulk Actions */}
      <div className="border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-end">
          {/* Results Info */}
          <div className="flex items-center gap-3">
            {(searchTerm || statusFilter !== 'all') && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Filtered:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    Search: "{searchTerm}"
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    Status: {statusFilter}
                  </Badge>
                )}
              </div>
            )}
            
            <span className="text-xs text-gray-600">
              {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedContacts.length > 0 && (
          <div className="mt-2">
            <BulkActionsToolbar />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Grid className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No contacts found' 
                  : 'No contacts yet'
                }
              </h3>
              <p className="text-gray-600 mb-3 text-sm">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'Get started by adding your first contact or importing from a CSV file.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => {/* handled by parent */}}
                    size="sm"
                  >
                    Add Contact
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {/* handled by parent */}}
                    size="sm"
                  >
                    Import CSV
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full">
            <ContactList
              contacts={filteredContacts}
              selectedContacts={selectedContacts}
              onContactSelect={handleContactSelect}
              onBulkSelectAll={handleBulkSelectAll}
              onContactClick={handleContactClick}
              selectedContact={selectedContact}
            />
          </div>
        )}
      </div>
    </div>
  );
};