
import { KingCallerAuthService } from './kingcaller/kingCallerAuthService';
import { KingCallerVoiceService } from './kingcaller/kingCallerVoiceService';
import { KingCallerAgentService } from './kingcaller/kingCallerAgentService';

import { KingCallerPhoneService } from './kingcaller/kingCallerPhoneService';
import { KingCallerContactService } from './kingcaller/kingCallerContactService';
import { KingCallerLogsService } from './kingcaller/kingCallerLogsService';
// Workflow service temporarily removed
// Removed unused services

export type {
  Agent,
  AmbientSound,
  Voice,
  VoiceDetails,
  TestVoice,
  RequestTestCallRequest,
  CreateTestVoiceRequest,
  AgentSpeechSettings,
  CreateKingCallerAgentRequest,
  CreateAssistantRequest,
  UpdateAssistantRequest,
  AssistantDetails,
  ScrapWebsiteRequest,
  PhoneNumber,
  ImportPhoneNumberRequest,
  AvailablePhoneNumber,
  BuyPhoneNumberRequest,
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  BulkCreateContactsRequest,
  BulkImportPincodeRequest,
  ContactPhoneNumber,
  ContactEmail,
  ApiLog,
  CallLog,
  LogsListResponse,
  KingCallerWorkflow,
  WorkflowNode,
  WorkflowEdge,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  BolnaAgent,
  CreateBolnaAgentRequest,
  UpdateBolnaAgentRequest,
  PatchAgentSettingsRequest,
  CreateLLMThreadRequest,
  PlaygroundCompletionRequest,
  MakeTwilioCallRequest,
  MakeTwilioCallResponse,
  CallLogWithTranscript
} from './kingcaller/kingCallerTypes';

class SubAccountKingCallerAuth {
  private authService: KingCallerAuthService;
  private voiceService: KingCallerVoiceService;
  private agentService: KingCallerAgentService;
  
  private phoneService: KingCallerPhoneService;
  private contactService: KingCallerContactService;
  private logsService: KingCallerLogsService;
  // private workflowService: KingCallerWorkflowService; // Temporarily disabled
  // Removed unused services

  constructor() {
    this.authService = new KingCallerAuthService();
    this.voiceService = new KingCallerVoiceService(this.authService);
    this.agentService = new KingCallerAgentService(this.authService);
    
    this.phoneService = new KingCallerPhoneService(this.authService);
    this.contactService = new KingCallerContactService(this.authService);
    this.logsService = new KingCallerLogsService(this.authService);
    // this.workflowService = new KingCallerWorkflowService(this.authService); // Temporarily disabled
    // Removed unused services
  }

  // Auth service methods
  setSubAccount(subAccountId: string) {
    this.authService.setSubAccount(subAccountId);
  }

  async authenticate(): Promise<boolean> {
    return this.authService.authenticate();
  }

  async getValidAccessToken(): Promise<string | null> {
    return this.authService.getValidAccessToken();
  }

  async makeAuthenticatedRequest(endpoint: string, options?: RequestInit): Promise<Response> {
    return this.authService.makeAuthenticatedRequest(endpoint, options);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  disconnect() {
    this.authService.disconnect();
  }

  // Voice service methods
  async getVoiceList() {
    return this.voiceService.getVoiceList();
  }

  async getAmbientSounds() {
    return this.voiceService.getAmbientSounds();
  }

  async getVoiceDetails(voiceId: string) {
    return this.voiceService.getVoiceDetails(voiceId);
  }

  async getTestVoices() {
    return this.voiceService.getTestVoices();
  }

  async requestTestCall(request: any) {
    return this.voiceService.requestTestCall(request);
  }

  async createTestVoice(request: any) {
    return this.voiceService.createTestVoice(request);
  }

  // Agent service methods
  async getAgentList(page?: number, limit?: number, search?: string) {
    return this.agentService.getAgentList(page, limit, search);
  }

  async getAssistantById(assistantId: string) {
    return this.agentService.getAssistantById(assistantId);
  }

  async createAssistant(assistantData: any) {
    return this.agentService.createAssistant(assistantData);
  }

  async updateAssistant(assistantId: string, assistantData: any) {
    return this.agentService.updateAssistant(assistantId, assistantData);
  }

  async deleteAssistant(assistantId: string) {
    // Delete functionality removed from KingCaller agent service
    console.warn('Delete assistant functionality not available in KingCaller service');
    return false;
  }

  async scrapWebsite(websiteUrl: string) {
    return this.agentService.scrapWebsite(websiteUrl);
  }

  async updateAgentSpeechSettings(agentId: string, settings: any) {
    return this.agentService.updateAgentSpeechSettings(agentId, settings);
  }

  async createKingCallerAgent(agentData: any) {
    return this.agentService.createKingCallerAgent(agentData);
  }


  // Phone service methods
  async importPhoneNumber(importData: any) {
    return this.phoneService.importPhoneNumber(importData);
  }

  async getPhoneNumberList() {
    return this.phoneService.getPhoneNumberList();
  }

  async getAvailablePhoneNumbers(areaCode?: string) {
    return this.phoneService.getAvailablePhoneNumbers(areaCode);
  }

  async buyPhoneNumber(buyData: any) {
    return this.phoneService.buyPhoneNumber(buyData);
  }

  async getSubAccountPhoneNumbers(subAccountId: string) {
    return this.phoneService.getSubAccountPhoneNumbers(subAccountId);
  }

  // Contact service methods
  async createContact(contactData: any) {
    return this.contactService.createContact(contactData);
  }

  async getContactList(page?: number, limit?: number, search?: string) {
    return this.contactService.getContactList(page, limit, search);
  }

  async getContactById(contactId: string) {
    return this.contactService.getContactById(contactId);
  }

  async updateContact(contactId: string, contactData: any) {
    return this.contactService.updateContact(contactId, contactData);
  }

  async deleteContact(contactId: string) {
    return this.contactService.deleteContact(contactId);
  }

  async bulkCreateContacts(bulkData: any) {
    return this.contactService.bulkCreateContacts(bulkData);
  }

  async bulkImportPincode(pincodeData: any) {
    return this.contactService.bulkImportPincode(pincodeData);
  }

  // Logs service methods
  async getApiLogs(page?: number, limit?: number, search?: string) {
    return this.logsService.getApiLogs(page, limit, search);
  }

  async getCallLogs(page?: number, limit?: number, search?: string) {
    return this.logsService.getCallLogs(page, limit, search);
  }

  async getCallLogById(logId: string) {
    return this.logsService.getCallLogById(logId);
  }

  async getLogsDownloadLink() {
    return this.logsService.getLogsDownloadLink();
  }

  async downloadLogsFile(logId: string) {
    return this.logsService.downloadLogsFile(logId);
  }

  async downloadCallAudio(logId: string) {
    return this.logsService.downloadCallAudio(logId);
  }

  // Workflow service methods - temporarily disabled
  async createWorkflow(workflowData: any) {
    console.warn('Workflow service temporarily disabled');
    return null;
  }

  async updateWorkflow(workflowId: string, workflowData: any) {
    console.warn('Workflow service temporarily disabled');
    return null;
  }

  async getWorkflowList() {
    console.warn('Workflow service temporarily disabled');
    return [];
  }

  async getWorkflowById(workflowId: string) {
    console.warn('Workflow service temporarily disabled');
    return null;
  }

  async deleteWorkflow(workflowId: string) {
    console.warn('Workflow service temporarily disabled');
    return false;
  }

  // Removed Bolna and Call service methods - services temporarily disabled
}

export const subAccountKingCallerAuth = new SubAccountKingCallerAuth();
