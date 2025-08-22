
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Tag, 
  Mail, 
  Phone, 
  Download, 
  MoreVertical,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useContacts } from './ContactsContext';

export const BulkActionsToolbar: React.FC = () => {
  const {
    selectedContacts,
    setSelectedContacts,
    handleBulkAction,
  } = useContacts();

  const clearSelection = () => {
    setSelectedContacts([]);
  };

  return (
    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-center gap-3">
        <Badge variant="default" className="bg-blue-600">
          {selectedContacts.length} selected
        </Badge>
        
        <div className="hidden sm:flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleBulkAction('delete')}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleBulkAction('tag')}
          >
            <Tag className="h-4 w-4 mr-2" />
            Add Tags
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleBulkAction('email')}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleBulkAction('export')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Mobile dropdown for actions */}
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleBulkAction('delete')}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('tag')}>
                <Tag className="h-4 w-4 mr-2" />
                Add Tags
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('email')}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Button 
        variant="ghost" 
        size="sm"
        onClick={clearSelection}
        className="text-gray-600 hover:text-gray-800"
      >
        <X className="h-4 w-4 mr-1" />
        Clear
      </Button>
    </div>
  );
};
