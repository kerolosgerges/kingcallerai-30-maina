import React, { useState } from 'react';
import { Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContactEditDialog } from './ContactEditDialog';
import { Contact } from '@/pages/Contacts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
}

export const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  onEdit,
  onDelete,
}) => {
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (contacts.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Company & Title</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.profileImage} alt={contact.name} />
                          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          {contact.birthday && (
                            <div className="text-sm text-gray-500">
                              Born: {new Date(contact.birthday).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        {contact.company && (
                          <div className="font-medium">{contact.company}</div>
                        )}
                        {contact.title && (
                          <div className="text-sm text-gray-500">{contact.title}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {contact.phoneNumbers?.slice(0, 2).map((phone, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>{phone.countryCode} {phone.phoneNumber}</span>
                            <Badge variant="outline" className="text-xs">
                              {phone.label}
                            </Badge>
                          </div>
                        ))}
                        {(contact.phoneNumbers?.length || 0) > 2 && (
                          <div className="text-xs text-gray-500">
                            +{(contact.phoneNumbers?.length || 0) - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {contact.emails?.slice(0, 2).map((email, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="truncate max-w-40">{email.email}</span>
                            <Badge variant="outline" className="text-xs">
                              {email.label}
                            </Badge>
                          </div>
                        ))}
                        {(contact.emails?.length || 0) > 2 && (
                          <div className="text-xs text-gray-500">
                            +{(contact.emails?.length || 0) - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {contact.address && (
                          <div className="text-gray-900 max-w-32 truncate">
                            {contact.address}
                          </div>
                        )}
                        {contact.pincode && (
                          <div className="text-gray-500">PIN: {contact.pincode}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingContact(contact)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the contact "{contact.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(contact.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingContact && (
        <ContactEditDialog
          contact={editingContact}
          open={!!editingContact}
          onOpenChange={(open) => !open && setEditingContact(null)}
          onSubmit={(data) => {
            onEdit(editingContact);
            setEditingContact(null);
          }}
        />
      )}
    </>
  );
};