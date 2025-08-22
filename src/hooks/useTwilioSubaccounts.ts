
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { twilioSubaccountService } from '@/services/twilioSubaccountService';
import { 
  TwilioSubAccount, 
  TwilioPhoneNumber, 
  CreateSubAccountRequest, 
  PurchasePhoneNumberRequest 
} from '@/types/twilio';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSubAccount } from '@/contexts/SubAccountContext';

export const useTwilioSubaccounts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubAccount, setCurrentSubAccount] = useState<TwilioSubAccount | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const { currentSubAccount: userSubAccount } = useSubAccount();

  // Set SaaS ID when user or subaccount changes
  useEffect(() => {
    if (userSubAccount?.id) {
      twilioSubaccountService.setSaasId(userSubAccount.id);
    }
  }, [userSubAccount?.id]);

  // Query for subaccounts list
  const { data: subAccounts = [], isLoading: subAccountsLoading } = useQuery({
    queryKey: ['twilio-subaccounts', userSubAccount?.id],
    queryFn: async () => {
      const result = await twilioSubaccountService.listSubAccounts();
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    },
    enabled: !!userSubAccount?.id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for current subaccount phone numbers
  const { data: phoneNumbers = [], isLoading: phoneNumbersLoading } = useQuery({
    queryKey: ['twilio-phone-numbers', currentSubAccount?.sid],
    queryFn: async () => {
      if (!currentSubAccount?.sid) return [];
      
      const result = await twilioSubaccountService.getSubAccountPhoneNumbers(currentSubAccount.sid);
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    },
    enabled: !!currentSubAccount?.sid,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // Set the first subaccount as current if none selected
  useEffect(() => {
    if (subAccounts.length > 0 && !currentSubAccount) {
      setCurrentSubAccount(subAccounts[0]);
    }
  }, [subAccounts, currentSubAccount]);

  const createSubAccount = useCallback(async (friendlyName: string): Promise<TwilioSubAccount | null> => {
    setIsLoading(true);
    
    try {
      console.log('🏗️ Creating subaccount:', friendlyName);
      
      const result = await twilioSubaccountService.createSubAccount({ friendly_name: friendlyName });
      
      if (result.success && result.data) {
        await queryClient.invalidateQueries({ queryKey: ['twilio-subaccounts', userSubAccount?.id] });
        
        toast({
          title: "Subaccount Created",
          description: `Subaccount "${friendlyName}" has been created successfully.`,
        });
        
        setCurrentSubAccount(result.data);
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create subaccount');
      }
    } catch (error) {
      console.error('❌ Error creating subaccount:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create subaccount',
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, toast, userSubAccount?.id]);

  const purchasePhoneNumber = useCallback(async (request: PurchasePhoneNumberRequest): Promise<TwilioPhoneNumber | null> => {
    if (!currentSubAccount) {
      toast({
        title: "Error",
        description: "No subaccount selected. Please create or select a subaccount first.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    
    try {
      console.log('📞 Purchasing phone number:', request);
      
      const result = await twilioSubaccountService.purchasePhoneNumber(request, currentSubAccount.sid);
      
      if (result.success && result.data) {
        await queryClient.invalidateQueries({ queryKey: ['twilio-phone-numbers', currentSubAccount.sid] });
        
        toast({
          title: "Phone Number Purchased",
          description: `Phone number ${result.data.phone_number} has been purchased successfully.`,
        });
        
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to purchase phone number');
      }
    } catch (error) {
      console.error('❌ Error purchasing phone number:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to purchase phone number',
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentSubAccount, queryClient, toast]);

  return {
    // Data
    subAccounts,
    currentSubAccount,
    phoneNumbers,
    
    // Loading states
    isLoading: isLoading || subAccountsLoading || phoneNumbersLoading,
    subAccountsLoading,
    phoneNumbersLoading,
    
    // Actions
    createSubAccount,
    purchasePhoneNumber,
    setCurrentSubAccount,
    
    // Helper
    hasSubAccounts: subAccounts.length > 0,
  };
};
