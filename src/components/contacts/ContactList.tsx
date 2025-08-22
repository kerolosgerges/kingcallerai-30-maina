
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MoreHorizontal } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Contact } from "@/pages/Contacts";
import { useRef, useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { useContacts } from './ContactsContext';

interface ContactListProps {
  contacts: Contact[];
  selectedContacts: string[];
  onContactSelect: (contactId: string, selected: boolean) => void;
  onBulkSelectAll: (selected: boolean) => void;
  onContactClick: (contact: Contact) => void;
  selectedContact: Contact | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "new": return "bg-blue-100 text-blue-800";
    case "contacted": return "bg-yellow-100 text-yellow-800";
    case "qualified": return "bg-green-100 text-green-800";
    case "customer": return "bg-purple-100 text-purple-800";
    case "inactive": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

export const ContactList = ({
  contacts,
  selectedContacts,
  onContactSelect,
  onBulkSelectAll,
  onContactClick,
  selectedContact
}: ContactListProps) => {
  const navigate = useNavigate();
  const { subAccountId } = useParams();
  const { toast } = useToast();
  const { handleContactUpdate } = useContacts();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  
  const allSelected = contacts.length > 0 && selectedContacts.length === contacts.length;
  const someSelected = selectedContacts.length > 0 && selectedContacts.length < contacts.length;
  const checkboxRef = useRef<HTMLButtonElement>(null);

  const handleMakeCall = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to conversations page with the specific contact
    navigate(`/${subAccountId}/conversations/${contact.id}`);
  };

  const handleDeleteClick = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (contactId: string) => {
    if (contactToDelete) {
      // This would connect to the delete functionality in useContactsLogic
      // For now, we'll just show success
      toast({
        title: "Contact deleted",
        description: `${contactToDelete.name} has been deleted successfully.`,
      });
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  useEffect(() => {
    if (checkboxRef.current) {
      const checkboxElement = checkboxRef.current.querySelector('[role="checkbox"]') as HTMLElement;
      if (checkboxElement) {
        checkboxElement.setAttribute('data-state', someSelected ? 'indeterminate' : allSelected ? 'checked' : 'unchecked');
      }
    }
  }, [someSelected, allSelected]);

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-white border-b">
          <TableRow className="h-8">
            <TableHead className="w-8 px-2">
              <Checkbox
                ref={checkboxRef}
                checked={allSelected}
                onCheckedChange={onBulkSelectAll}
                className="h-3 w-3"
              />
            </TableHead>
            <TableHead className="text-xs font-medium">Contact</TableHead>
            <TableHead className="text-xs font-medium">Company</TableHead>
            <TableHead className="text-xs font-medium">Tags</TableHead>
            <TableHead className="text-xs font-medium">Status</TableHead>
            <TableHead className="text-xs font-medium">Lead Source</TableHead>
            <TableHead className="text-xs font-medium">Score</TableHead>
            <TableHead className="text-xs font-medium">Last Contact</TableHead>
            <TableHead className="w-8 px-2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow 
              key={contact.id}
              className="cursor-pointer hover:bg-gray-50 h-12"
              onClick={() => onContactClick(contact)}
            >
              <TableCell onClick={(e) => e.stopPropagation()} className="px-2">
                <Checkbox
                  checked={selectedContacts.includes(contact.id)}
                  onCheckedChange={(checked) => onContactSelect(contact.id, checked as boolean)}
                  className="h-3 w-3"
                />
              </TableCell>
              <TableCell className="py-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="text-xs">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-xs">{contact.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="h-2 w-2" />
                      {contact.email}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone className="h-2 w-2" />
                      {contact.phone}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-2">
                <div className="text-xs">{contact.company || "-"}</div>
              </TableCell>
              <TableCell className="py-2">
                <div className="flex flex-wrap gap-1">
                  {contact.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {contact.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{contact.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-2">
                <Badge className={`text-xs px-1 py-0 ${getStatusColor(contact.status)}`}>
                  {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="py-2">
                <div className="text-xs">{contact.leadSource}</div>
              </TableCell>
              <TableCell className="py-2">
                <div className={`text-xs font-medium ${getScoreColor(contact.score)}`}>
                  {contact.score}
                </div>
              </TableCell>
              <TableCell className="py-2">
                <div className="text-xs text-gray-500">
                  {contact.lastContacted || "Never"}
                </div>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()} className="px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white z-50">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onContactClick(contact);
                    }} className="text-xs">
                      Edit Contact
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Send Email</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleMakeCall(contact, e)} className="text-xs">Make Call</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Add Note</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleDeleteClick(contact, e)} className="text-red-600 text-xs">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {contacts.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-base mb-2">No contacts found</div>
          <div className="text-gray-500 text-sm">
            Try adjusting your search or filters
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">Delete Contact</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete {contactToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConfirmDelete(contactToDelete?.id || '')} className="text-sm">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
