import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import IntegrationsMarketplace from '@/components/integrations/IntegrationsMarketplace';
import ConnectedIntegrations from '@/components/integrations/ConnectedIntegrations';
import WebhooksTab from '@/components/integrations/WebhooksTab';
import ApiKeysTab from '@/components/integrations/ApiKeysTab';
import { toast } from '@/hooks/use-toast';

const DEFAULT_INTEGRATIONS = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Sync customer data and lead information',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    category: 'CRM',
    status: 'connected',
    popular: true
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Customer relationship management',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg',
    category: 'CRM',
    status: 'available',
    popular: true
  },
  {
    id: 'gohighlevel',
    name: 'GoHighLevel',
    description: 'All-in-one marketing and sales platform',
    logo: 'https://cdn.gohighlevel.com/images/ghl-logo.svg',
    category: 'CRM',
    status: 'available',
    popular: true
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and billing',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    category: 'Payment',
    status: 'available',
    popular: true
  },
  {
    id: 'twillio',
    name: 'Twilio',
    description: 'SMS and voice communications',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Twilio-logo-red.svg',
    category: 'Communication',
    status: 'connected',
    popular: false
  },
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Workflow automation for technical teams',
    logo: 'https://n8n.io/favicon.svg',
    category: 'Automation',
    status: 'available',
    popular: true
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Email integration and automation',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
    category: 'Email',
    status: 'available',
    popular: true
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    description: 'Schedule meetings and appointments',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
    category: 'Productivity',
    status: 'available',
    popular: false
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and notifications',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    category: 'Communication',
    status: 'available',
    popular: false
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 5000+ apps with automation',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Zapier_logo.svg',
    category: 'Automation',
    status: 'available',
    popular: true
  }
];

const DEFAULT_WEBHOOKS = [
  { id: 1, name: 'Lead Notification', url: 'https://api.example.com/leads', status: 'active' },
  { id: 2, name: 'Call Completed', url: 'https://api.example.com/calls', status: 'active' },
  { id: 3, name: 'Agent Failed', url: 'https://api.example.com/errors', status: 'inactive' },
];

const Integrations = () => {
  const [integrations, setIntegrations] = useState(DEFAULT_INTEGRATIONS);
  const [webhooks, setWebhooks] = useState(DEFAULT_WEBHOOKS);

  // Handlers for connect/configure are now no-ops, as OAuth will redirect
  const handleConnect = (integration: any) => { /* no-op, handled in marketplace */ };
  const handleConfigure = (integration: any) => { /* no-op, handled in connected tab */ };

  // Utility for external link
  const getIntegrationUrl = (integration: any) => {
    switch (integration.id) {
      case 'salesforce': return 'https://salesforce.com';
      case 'hubspot': return 'https://hubspot.com';
      case 'gohighlevel': return 'https://gohighlevel.com';
      case 'stripe': return 'https://stripe.com';
      case 'twillio': return 'https://twilio.com';
      case 'n8n': return 'https://n8n.io';
      case 'gmail': return 'https://mail.google.com/';
      case 'calendar': return 'https://calendar.google.com/';
      case 'slack': return 'https://slack.com/';
      case 'zapier': return 'https://zapier.com/';
      default: return undefined;
    }
  };

  // New: get OAuth backend URL for starting flow
  const getOAuthUrl = (integration: any, action: "connect" | "configure") => {
    switch (integration.id) {
      case 'salesforce':
        return `https://your-backend.com/oauth/salesforce?type=${action}`;
      case 'hubspot':
        return `https://your-backend.com/oauth/hubspot?type=${action}`;
      case 'gohighlevel':
        return `https://your-backend.com/oauth/gohighlevel?type=${action}`;
      case 'stripe':
        return `https://your-backend.com/oauth/stripe?type=${action}`;
      case 'gmail':
        return `https://your-backend.com/oauth/gmail?type=${action}`;
      case 'calendar':
        return `https://your-backend.com/oauth/calendar?type=${action}`;
      case 'slack':
        return `https://your-backend.com/oauth/slack?type=${action}`;
      // etc...
      default:
        return undefined;
    }
  };

  // OAuth success feedback: look for ?oauthSuccess=...
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("oauthSuccess")) {
        toast({
          title: "Integration Connected",
          description: "OAuth connection completed successfully.",
        });
        // Optionally remove query param for cleanliness
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integration Hub</h1>
        <p className="text-gray-600">Connect your AI agents with external services and tools</p>
      </div>
      <Tabs defaultValue="marketplace" className="space-y-6">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          <IntegrationsMarketplace
            integrations={integrations}
            handleConnect={handleConnect}
            handleConfigure={handleConfigure}
            getIntegrationUrl={getIntegrationUrl}
            getOAuthUrl={getOAuthUrl}
          />
        </TabsContent>
        <TabsContent value="connected" className="space-y-6">
          <ConnectedIntegrations
            integrations={integrations}
            handleConfigure={handleConfigure}
            getOAuthUrl={getOAuthUrl}
          />
        </TabsContent>
        <TabsContent value="webhooks" className="space-y-6">
          <WebhooksTab webhooks={webhooks} />
        </TabsContent>
        <TabsContent value="api" className="space-y-6">
          <ApiKeysTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integrations;
