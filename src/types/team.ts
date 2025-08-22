
export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'tester' | 'support' | 'agents';
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  joinedAt: Date;
  lastActiveAt?: Date;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  settings: TeamSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamSettings {
  allowMemberInvites: boolean;
  defaultMemberRole: 'editor' | 'tester' | 'support' | 'agents';
  requireApprovalForJoining: boolean;
  maxMembers: number;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: 'admin' | 'editor' | 'tester' | 'support' | 'agents';
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

export type Permission = 
  | 'all'
  | 'manage_team'
  | 'manage_agents'
  | 'manage_workflows'
  | 'view_analytics'
  | 'create_agents'
  | 'edit_agents'
  | 'create_workflows'
  | 'edit_workflows'
  | 'view_agents'
  | 'view_workflows'
  | 'test_agents'
  | 'support_access'
  | 'agent_operations';

export const ROLE_PERMISSIONS: Record<TeamMember['role'], Permission[]> = {
  owner: ['all'],
  admin: ['manage_team', 'manage_agents', 'manage_workflows', 'view_analytics', 'create_agents', 'edit_agents'],
  editor: ['create_agents', 'edit_agents', 'create_workflows', 'edit_workflows', 'view_agents', 'view_workflows'],
  tester: ['test_agents', 'view_agents', 'view_workflows'],
  support: ['support_access', 'view_agents', 'view_analytics'],
  agents: ['agent_operations', 'view_agents']
} as const;
