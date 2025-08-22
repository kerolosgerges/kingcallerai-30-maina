
export type SubAccountRole = 
  | 'owner'           // Sub-account owner
  | 'admin'           // Sub-account admin
  | 'manager'         // Team manager
  | 'user'            // Regular user
  | 'viewer';         // Read-only access

export type AgencyRole = 
  | 'agency_admin'    // Agency super admin
  | 'agency_user';    // Agency user

export interface SubAccount {
  id: string;
  name: string;
  slug: string;
  description?: string;
  agencyId?: string;
  companyAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  companyPhone?: string;
  settings: {
    timezone: string;
    currency: string;
    language: string;
    branding?: {
      logo?: string;
      primaryColor?: string;
      secondaryColor?: string;
    };
  };
  subscription: {
    tier: 'free' | 'starter' | 'professional' | 'enterprise';
    maxUsers: number;
    maxAssistants: number;
    maxContacts: number;
    features: string[];
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isActive: boolean;
}

// Optimized user role structure
export interface UserSubAccountRole {
  id: string;
  userId: string;
  subAccountId: string;
  role: SubAccountRole;
  permissions: string[];
  assignedBy: string;
  assignedAt: string;
  isActive: boolean;
}

// Extended interface for UI components that need both sub-account and role data
export interface SubAccountWithRole extends SubAccount {
  userRole: SubAccountRole;
}

// Optimized agency admin structure
export interface AgencyAdmin {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  agencyId: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

// Enhanced user profile with denormalized access data
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  agencyRole?: {
    agencyId: string;
    permissions: string[];
  };
  subAccountRoles: Array<{
    subAccountId: string;
    role: SubAccountRole;
    permissions: string[];
  }>;
  defaultSubAccountId?: string;
  lastActiveSubAccountId?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

// Cached permissions for fast lookups
export interface UserPermissions {
  id: string;
  userId: string;
  agencies: Record<string, string[]>;
  subAccounts: Record<string, {
    role: SubAccountRole;
    permissions: string[];
  }>;
  lastUpdated: string;
}

// Composite indexes for efficient queries
export interface AgencyMember {
  id: string;
  userId: string;
  agencyId: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  joinedAt: string;
}

export interface SubAccountMember {
  id: string;
  userId: string;
  subAccountId: string;
  role: SubAccountRole;
  permissions: string[];
  isActive: boolean;
  joinedAt: string;
}

export interface AuditLog {
  id: string;
  subAccountId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface Assistant {
  id: string;
  subAccountId: string;
  name: string;
  description: string;
  prompt: string;
  voice: string;
  settings: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface Contact {
  id: string;
  subAccountId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface PhoneNumber {
  id: string;
  subAccountId: string;
  number: string;
  carrier: string;
  type: 'local' | 'toll-free';
  assignedAssistantId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assignedBy: string;
}
