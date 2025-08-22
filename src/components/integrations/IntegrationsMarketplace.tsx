import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, ExternalLink, Settings } from 'lucide-react';
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
  handleConnect: (integration: IntegrationType) => void;
  handleConfigure: (integration: IntegrationType) => void;
  getIntegrationUrl: (integration: IntegrationType) => string | undefined;
  getOAuthUrl: (integration: IntegrationType, action: "connect" | "configure") => string | undefined;
}

const IntegrationsMarketplace: React.FC<Props> = ({
  integrations,
  handleConnect,
  handleConfigure,
  getIntegrationUrl,
  getOAuthUrl,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requestIntegrationLoading, setRequestIntegrationLoading] = useState(false);

  const [oauthDialogOpen, setOAuthDialogOpen] = useState(false);
  const [oauthIntegration, setOAuthIntegration] = useState<IntegrationType | null>(null);
  const [oauthAction, setOAuthAction] = useState<"connect" | "configure">("connect");

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequestIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestIntegrationLoading(true);
    setTimeout(() => {
      setRequestIntegrationLoading(false);
      toast({
        title: "Thank you!",
        description: "Your integration request has been submitted.",
      });
    }, 1200);
  };

  // Start OAuth redirect
  const handleMarketplaceOAuth = (integration: IntegrationType, action: "connect" | "configure") => {
    const url = getOAuthUrl(integration, action);
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
    <>
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Request Integration
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request New Integration</DialogTitle>
              <DialogDescription>
                Don't see the integration you need? Let us know and we'll consider adding it.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 py-4" onSubmit={handleRequestIntegration}>
              <div>
                <Label htmlFor="service-name">Service Name</Label>
                <Input id="service-name" name="service-name" placeholder="e.g., Microsoft Teams" required />
              </div>
              <div>
                <Label htmlFor="use-case">Use Case</Label>
                <Input id="use-case" name="use-case" placeholder="Describe how you'd use this integration" required />
              </div>
              <Button className="w-full" type="submit" disabled={requestIntegrationLoading}>
                {requestIntegrationLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="relative">
            {integration.popular && (
              <Badge className="absolute top-2 right-2 bg-blue-500">Popular</Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 flex items-center justify-center w-12 h-12">
                  <img 
                    src={integration.logo} 
                    alt={integration.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {integration.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {integration.description}
              </CardDescription>
              <div className="flex gap-2">
                {integration.status === 'connected' ? (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleMarketplaceOAuth(integration, "configure")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                ) : (
                  <Button 
                    className="flex-1"
                    onClick={() => handleMarketplaceOAuth(integration, "connect")}
                  >
                    Connect
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const url = getIntegrationUrl(integration);
                    if (url) {
                      window.open(url, "_blank", "noopener,noreferrer");
                    } else {
                      toast({
                        title: "Link unavailable",
                        description: "No external link defined for this integration.",
                      });
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default IntegrationsMarketplace;
