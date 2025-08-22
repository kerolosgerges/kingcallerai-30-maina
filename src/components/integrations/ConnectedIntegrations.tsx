import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

type IntegrationType = {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  status: string;
  popular: boolean;
};

interface Props {
  integrations: IntegrationType[];
  handleConfigure: (integration: IntegrationType) => void;
  getOAuthUrl: (integration: IntegrationType, action: "connect" | "configure") => string | undefined;
}

const ConnectedIntegrations: React.FC<Props> = ({
  integrations,
  handleConfigure,
  getOAuthUrl,
}) => {
  const handleSettingsClick = (integration: IntegrationType) => {
    const url = getOAuthUrl(integration, "configure");
    if (url) {
      window.location.href = url;
    } else {
      toast({
        title: "OAuth URL not defined",
        description: "No backend OAuth endpoint is set up for this integration.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Integrations</CardTitle>
        <CardDescription>Manage your active integrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.filter(i => i.status === 'connected').map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <img 
                  src={integration.logo} 
                  alt={integration.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <div className="font-medium">{integration.name}</div>
                  <div className="text-sm text-gray-500">Connected</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked disabled />
                <button 
                  onClick={() => handleSettingsClick(integration)}
                >
                  Settings
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedIntegrations;
