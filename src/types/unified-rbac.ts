
// Enhanced Unified RBAC Type Definitions with Future Extensibility
export type AgencyRole = 'agency_admin' | 'agency_user' | 'agency_manager' | 'agency_viewer';
export type SubAccountRole = 'owner' | 'admin' | 'manager' | 'user' | 'viewer' | 'guest';

// Comprehensive resource types for scalability
export type ResourceType = 
  | 'agency' 
  | 'subAccount' 
  | 'user' 
  | 'assistant' 
  | 'contact' 
  | 'campaign' 
  | 'workflow' 
  | 'tool' 
  | 'knowledge' 
  | 'phoneNumber' 
  | 'billing' 
  | 'settings' 
  | 'analytics' 
  | 'audit'
  | 'integration'
  | 'webhook'
  | 'api'
  | 'template'
  | 'report'
  | 'notification'
  | 'file'
  | 'media'
  | 'backup'
  | 'export'
  | 'import';

export type ActionType = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'execute' | 'share' | 'export' | 'import';

export interface Permission {
  resource: ResourceType;
  action: ActionType;
  conditions?: PermissionCondition[];
  scope?: 'own' | 'team' | 'all';
}

export interface PermissionCondition {
  field: string;
  operator: 'eq' | 'ne' | 'in' | 'nin' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';
  value: any;
}

export interface UnifiedUserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  timezone?: string;
  language?: string;
  agencyRole?: {
    agencyId: string;
    role: AgencyRole;
    permissions: Permission[];
    assignedAt: string;
    assignedBy: string;
    expiresAt?: string;
    isActive: boolean;
  };
  subAccountRoles: {
    subAccountId: string;
    role: SubAccountRole;
    permissions: Permission[];
    assignedAt: string;
    assignedBy: string;
    expiresAt?: string;
    isActive: boolean;
    metadata?: Record<string, any>;
  }[];
  customPermissions: ResourcePermission[];
  defaultSubAccountId?: string;
  lastActiveSubAccountId?: string;
  preferences: UserPreferences;
  security: SecuritySettings;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  version: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  dashboard: DashboardSettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  slack: boolean;
  discord: boolean;
  categories: {
    system: boolean;
    campaigns: boolean;
    workflows: boolean;
    billing: boolean;
    security: boolean;
  };
}

export interface DashboardSettings {
  layout: 'grid' | 'list';
  defaultView: string;
  widgetOrder: string[];
  hiddenWidgets: string[];
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
  deviceTracking: boolean;
  lastPasswordChange?: string;
  failedLoginAttempts: number;
  lockedUntil?: string;
}

export interface SubAccountInvitation {
  id: string;
  email: string;
  role: SubAccountRole;
  permissions?: Permission[];
  subAccountId: string;
  subAccountName: string;
  invitedBy: string;
  inviterName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
  token: string;
  metadata?: Record<string, any>;
  expiresAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  reminders: InvitationReminder[];
}

export interface InvitationReminder {
  sentAt: string;
  type: 'initial' | 'reminder' | 'final';
  method: 'email' | 'sms';
}

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  context: 'agency' | 'subAccount' | 'global';
  category: string;
  permissions: Permission[];
  isSystem: boolean;
  isCustomizable: boolean;
  tags: string[];
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourcePermission {
  id: string;
  userId: string;
  resourceType: ResourceType;
  resourceId: string;
  actions: ActionType[];
  conditions?: PermissionCondition[];
  scope: 'own' | 'team' | 'all';
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
  reason?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface RoleHierarchy {
  role: AgencyRole | SubAccountRole;
  inheritsFrom?: (AgencyRole | SubAccountRole)[];
  level: number;
  canDelegate: boolean;
  maxDelegationLevel?: number;
}

export interface PermissionAuditLog {
  id: string;
  userId: string;
  targetUserId?: string;
  actorId: string;
  action: 'grant' | 'revoke' | 'update' | 'inherit' | 'delegate';
  resourceType: ResourceType;
  resourceId?: string;
  oldPermissions?: Permission[];
  newPermissions?: Permission[];
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  timestamp: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface PermissionPolicy {
  id: string;
  name: string;
  description: string;
  rules: PermissionRule[];
  priority: number;
  isActive: boolean;
  appliesTo: {
    roles: (AgencyRole | SubAccountRole)[];
    users?: string[];
    conditions?: PermissionCondition[];
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionRule {
  id: string;
  type: 'allow' | 'deny' | 'require';
  resource: ResourceType;
  actions: ActionType[];
  conditions?: PermissionCondition[];
  priority: number;
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  location?: LocationInfo;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  fingerprint: string;
}

export interface LocationInfo {
  country: string;
  region: string;
  city: string;
  ip: string;
}

// Enhanced permission checking utilities
export interface PermissionContext {
  userId: string;
  agencyId?: string;
  subAccountId?: string;
  resourceId?: string;
  sessionInfo?: SessionInfo;
  metadata?: Record<string, any>;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  conditions?: PermissionCondition[];
  appliedPolicies: string[];
  requiredActions?: string[];
}

// Bulk operations support
export interface BulkPermissionOperation {
  operation: 'grant' | 'revoke' | 'update';
  userIds: string[];
  permissions: Permission[];
  reason?: string;
  expiresAt?: string;
}

export interface BulkPermissionResult {
  successful: string[];
  failed: { userId: string; error: string }[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// Advanced role management
export interface RoleAssignment {
  id: string;
  userId: string;
  role: AgencyRole | SubAccountRole;
  context: 'agency' | 'subAccount';
  contextId: string;
  assignedBy: string;
  assignedAt: string;
  expiresAt?: string;
  isActive: boolean;
  conditions?: PermissionCondition[];
  metadata?: Record<string, any>;
}

export interface RoleTransition {
  id: string;
  userId: string;
  fromRole: AgencyRole | SubAccountRole;
  toRole: AgencyRole | SubAccountRole;
  context: 'agency' | 'subAccount';
  contextId: string;
  triggeredBy: string;
  triggeredAt: string;
  reason: string;
  autoApprove: boolean;
  approvedBy?: string;
  approvedAt?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
}

// Integration support
export interface IntegrationPermission {
  id: string;
  integrationId: string;
  integrationType: string;
  userId: string;
  permissions: Permission[];
  scopes: string[];
  refreshToken?: string;
  expiresAt?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

// Compliance and reporting
export interface ComplianceReport {
  id: string;
  type: 'access_review' | 'permission_audit' | 'role_certification';
  period: {
    startDate: string;
    endDate: string;
  };
  scope: {
    agencyIds?: string[];
    subAccountIds?: string[];
    userIds?: string[];
  };
  findings: ComplianceFinding[];
  recommendations: string[];
  generatedBy: string;
  generatedAt: string;
  status: 'draft' | 'final' | 'reviewed';
}

export interface ComplianceFinding {
  id: string;
  type: 'violation' | 'risk' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedUsers: string[];
  recommendedAction: string;
  autoFixAvailable: boolean;
}
