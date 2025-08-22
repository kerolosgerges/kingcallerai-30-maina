import React from 'react';
import { A2PProcessSystem } from '@/components/phone/A2PProcessSystem';
import { toast } from 'sonner';

const PhoneRegistrationTab = () => {
  const handleA2PComplete = (data: any) => {
    console.log('A2P Registration completed:', data);
    toast.success('A2P Registration submitted successfully! You will receive confirmation via email.');
  };

  return <A2PProcessSystem onComplete={handleA2PComplete} />;
};

export default PhoneRegistrationTab;