
export interface KingCallerTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface KingCallerAuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface Agent {
  id: string;
  agentName: string;
  [key: string]: any;
}

export interface AgentListResponse {
  success: boolean;
  data: Agent[];
}

export interface AmbientSound {
  id: string;
  name: string;
  [key: string]: any;
}

export interface AmbientSoundResponse {
  success: boolean;
  data: AmbientSound[];
}

export interface Voice {
  voiceId: string;
  name: string;
  provider: string;
  language: string;
  gender: string;
  sampleUrl?: string;
}

export interface VoiceDetails extends Voice {
  description?: string;
  category?: string;
  settings?: any;
}

export interface TestVoice {
  id: string;
  name: string;
  text: string;
  agentName: string;
  profileImage?: string;
  voiceId: string;
  greeting: string;
  instructions: string;
  listenModel: string;
  thinkModel: string;
  knowledgeBase?: {
    services?: string[];
    company?: string;
  };
}

export interface RequestTestCallRequest {
  contactPhoneNumber: string;
  name: string;
  voice: string;
}

export interface CreateTestVoiceRequest {
  name: string;
  text: string;
  agentName: string;
  profileImage?: string;
  voiceId: string;
  greeting: string;
  instructions: string;
  listenModel: string;
  thinkModel: string;
  knowledgeBase?: {
    services?: string[];
    company?: string;
  };
}

export interface VoiceListResponse {
  success: boolean;
  data: Voice[];
}

export interface AgentSpeechSettings {
  ambientSound?: string;
  responsiveness?: number;
  interruptionSensitivity?: number;
  enableBackchannel?: boolean;
  backchannelFrequency?: number;
}

export interface UpdateAgentResponse {
  success: boolean;
  message: string;
  data: AgentSpeechSettings;
}

export interface CreateKingCallerAgentRequest {
  name: string;
  prompt: string;
  welcomeMessage: string;
  model: string;
  voice: string;
  agentType: string;
  speechSettings?: AgentSpeechSettings;
}

export interface CreateKingCallerAgentResponse {
  success: boolean;
  data: {
    id: string;
    agentName: string;
    [key: string]: any;
  };
  message?: string;
}

export interface KnowledgeBase {
  services?: any[];
  company?: string;
  restrictTo?: boolean;
  topics?: string[];
}

export interface CreateAssistantRequest {
  agentName: string;
  profileImage?: string;
  voiceId: string;
  greeting: string;
  instructions: string;
  listenModel?: string;
  thinkModel?: string;
  knowledgeBase?: KnowledgeBase;
  toolConfigIds?: string[];
}

export interface UpdateAssistantRequest {
  agentName?: string;
  profileImage?: string;
  voiceId?: string;
  greeting?: string;
  instructions?: string;
  listenModel?: string;
  thinkModel?: string;
  knowledgeBase?: KnowledgeBase;
  slackWebhookUrl?: string;
  slackWebhookActive?: boolean;
  toolConfigIds?: string[];
  ambientSoundEnabled?: boolean;
  ambientSoundId?: string;
}

export interface AssistantDetails extends Agent {
  profileImage?: string;
  greeting?: string;
  instructions?: string;
  listenModel?: string;
  thinkModel?: string;
  knowledgeBase?: KnowledgeBase;
  slackWebhookUrl?: string;
  slackWebhookActive?: boolean;
  toolConfigIds?: string[];
  ambientSoundEnabled?: boolean;
  ambientSoundId?: string;
}

export interface ScrapWebsiteRequest {
  websiteUrl: string;
}

export interface ScrapWebsiteResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: 'SMS' | 'EMAIL' | 'PHONE';
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CreateCampaignRequest {
  name: string;
  description?: string;
  type: 'SMS' | 'EMAIL' | 'PHONE';
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
}

export interface UpdateCampaignRequest {
  name?: string;
  description?: string;
  type?: 'SMS' | 'EMAIL' | 'PHONE';
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'COMPLETED';
}

