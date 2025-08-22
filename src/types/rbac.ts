export type Role = 
  | 'super_admin'     // Platform super admin
  | 'admin'           // Organization admin
  | 'manager'         // Team manager
  | 'user'            // Regular user
  | 'viewer';         // Read-only access

export type Permission = 
  | 'manage_organization'
  | 'manage_team'
  | 'manage_billing'
  | 'manage_settings'
  | 'manage_integrations'
  | 'manage_phone_numbers'
  | 'manage_assistants'
  | 'manage_contacts'
  | 'manage_campaigns'
  | 'manage_workflows'
  | 'manage_tools'
  | 'manage_knowledge'
  | 'manage_analytics'
  | 'view_analytics'
  | 'create_assistants'
  | 'edit_assistants'
  | 'delete_assistants'
  | 'create_contacts'
  | 'edit_contacts'
  | 'delete_contacts'
  | 'create_campaigns'
  | 'edit_campaigns'
  | 'delete_campaigns'
  | 'create_workflows'
  | 'edit_workflows'
  | 'delete_workflows'
  | 'make_calls'
  | 'view_logs';

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  subscriptionTier: SubscriptionTier;
  maxUsers: number;
  maxAssistants: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface SubAccount {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  organizationId: string;
  subAccountId?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: Role;
  organizationId: string;
  subAccountId?: string;
  invitedBy: string;
  joinedAt: string;
  lastActiveAt?: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: Role;
  organizationId: string;
  subAccountId?: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    'manage_organization',
    'manage_team',
    'manage_billing',
    'manage_settings',
    'manage_integrations',
    'manage_phone_numbers',
    'manage_assistants',
    'manage_contacts',
    'manage_campaigns',
    'manage_workflows',
    'manage_tools',
    'manage_knowledge',
    'manage_analytics',
    'view_analytics',
    'create_assistants',
    'edit_assistants',
    'delete_assistants',
    'create_contacts',
    'edit_contacts',
    'delete_contacts',
    'create_campaigns',
    'edit_campaigns',
    'delete_campaigns',
    'create_workflows',
    'edit_workflows',
    'delete_workflows',
    'make_calls',
    'view_logs'
  ],
  admin: [
    'manage_team',
    'manage_billing',
    'manage_settings',
    'manage_integrations',
    'manage_phone_numbers',
    'manage_assistants',
    'manage_contacts',
    'manage_campaigns',
    'manage_workflows',
    'manage_tools',
    'manage_knowledge',
    'manage_analytics',
    'view_analytics',
    'create_assistants',
    'edit_assistants',
    'delete_assistants',
    'create_contacts',
    'edit_contacts',
    'delete_contacts',
    'create_campaigns',
    'edit_campaigns',
    'delete_campaigns',
    'create_workflows',
    'edit_workflows',
    'delete_workflows',
    'make_calls',
    'view_logs'
  ],
  manager: [
    'manage_assistants',
    'manage_contacts',
    'manage_campaigns',
    'manage_workflows',
    'manage_tools',
    'manage_knowledge',
    'view_analytics',
    'create_assistants',
    'edit_assistants',
    'create_contacts',
    'edit_contacts',
    'create_campaigns',
    'edit_campaigns',
    'create_workflows',
    'edit_workflows',
    'make_calls',
    'view_logs'
  ],
  user: [
    'create_assistants',
    'edit_assistants',
    'create_contacts',
    'edit_contacts',
    'create_campaigns',
    'edit_campaigns',
    'create_workflows',
    'edit_workflows',
    'make_calls',
    'view_logs'
  ],
  viewer: [
    'view_analytics',
    'view_logs'
  ]
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager', 
  user: 'User',
  viewer: 'Viewer'
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  super_admin: 'Full platform access with all permissions across organizations',
  admin: 'Organization administrator with full access to manage teams, billing, and settings',
  manager: 'Team manager with access to assistants, campaigns, workflows, and analytics',
  user: 'Regular user with access to create and edit content',
  viewer: 'Read-only access to analytics and logs'
};
