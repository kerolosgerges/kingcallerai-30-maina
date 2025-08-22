import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';

import Workflows from '@/pages/workflows/Workflows';
import WorkflowEditor from '@/pages/workflows/WorkflowEditor';
import WorkflowPreview from '@/components/workflows/WorkflowPreview';
import VoiceLibrary from '@/pages/VoiceLibrary';
import Templates from '@/pages/Templates';
import TemplateEditor from '@/pages/TemplateEditor';

import Contacts from '@/pages/Contacts';
import Conversations from '@/pages/Conversations';
import Tools from '@/pages/Tools';
import Analytics from '@/pages/Analytics';
import Knowledge from '@/pages/Knowledge';
import AIHelper from '@/pages/AIHelper';
import FilesPage from '@/pages/files/FilesPage';
import LaunchPad from '@/pages/LaunchPad';
import WorkflowLogs from '@/pages/workflows/WorkflowLogs';
import CallLogs from '@/pages/CallLogs';
import ApiLogs from '@/pages/ApiLogs';
import WebhookLogs from '@/pages/WebhookLogs';
import Agents from '@/pages/agents/Agents';
import { AgentBuilder } from '@/components/AgentBuilder';
import { Outlet } from 'react-router-dom';

// Import individual settings pages
import ProfileSettings from '@/pages/settings/ProfileSettings';
import NotificationsSettings from '@/pages/settings/NotificationsSettings';
import TeamSettings from '@/pages/settings/TeamSettings';
import PlansSettings from '@/pages/settings/PlansSettings';
import BillingSettings from '@/pages/settings/BillingSettings';
import IntegrationsSettings from '@/pages/settings/IntegrationsSettings';
import PhoneNumbersSettings from '@/pages/settings/PhoneNumbersSettings';
import PhoneRegistrationSettings from '@/pages/settings/PhoneRegistrationSettings';
import SecuritySettings from '@/pages/settings/SecuritySettings';

export const getSubAccountRoutes = () => [
  
  // Full screen AgentBuilder routes (without Layout) - MUST COME FIRST
  <Route
    key="agent-builder-routes"
    path="/:subAccountId/agents"
    element={<ProtectedRoute><Outlet /></ProtectedRoute>}
  >
    <Route index element={
      <Layout>
        <Agents />
      </Layout>
    } />
    <Route path="new" element={<AgentBuilder />} />
    <Route path=":agentId" element={<AgentBuilder />} />
    <Route path=":agentId/edit" element={<AgentBuilder />} />
  </Route>,
  
  // Full screen WorkflowEditor routes (without Layout)
  <Route
    key="workflow-editor-routes"
    path="/:subAccountId/workflows"
    element={<ProtectedRoute><Outlet /></ProtectedRoute>}
  >
    <Route index element={
      <Layout>
        <Workflows />
      </Layout>
    } />
    <Route path="dashboard" element={
      <Layout>
        <Workflows />
      </Layout>
    } />
    <Route path=":workflowId" element={<WorkflowEditor />} />
    <Route path=":workflowId/edit" element={<WorkflowEditor />} />
    <Route path=":workflowId/preview" element={<WorkflowPreview />} />
  </Route>,
  
  // Sub-account specific routes (with subAccountId parameter) - AFTER NESTED ROUTES
  <Route
    key="subaccount-layout"
    path="/:subAccountId"
    element={
      <ProtectedRoute>
        <Layout>
          <Outlet />
        </Layout>
      </ProtectedRoute>
    }
  >
    {/* Dashboard */}
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    
    {/* LaunchPad */}
    <Route path="launchpad" element={<LaunchPad />} />
    
    {/* Settings - Nested routes */}
    <Route path="settings" element={<Settings />} />
    <Route path="settings/profile" element={<ProfileSettings />} />
    <Route path="settings/notifications" element={<NotificationsSettings />} />
    <Route path="settings/team" element={<TeamSettings />} />
    <Route path="settings/plans" element={<PlansSettings />} />
    <Route path="settings/billing" element={<BillingSettings />} />
    <Route path="settings/integrations" element={<IntegrationsSettings />} />
    <Route path="settings/phone-numbers" element={<PhoneNumbersSettings />} />
    <Route path="settings/phone-registration" element={<PhoneRegistrationSettings />} />
    <Route path="settings/security" element={<SecuritySettings />} />
    
    
    {/* Contacts */}
    <Route path="contacts" element={<Contacts />} />
    
    {/* Conversations */}
    <Route path="conversations" element={<Conversations />} />
    <Route path="conversations/:contactId" element={<Conversations />} />
    <Route path="conversations/:contactId/view" element={<Conversations />} />
    
    
    
    
    {/* Tools */}
    <Route path="tools" element={<Tools />} />
    
    {/* Analytics */}
    <Route path="analytics" element={<Analytics />} />
    
    {/* Knowledge */}
    <Route path="knowledge" element={<Knowledge />} />
    
    {/* AI Helper */}
    <Route path="ai-helper" element={<AIHelper />} />
    
    {/* File Manager */}
    <Route path="files" element={<FilesPage />} />
    
    {/* Voice Library */}
    <Route path="voices" element={<VoiceLibrary />} />
    
    {/* Log Pages */}
    <Route path="webhook-logs" element={<WebhookLogs />} />
    <Route path="workflow-logs" element={<WorkflowLogs />} />
    <Route path="call-logs" element={<CallLogs />} />
    <Route path="api-logs" element={<ApiLogs />} />
    
  </Route>,
  
  
];
