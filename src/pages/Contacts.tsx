
import React from 'react';
import { ContactsProvider } from '@/components/contacts/ContactsProvider';
import { ContactsLayout } from '@/components/contacts/ContactsLayout';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  title?: string;
  address?: string;
  pincode?: string;
  postalCode?: string;
  birthday?: string;
  notes?: string;
  profileImage?: string;
  avatar?: string;
  tags: string[];
  status: 'new' | 'contacted' | 'qualified' | 'customer' | 'inactive';
  leadSource: string;
  score: number;
  lastContacted?: string;
  activities: Activity[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  subAccountId: string;
  createdBy: string;
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

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'sms' | 'task' | 'note';
  description: string;
  timestamp: string;
  notes?: string;
}

const Contacts = () => {
  return (
    <ContactsProvider>
      <ContactsLayout />
    </ContactsProvider>
  );
};

export default Contacts;
