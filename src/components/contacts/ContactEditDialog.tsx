import React, { useEffect } from 'react';
import { ContactCreateDialog } from './ContactCreateDialog';
import { Contact } from '@/pages/Contacts';

interface ContactEditDialogProps {
  contact: Contact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export const ContactEditDialog: React.FC<ContactEditDialogProps> = ({
  contact,
  open,
  onOpenChange,
  onSubmit,
}) => {
  // Transform the contact data to match the create dialog format
  const initialData = React.useMemo(() => ({
    name: contact.name || '',
    title: contact.title || '',
    company: contact.company || '',
    country: '', // Country field not available in existing contact data
    address: contact.address || '',
    pincode: contact.pincode || '',
    postalCode: contact.postalCode || '',
    birthday: contact.birthday || '',
    notes: contact.notes || '',
    profileImage: contact.profileImage || '',
    phoneNumbers: contact.phoneNumbers?.length ? contact.phoneNumbers : [{ countryCode: '+1', phoneNumber: '', label: 'Office' }],
    emails: contact.emails?.length ? contact.emails : [{ email: '', label: 'Office' }],
  }), [contact]);

  return (
    <ContactCreateDialog
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      initialData={initialData}
      isEditMode={true}
      title="Edit Contact"
      description="Update the contact information below."
    />
  );
};