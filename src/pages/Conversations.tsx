
import React from 'react';
import { ContactsProvider } from '@/components/contacts/ContactsProvider';
import { ConversationsLayout } from '@/components/conversations/ConversationsLayout';

const Conversations = () => {
  return (
    <ContactsProvider>
      <ConversationsLayout />
    </ContactsProvider>
  );
};

export default Conversations;
