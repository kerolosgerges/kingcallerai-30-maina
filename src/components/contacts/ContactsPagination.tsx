import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContactsPaginationProps {
  currentPage: number;
  totalContacts: number;
  contactsPerPage: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export const ContactsPagination: React.FC<ContactsPaginationProps> = ({
  currentPage,
  totalContacts,
  contactsPerPage,
  onPageChange,
  onNextPage,
  onPreviousPage,
}) => {
  const totalPages = Math.ceil(totalContacts / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage + 1;
  const endIndex = Math.min(currentPage * contactsPerPage, totalContacts);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t px-4 py-2">
      <div className="text-xs text-gray-700">
        Showing {startIndex} to {endIndex} of {totalContacts} contacts
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="text-xs px-2 py-1 h-6"
        >
          <ChevronLeft className="h-3 w-3" />
          Previous
        </Button>
        
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="min-w-[24px] text-xs px-1 py-1 h-6"
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="text-xs px-2 py-1 h-6"
        >
          Next
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};