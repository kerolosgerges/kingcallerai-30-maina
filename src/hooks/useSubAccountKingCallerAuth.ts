import { useState, useEffect, useCallback } from 'react';
import { 
  subAccountKingCallerAuth, 
  Agent, 
  AmbientSound, 
  Voice, 
  AgentSpeechSettings,
  CreateAssistantRequest,
  UpdateAssistantRequest,
  AssistantDetails,
} from '@/services/subAccountKingCallerAuth';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { useAuth } from '@/contexts/AuthContext';

export const useSubAccountKingCallerAuth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { currentSubAccount } = useSubAccount();
  const { currentUser } = useAuth();

  // Set the current sub-account ID when it changes
  useEffect(() => {
    console.log('🔄 SubAccount changed:', currentSubAccount?.id);
    if (currentSubAccount?.id) {
      subAccountKingCallerAuth.setSubAccount(currentSubAccount.id);
      const authenticated = subAccountKingCallerAuth.isAuthenticated();
      console.log('🔍 KingCaller auth status:', authenticated);
      setIsConnected(authenticated);
    }
  }, [currentSubAccount?.id]);

  const connect = useCallback(async () => {
    console.log('🔌 Attempting to connect to KingCaller...');
    console.log('📊 Connect context:', {
      currentUser: !!currentUser,
      currentSubAccountId: currentSubAccount?.id,
      currentSubAccountName: currentSubAccount?.name
    });
    
    if (!currentUser || !currentSubAccount?.id) {
      const errorMsg = 'User not authenticated or no sub-account selected';
      console.error('❌', errorMsg);
      setError(errorMsg);
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log('📞 Calling subAccountKingCallerAuth.authenticate()...');
      const success = await subAccountKingCallerAuth.authenticate();
      console.log('📥 Authentication result:', success);
      
      setIsConnected(success);
      
      if (!success) {
        const errorMsg = 'Failed to connect to KingCaller API';
        console.error('❌', errorMsg);
        setError(errorMsg);
      } else {
        console.log('✅ Successfully connected to KingCaller API');
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Connection error:', errorMessage);
      setError(errorMessage);
      setIsConnected(false);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [currentUser, currentSubAccount?.id]);

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting from KingCaller...');
    subAccountKingCallerAuth.disconnect();
    setIsConnected(false);
    setError(null);
  }, []);

  const makeApiCall = useCallback(async (endpoint: string, options?: RequestInit) => {
    try {
      setError(null);
      const response = await subAccountKingCallerAuth.makeAuthenticatedRequest(endpoint, options);
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'API call failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getAccessToken = useCallback(async () => {
    try {
      return await subAccountKingCallerAuth.getValidAccessToken();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get access token';
      setError(errorMessage);
      return null;
    }
  }, []);

  const getAgents = useCallback(async (page: number = 1, limit: number = 10, search: string = '', isDeleted?: boolean): Promise<Agent[]> => {
    try {
      console.log('🤖 Fetching agents from KingCaller...');
      console.log('📊 Request params:', { page, limit, search, isDeleted });
      
      setError(null);
      const agents = await subAccountKingCallerAuth.getAgentList(page, limit, search);
      
      console.log('📥 Received agents:', agents);
      console.log('📊 Agent count:', agents.length);
      
      return agents;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch agents';
      console.error('❌ Error fetching agents:', errorMessage);
      setError(errorMessage);
      return [];
    }
  }, []);

  const getDeletedAgents = useCallback(async (page: number = 1, limit: number = 10, search: string = ''): Promise<Agent[]> => {
    try {
      setError(null);
      return await subAccountKingCallerAuth.getAgentList(page, limit, search);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch deleted agents';
      setError(errorMessage);
      return [];
    }
  }, []);

  const getAssistantById = useCallback(async (assistantId: string): Promise<AssistantDetails | null> => {
    try {
      setError(null);
      return await subAccountKingCallerAuth.getAssistantById(assistantId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assistant details';
      setError(errorMessage);
      return null;
    }
  }, []);

  const createAssistant = useCallback(async (assistantData: CreateAssistantRequest): Promise<string | null> => {
    try {
      setError(null);
      console.log('Hook: Creating assistant with data:', assistantData);
      return await subAccountKingCallerAuth.createAssistant(assistantData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create assistant';
      console.error('Hook: Error creating assistant:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, []);

  const updateAssistant = useCallback(async (assistantId: string, assistantData: UpdateAssistantRequest): Promise<AssistantDetails | null> => {
    try {
      setError(null);
      console.log('Hook: Updating assistant:', { assistantId, assistantData });
      return await subAccountKingCallerAuth.updateAssistant(assistantId, assistantData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update assistant';
      console.error('Hook: Error updating assistant:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, []);

  const deleteAssistant = useCallback(async (assistantId: string): Promise<boolean> => {
    try {
      setError(null);
      console.log('Hook: Deleting assistant:', assistantId);
      return await subAccountKingCallerAuth.deleteAssistant(assistantId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete assistant';
      console.error('Hook: Error deleting assistant:', errorMessage);
      setError(errorMessage);
      return false;
    }
  }, []);

  const scrapWebsite = useCallback(async (websiteUrl: string): Promise<any> => {
    try {
      setError(null);
      console.log('Hook: Scraping website:', websiteUrl);
      return await subAccountKingCallerAuth.scrapWebsite(websiteUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scrape website';
      console.error('Hook: Error scraping website:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, []);


  const getAmbientSounds = useCallback(async (): Promise<AmbientSound[]> => {
    try {
      setError(null);
      return await subAccountKingCallerAuth.getAmbientSounds();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ambient sounds';
      setError(errorMessage);
      return [];
    }
  }, []);

  const getVoices = useCallback(async (): Promise<Voice[]> => {
    try {
      setError(null);
      console.log('Hook: Fetching voices from KingCaller API...');
      const voices = await subAccountKingCallerAuth.getVoiceList();
      console.log('Hook: Received voices:', voices);
      return voices;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch voices';
      console.error('Hook: Error fetching voices:', errorMessage);
      setError(errorMessage);
      return [];
    }
  }, []);

  const updateAgentSpeechSettings = useCallback(async (agentId: string, settings: AgentSpeechSettings): Promise<AgentSpeechSettings | null> => {
    try {
      setError(null);
      return await subAccountKingCallerAuth.updateAgentSpeechSettings(agentId, settings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update agent settings';
      setError(errorMessage);
      return null;
    }
  }, []);

  const createKingCallerAgent = useCallback(async (agentData: any): Promise<string | null> => {
    try {
      setError(null);
      console.log('Hook: Creating KingCaller agent with data:', agentData);
      return await subAccountKingCallerAuth.createKingCallerAgent(agentData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create agent';
      console.error('Hook: Error creating KingCaller agent:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, []);

  // Phone number management methods
  const getPhoneNumberList = useCallback(async (): Promise<any[]> => {
    try {
      setError(null);
      return await subAccountKingCallerAuth.getPhoneNumberList();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch phone numbers';
      setError(errorMessage);
      return [];
    }
  }, []);

  const getSubAccountPhoneNumbers = useCallback(async (subAccountId: string): Promise<any[]> => {
    try {
      setError(null);
      return await subAccountKingCallerAuth.getSubAccountPhoneNumbers(subAccountId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sub-account phone numbers';
      setError(errorMessage);
      return [];
    }
  }, []);

  const importPhoneNumber = useCallback(async (importData: any): Promise<any> => {
    try {
      setError(null);
      console.log('Hook: Importing phone number:', importData);
      return await subAccountKingCallerAuth.importPhoneNumber(importData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import phone number';
      console.error('Hook: Error importing phone number:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, []);

  const buyPhoneNumber = useCallback(async (buyData: any): Promise<any> => {
    try {
      setError(null);
      console.log('Hook: Buying phone number:', buyData);
      return await subAccountKingCallerAuth.buyPhoneNumber(buyData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to buy phone number';
      console.error('Hook: Error buying phone number:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, []);

  const getAvailablePhoneNumbers = useCallback(async (areaCode?: string): Promise<any[]> => {
    try {
      setError(null);
      return await subAccountKingCallerAuth.getAvailablePhoneNumbers(areaCode);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch available phone numbers';
      setError(errorMessage);
      return [];
    }
  }, []);

  // Contact management methods
  const createContact = useCallback(async (contactData: any): Promise<string | null> => {
    try {
      setError(null);
      console.log('Hook: Creating contact:', contactData);
      return await subAccountKingCallerAuth.createContact(contactData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create contact';
      console.error('Hook: Error creating contact:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, []);

  const getContactList = useCallback(async (page: number = 1, limit: number = 100, search: string = ''): Promise<any[]> => {
    try {
      setError(null);
      return await subAccountKingCallerAuth.getContactList(page, limit, search);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch contacts';
      setError(errorMessage);
      return [];
    }
  }, []);

  const getContactById = useCallback(async (contactId: string): Promise<any> => {
    try {
      setError(null);
      return await subAccountKingCallerAuth.getContactById(contactId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch contact details';
      setError(errorMessage);
      return null;
    }
  }, []);

  const updateContact = useCallback(async (contactId: string, contactData: any): Promise<any> => {
    try {
      setError(null);
      console.log('Hook: Updating contact:', { contactId, contactData });
      return await subAccountKingCallerAuth.updateContact(contactId, contactData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update contact';
      console.error('Hook: Error updating contact:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, []);

  const deleteContact = useCallback(async (contactId: string): Promise<boolean> => {
    try {
      setError(null);
      console.log('Hook: Deleting contact:', contactId);
      return await subAccountKingCallerAuth.deleteContact(contactId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete contact';
      console.error('Hook: Error deleting contact:', errorMessage);
      setError(errorMessage);
      return false;
    }
  }, []);

  const bulkCreateContacts = useCallback(async (bulkData: any): Promise<boolean> => {
    try {
      setError(null);
      console.log('Hook: Bulk creating contacts:', bulkData);
      return await subAccountKingCallerAuth.bulkCreateContacts(bulkData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk create contacts';
      console.error('Hook: Error bulk creating contacts:', errorMessage);
      setError(errorMessage);
      return false;
    }
  }, []);

  const bulkImportPincode = useCallback(async (pincodeData: any): Promise<boolean> => {
    try {
      setError(null);
      console.log('Hook: Bulk importing pincodes:', pincodeData);
      return await subAccountKingCallerAuth.bulkImportPincode(pincodeData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk import pincodes';
      console.error('Hook: Error bulk importing pincodes:', errorMessage);
      setError(errorMessage);
      return false;
    }
  }, []);

  // Call operations - temporarily disabled
  const makeTwilioCall = useCallback(async (callData: { assistantId: string; twilioPhoneId: string; contactPhoneNumber: string }): Promise<any> => {
    try {
      setError(null);
      console.log('Hook: Call service temporarily disabled:', callData);
      return { success: false, message: 'Service temporarily disabled' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to make Twilio call';
      console.error('Hook: Error making Twilio call:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, []);

  const getCallLogsWithTranscript = useCallback(async (phoneNumber: string): Promise<any[]> => {
    try {
      setError(null);
      console.log('Call logs service temporarily disabled', phoneNumber);
      return [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch call logs with transcript';
      setError(errorMessage);
      return [];
    }
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    makeApiCall,
    getAccessToken,
    // Agent CRUD operations
    getAgents,
    getDeletedAgents,
    getAssistantById,
    createAssistant,
    updateAssistant,
    deleteAssistant,
    scrapWebsite,
    // Phone number operations
    getPhoneNumberList,
    getSubAccountPhoneNumbers,
    importPhoneNumber,
    buyPhoneNumber,
    getAvailablePhoneNumbers,
    // Contact operations
    createContact,
    getContactList,
    getContactById,
    updateContact,
    deleteContact,
    bulkCreateContacts,
    bulkImportPincode,
    // Call operations
    makeTwilioCall,
    getCallLogsWithTranscript,
    // Utility methods
    getAmbientSounds,
    getVoices,
    updateAgentSpeechSettings,
    createKingCallerAgent,
    clearError: () => setError(null)
  };
};
