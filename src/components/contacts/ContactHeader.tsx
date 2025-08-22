
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Filter,
  MoreVertical,
  Users,
  TrendingUp,
  Star,
  Phone
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useContacts } from './ContactsContext';

interface ContactHeaderProps {
  onAddContact: () => void;
  onImportContacts: () => void;
  onExportContacts: () => void;
}

export const ContactHeader: React.FC<ContactHeaderProps> = ({
  onAddContact,
  onImportContacts,
  onExportContacts,
}) => {
  const {
    contacts,
    filteredContacts,
    selectedContacts,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    handleBulkAction,
  } = useContacts();

  // Calculate stats
  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    contacted: contacts.filter(c => c.status === 'contacted').length,
    customers: contacts.filter(c => c.status === 'customer').length,
  };

  const statusOptions = [
    { value: 'all', label: 'All Contacts', count: stats.total },
    { value: 'new', label: 'New', count: stats.new },
    { value: 'contacted', label: 'Contacted', count: stats.contacted },
    { value: 'qualified', label: 'Qualified', count: contacts.filter(c => c.status === 'qualified').length },
    { value: 'customer', label: 'Customers', count: stats.customers },
    { value: 'inactive', label: 'Inactive', count: contacts.filter(c => c.status === 'inactive').length },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Contacts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your contact database and relationships
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onImportContacts}
            className="hidden sm:flex"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExportContacts}
            className="hidden sm:flex"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button 
            onClick={onAddContact}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>

          {/* Mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="sm:hidden">
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onImportContacts}>
                <Upload className="h-4 w-4 mr-2" />
                Import Contacts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportContacts}>
                <Download className="h-4 w-4 mr-2" />
                Export Contacts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Contacts</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">New Leads</p>
              <p className="text-2xl font-bold text-green-900">{stats.new}</p>
            </div>
            <Star className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Contacted</p>
              <p className="text-2xl font-bold text-orange-900">{stats.contacted}</p>
            </div>
            <Phone className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Customers</p>
              <p className="text-2xl font-bold text-purple-900">{stats.customers}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <Badge
              key={status.value}
              variant={statusFilter === status.value ? "default" : "outline"}
              className={`cursor-pointer transition-all hover:scale-105 ${
                statusFilter === status.value 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-primary/10'
              }`}
              onClick={() => setStatusFilter(status.value)}
            >
              {status.label} {status.count > 0 && `(${status.count})`}
            </Badge>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedContacts.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm text-blue-700 font-medium">
              {selectedContacts.length} selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleBulkAction('delete')}
                  className="text-red-600"
                >
                  Delete Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('tag')}>
                  Add Tags
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                  Export Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredContacts.length} of {contacts.length} contacts
        </span>
        {(searchTerm || statusFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="text-primary hover:text-primary/80"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