export interface CampaignListResponse {
  success: boolean;
  data: Campaign[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CampaignDetailsResponse {
  success: boolean;
  data: Campaign;
  message?: string;
}

export interface CampaignStatistics {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  campaignsByType: {
    SMS: number;
    EMAIL: number;
    PHONE: number;
  };
  [key: string]: any;
}

export interface CampaignStatisticsResponse {
  success: boolean;
  data: CampaignStatistics;
  message?: string;
}

// API Configuration - staging endpoint removed
// export const KINGCALLER_API_BASE = 'https://staging.kingcaller.ai';

// Auth Types
export interface RegisterUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantName: string;
  role: string;
  parentUserId?: string;
  tenantId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    permissions: string[];
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UserProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  role: string;
  permissions: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

// User Management Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  tenantId?: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  tenantId?: string;
  role?: string;
  permissions?: string[];
  status?: 'active' | 'inactive';
}

export interface AssignRoleRequest {
  role: string;
}

// Tenant Types
export interface Tenant {
  id: string;
  name: string;
  email: string;
  adminEmail?: string;
  planId: string;
  status: 'active' | 'inactive' | 'suspended';
  subscription?: {
    id: string;
    tenantId: string;
    planId: string;
    status: 'active' | 'inactive' | 'cancelled' | 'past_due';
    currentPeriodEnd: string;
    stripeSubscriptionId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantRequest {
  name: string;
  email: string;
  adminEmail: string;
  adminPassword: string;
  adminFirstName: string;
  adminLastName: string;
  planId: string;
}

export interface UpdateTenantRequest {
  id: string;
  name?: string;
  email?: string;
  planId?: string;
  status?: 'active' | 'inactive' | 'suspended';
  subscription?: {
    id: string;
    tenantId: string;
    planId: string;
    status: 'active' | 'inactive' | 'cancelled' | 'past_due';
    currentPeriodEnd: string;
    stripeSubscriptionId?: string;
  };
}

// Integration Types
export interface Integration {
  id: string;
  tenantId: string;
  provider: string;
  credentials: {
    accountSid?: string;
    authToken?: string;
    authId?: string;
    apiKey?: string;
    [key: string]: any;
  };
  status: 'connected' | 'disconnected' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface CreateIntegrationRequest {
  tenantId: string;
  provider: string;
  credentials: {
    accountSid?: string;
    authToken?: string;
    authId?: string;
    apiKey?: string;
    [key: string]: any;
  };
}

export interface UpdateIntegrationRequest {
  id: string;
  tenantId: string;
  provider: string;
  credentials: {
    accountSid?: string;
    authToken?: string;
    authId?: string;
    apiKey?: string;
    [key: string]: any;
  };
}

export interface TwilioIntegrationRequest {
  accountSid: string;
  authToken: string;
}

// Billing Types
export interface BillingInfo {
  id: string;
  tenantId: string;
  plan: string;
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  usage: Record<string, any>;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodEnd: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionRequest {
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodEnd: string;
}

export interface UpdateSubscriptionRequest {
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete';
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  dueDate: string;
  createdAt: string;
}

// File Types
export interface FileUpload {
  id?: string;
  filename: string;
  originalName: string;
  mimeType?: string;
  size: number;
  fileUrl: string;
  uploadedAt: string;
  tenantId?: string;
}

export interface FileUploadResponse {
  filename: string;
  originalName: string;
  size: number;
  fileUrl: string;
  uploadedAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalAgents: number;
  totalCalls: number;
  totalMessages: number;
  activeIntegrations: number;
}

export interface DashboardOverview {
  totalUsers: number;
  totalTenants: number;
  totalIntegrations: number;
  recentActivity: ActivityLog[];
  systemHealth: {
    mongodb: string;
    redis: string;
    status: string;
  };
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  churnRate: number;
}

// Twilio Call Types
export interface MakeTwilioCallRequest {
  assistantId: string;
  twilioPhoneId: string;
  contactPhoneNumber: string;
}

export interface MakeTwilioCallResponse {
  success: boolean;
  callId?: string;
  message?: string;
}

export interface CallLogWithTranscript {
  id: string;
  phoneNumber: string;
  callId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: string;
  transcript?: TranscriptMessage[];
  metadata?: any;
}

export interface TranscriptMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: number;
}

export interface ActivityLog {
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  metadata: Record<string, any>;
}

export interface RecentActivityResponse {
  activities: ActivityLog[];
}

export interface SystemHealth {
  mongodb: string;
  redis: string;
  status: string;
}

export interface DashboardMetrics {
  callVolume: Array<{ date: string; count: number }>;
  userGrowth: Array<{ date: string; count: number }>;
  agentPerformance: Array<{ agentId: string; name: string; callCount: number; avgDuration: number }>;
}

// Webhook Types
export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret?: string;
  createdAt: string;
}

export interface CreateWebhookRequest {
  url: string;
  events: string[];
  secret?: string;
}

export interface StripeWebhookEvent {
  id: string;
  object: 'event';
  type: string;
  data: {
    object: any;
  };
  created?: number;
  livemode?: boolean;
  pending_webhooks?: number;
  request?: {
    id: string;
    idempotency_key?: string;
  };
}

export interface StripeWebhookRequest {
  id: string;
  object: string;
  type: string;
  data: {
    object: {
      customer?: string;
      amount_paid?: number;
      [key: string]: any;
    };
  };
}

// Audit Types
export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  resource: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface GetAuditLogsParams {
  tenantId: string;
  userId?: string;
  limit?: number;
  skip?: number;
}

export interface GetUserActivityParams {
  userId: string;
  tenantId: string;
  days?: number;
}

// Job Types
export interface Job {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  data: Record<string, any>;
  result?: Record<string, any>;
  error?: string;
  tenantId?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetJobsParams {
  tenantId?: string;
  status?: string;
}

// Health Types
export interface HealthStatus {
  mongodb: string;
  redis: string;
  status: string;
}

export interface ReadinessCheck {
  ready: boolean;
}

export interface SystemMetrics {
  mongodb: {
    connected: boolean;
  };
  redis: {
    connected: boolean;
  };
  uptime: number;
  memoryUsage: {
    rss: number;
    heapUsed: number;
  };
}

// Contact Types
export interface ContactPhoneNumber {
  countryCode: string;
  phoneNumber: string;
  label: string;
}

export interface ContactEmail {
  email: string;
  label: string;
}

// Logs types
export interface ApiLog {
  id: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: string;
  timestamp: string;
  userAgent: string;
  ipAddress: string;
  requestSize: string;
  responseSize: string;
}

export interface CallLog {
  id: string;
  phoneNumber: string;
  agent: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'failed' | 'ongoing';
  duration: string;
  timestamp: string;
  outcome: string;
  location: string;
}

export interface LogsListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Contact {
  id: string;
  profileImage?: string;
  name: string;
  title?: string;
  company?: string;
  address?: string;
  pincode?: string;
  birthday?: string;
  notes?: string;
  phoneNumbers?: ContactPhoneNumber[];
  emails?: ContactEmail[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  profileImage?: string;
  name: string;
  title?: string;
  company?: string;
  address?: string;
  pincode?: string;
  birthday?: string;
  notes?: string;
  phoneNumbers?: ContactPhoneNumber[];
  emails?: ContactEmail[];
  tags?: string;
}

export interface UpdateContactRequest {
  profileImage?: string;
  name?: string;
  title?: string;
  company?: string;
  address?: string;
  pincode?: string;
  birthday?: string;
  notes?: string;
  phoneNumbers?: ContactPhoneNumber[];
  emails?: ContactEmail[];
}

export interface BulkCreateContactsRequest {
  contacts: CreateContactRequest[];
}

export interface BulkImportPincodeRequest {
  pincodes: number[];
}

export interface ContactListResponse {
  success: boolean;
  data: Contact[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContactDetailsResponse {
  success: boolean;
  data: Contact;
  message?: string;
}

// Phone Number Types
export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  label: string;
  twilioSid?: string;
  subAccountId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ImportPhoneNumberRequest {
  twilioPhoneNumber: string;
  twilioSid: string;
  twilioAuthToken: string;
  label: string;
}

export interface AvailablePhoneNumber {
  phoneNumber: string;
  region: string;
  locality: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
  price: string;
}

export interface BuyPhoneNumberRequest {
  phoneNumber: string;
  label: string;
  subAccountId: string;
}

// Workflow Types
export interface WorkflowNode {
  name: string;
  type: string;
  isStart?: boolean;
  prompt?: string;
  voice?: {
    model: string;
    voiceId: string;
    provider: string;
  };
  globalNodePlan?: {
    enabled: boolean;
  };
  variableExtractionPlan?: {
    output: Array<{
      title: string;
      type: string;
    }>;
  };
  metadata?: {
    position: {
      x: number;
      y: number;
    };
  };
}

export interface WorkflowEdge {
  from: string;
  to: string;
  condition?: {
    type: string;
    prompt: string;
  };
}

export interface KingCallerWorkflow {
  id?: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status?: 'active' | 'inactive' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWorkflowRequest {
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface UpdateWorkflowRequest {
  name?: string;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
}

export interface WorkflowListResponse {
  success: boolean;
  data: KingCallerWorkflow[];
  message?: string;
}

export interface WorkflowDetailsResponse {
  success: boolean;
  data: KingCallerWorkflow;
  message?: string;
}

// Bolna API Types
export interface BolnaAgentConfig {
  agent_name: string;
  agent_type: string;
  agent_welcome_message: string;
  tasks: BolnaTask[];
}

export interface BolnaTask {
  task_type: string;
  toolchain: {
    execution: string;
    pipelines: string[][];
  };
  tools_config: {
    input: {
      format: string;
      provider: string;
    };
    llm_agent: {
      agent_type: string;
      agent_flow_type: string;
      llm_config: {
        provider: string;
        request_json: boolean;
        model: string;
      };
    };
    output: {
      format: string;
      provider: string;
    };
    synthesizer: {
      audio_format: string;
      provider: string;
      stream: boolean;
      provider_config: {
        voice: string;
        model: string;
        voice_id: string;
      };
      buffer_size: number;
    };
    transcriber: {
      encoding: string;
      language: string;
      provider: string;
      stream: boolean;
    };
  };
  task_config: {
    hangup_after_silence: number;
  };
}

export interface BolnaAgentPrompts {
  [key: string]: {
    system_prompt: string;
  };
}

export interface CreateBolnaAgentRequest {
  agent_config: BolnaAgentConfig;
  agent_prompts: BolnaAgentPrompts;
}

export interface BolnaAgent {
  id: string;
  agent_config: BolnaAgentConfig;
  agent_prompts: BolnaAgentPrompts;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateBolnaAgentRequest {
  agent_config?: BolnaAgentConfig;
  agent_prompts?: BolnaAgentPrompts;
}

export interface PatchAgentSettingsRequest {
  interruptionSensitivity?: number;
  enableBackchannel?: boolean;
  normalizeForSpeech?: boolean;
  vocabSpecialization?: string;
  reminderTriggerMs?: number;
  reminderMaxCount?: number;
  backchannelWords?: string[];
}

export interface CreateLLMThreadRequest {
  thread_name: string;
  llm_id: string;
  version: number;
}

export interface PlaygroundCompletionRequest {
  transcript: any[];
  dynamic_variables: {
    session_type: string;
    call_type: string;
    [key: string]: any;
  };
  tool_mocks: any[];
  current_node_id: string;
  current_state: string;
  call_ended: boolean;
}

export interface BolnaAgentListResponse {
  success: boolean;
  data: BolnaAgent[];
  message?: string;
}

export interface BolnaAgentDetailsResponse {
  success: boolean;
  data: BolnaAgent;
  message?: string;
}

// Generic API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
