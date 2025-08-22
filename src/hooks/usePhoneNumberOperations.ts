import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { useSubAccountKingCallerAuth } from '@/hooks/useSubAccountKingCallerAuth';
import { 
  PhoneNumber, 
  ImportPhoneNumberRequest, 
  AvailablePhoneNumber, 
  BuyPhoneNumberRequest 
} from '@/services/subAccountKingCallerAuth';
import { useToast } from '@/hooks/use-toast';

export const usePhoneNumberOperations = () => {
  const { currentUser } = useAuth();
  const { currentSubAccount } = useSubAccount();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use KingCaller auth hook
  const kingCallerAuth = useSubAccountKingCallerAuth();
  
  // Check if we're on phone/settings-related routes
  const isPhoneRoute = location.pathname.includes('/phone') || location.pathname.includes('/settings');
  
  console.log('🎯 Phone Operations - Route check:', { 
    pathname: location.pathname, 
    isPhoneRoute, 
    queryEnabled: !!currentUser && !!currentSubAccount && kingCallerAuth.isConnected && isPhoneRoute 
  });

  // Query for phone numbers using KingCaller API
  const { data: phoneNumbers = [], isLoading: phoneNumbersLoading, error: phoneNumbersError } = useQuery({
    queryKey: ['kingcaller-phone-numbers', currentSubAccount?.id],
    queryFn: () => kingCallerAuth.getPhoneNumberList(),
    enabled: !!currentUser && !!currentSubAccount && kingCallerAuth.isConnected && isPhoneRoute,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for sub-account specific phone numbers
  const { data: subAccountPhoneNumbers = [], isLoading: subAccountPhoneNumbersLoading } = useQuery({
    queryKey: ['kingcaller-sub-account-phone-numbers', currentSubAccount?.id],
    queryFn: () => currentSubAccount ? kingCallerAuth.getSubAccountPhoneNumbers(currentSubAccount.id) : [],
    enabled: !!currentUser && !!currentSubAccount && kingCallerAuth.isConnected && isPhoneRoute,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Log errors for debugging
  useEffect(() => {
    if (phoneNumbersError) {
      console.error('Error loading phone numbers:', phoneNumbersError);
    }
  }, [phoneNumbersError]);

  const handleImportPhoneNumber = async (data: ImportPhoneNumberRequest) => {
    if (!currentUser || !currentSubAccount) {
      toast({
        title: "Error",
        description: "Please log in and select a sub-account to import phone numbers",
        variant: "destructive",
      });
      return;
    }
    
    if (!kingCallerAuth.isConnected) {
      toast({
        title: "Error",
        description: "Please connect to KingCaller API first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Importing phone number:", data);
      
      const importedPhoneNumber = await kingCallerAuth.importPhoneNumber(data);
      if (importedPhoneNumber) {
        await queryClient.invalidateQueries({ queryKey: ['kingcaller-phone-numbers', currentSubAccount.id] });
        await queryClient.invalidateQueries({ queryKey: ['kingcaller-sub-account-phone-numbers', currentSubAccount.id] });
        
        toast({
          title: "Phone Number Imported",
          description: `Phone number ${data.twilioPhoneNumber} has been imported successfully.`,
        });
        return importedPhoneNumber;
      } else {
        throw new Error('Failed to import phone number');
      }
    } catch (error) {
      console.error("Error importing phone number:", error);
      toast({
        title: "Error",
        description: "Failed to import phone number. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyPhoneNumber = async (data: BuyPhoneNumberRequest) => {
    if (!currentUser || !currentSubAccount) {
      toast({
        title: "Error",
        description: "Please log in and select a sub-account to buy phone numbers",
        variant: "destructive",
      });
      return;
    }
    
    if (!kingCallerAuth.isConnected) {
      toast({
        title: "Error",
        description: "Please connect to KingCaller API first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Buying phone number:", data);
      
      const purchasedPhoneNumber = await kingCallerAuth.buyPhoneNumber(data);
      if (purchasedPhoneNumber) {
        await queryClient.invalidateQueries({ queryKey: ['kingcaller-phone-numbers', currentSubAccount.id] });
        await queryClient.invalidateQueries({ queryKey: ['kingcaller-sub-account-phone-numbers', currentSubAccount.id] });
        
        toast({
          title: "Phone Number Purchased",
          description: `Phone number ${data.phoneNumber} has been purchased successfully.`,
        });
        return purchasedPhoneNumber;
      } else {
        throw new Error('Failed to buy phone number');
      }
    } catch (error) {
      console.error("Error buying phone number:", error);
      toast({
        title: "Error",
        description: "Failed to buy phone number. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailablePhoneNumbers = async (areaCode?: string): Promise<AvailablePhoneNumber[]> => {
    if (!kingCallerAuth.isConnected) {
      toast({
        title: "Error",
        description: "Please connect to KingCaller API first",
        variant: "destructive",
      });
      return [];
    }
    
    try {
      setIsLoading(true);
      console.log("Fetching available phone numbers for area code:", areaCode);
      
      const availableNumbers = await kingCallerAuth.getAvailablePhoneNumbers(areaCode);
      return availableNumbers;
    } catch (error) {
      console.error("Error fetching available phone numbers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch available phone numbers. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    phoneNumbers,
    subAccountPhoneNumbers,
    isLoading: isLoading || phoneNumbersLoading || subAccountPhoneNumbersLoading,
    setIsLoading,
    handleImportPhoneNumber,
    handleBuyPhoneNumber,
    getAvailablePhoneNumbers,
  };
};