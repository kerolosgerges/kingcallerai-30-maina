import React, { ReactNode } from 'react';
import { ContactsContext } from '@/components/contacts/ContactsContext';
import { useContactsLogic } from '@/hooks/useContactsLogic';

interface ContactsProviderProps {
  children: ReactNode;
}

export const ContactsProvider: React.FC<ContactsProviderProps> = ({ children }) => {
  const contactsLogic = useContactsLogic();

  return (
    <ContactsContext.Provider value={contactsLogic}>
      {children}
    </ContactsContext.Provider>
  );
};