
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

interface ToolAdvancedSectionsProps {
  toolType: string;
  config: any;
  onChange: (config: any) => void;
}

export const ToolAdvancedSections = ({ toolType, config, onChange }: ToolAdvancedSectionsProps) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateConfig = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const renderTransferCallSection = () => {
    const destinations = config.destinations || [];
    
    const addDestination = () => {
      updateConfig('destinations', [...destinations, '']);
    };
    
    const updateDestination = (index: number, value: string) => {
      const updated = [...destinations];
      updated[index] = value;
      updateConfig('destinations', updated);
    };
    
    const removeDestination = (index: number) => {
      const updated = destinations.filter((_: any, i: number) => i !== index);
      updateConfig('destinations', updated);
    };

    return (
      <Collapsible 
        open={openSections.destinations} 
        onOpenChange={() => toggleSection('destinations')}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <span className="font-medium">Destinations</span>
            {openSections.destinations ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Add pre-defined phone numbers for quick transfer
          </p>
          
          {destinations.map((dest: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={dest}
                onChange={(e) => updateDestination(index, e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeDestination(index)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button variant="outline" onClick={addDestination} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Destination
          </Button>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderQueryToolSection = () => {
    const knowledgeBases = config.knowledgeBases || [];
    const messages = config.messages || {};

    return (
      <>
        <Collapsible 
          open={openSections.knowledgeBases} 
          onOpenChange={() => toggleSection('knowledgeBases')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-4 h-auto">
              <span className="font-medium">Knowledge Bases</span>
              {openSections.knowledgeBases ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Select knowledge bases to query
            </p>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select knowledge bases..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales-kb">Sales Knowledge Base</SelectItem>
                <SelectItem value="support-kb">Support Knowledge Base</SelectItem>
                <SelectItem value="product-kb">Product Knowledge Base</SelectItem>
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible 
          open={openSections.messages} 
          onOpenChange={() => toggleSection('messages')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-4 h-auto">
              <span className="font-medium">Messages</span>
              {openSections.messages ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 space-y-4">
            <div>
              <Label>Intro Message</Label>
              <Textarea
                value={messages.intro || ''}
                onChange={(e) => updateConfig('messages', { ...messages, intro: e.target.value })}
                placeholder="Let me check that for you..."
              />
            </div>
            <div>
              <Label>After Answer Message</Label>
              <Textarea
                value={messages.afterAnswer || ''}
                onChange={(e) => updateConfig('messages', { ...messages, afterAnswer: e.target.value })}
                placeholder="Is there anything else I can help with?"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </>
    );
  };

  const renderApiRequestSection = () => {
    const api = config.api || {};
    const headers = api.headers || {};

    return (
      <Collapsible 
        open={openSections.api} 
        onOpenChange={() => toggleSection('api')}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <span className="font-medium">API Configuration</span>
            {openSections.api ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 space-y-4">
          <div>
            <Label>API URL</Label>
            <Input
              value={api.url || ''}
              onChange={(e) => updateConfig('api', { ...api, url: e.target.value })}
              placeholder="https://api.example.com/endpoint"
            />
          </div>
          
          <div>
            <Label>Method</Label>
            <Select 
              value={api.method || 'GET'}
              onValueChange={(value) => updateConfig('api', { ...api, method: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Headers</Label>
            <Textarea
              value={JSON.stringify(headers, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  updateConfig('api', { ...api, headers: parsed });
                } catch (error) {
                  // Invalid JSON
                }
              }}
              placeholder='{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'
              className="font-mono"
            />
          </div>
          
          {(api.method === 'POST' || api.method === 'PUT') && (
            <div>
              <Label>Body</Label>
              <Textarea
                value={JSON.stringify(api.body || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateConfig('api', { ...api, body: parsed });
                  } catch (error) {
                    // Invalid JSON
                  }
                }}
                placeholder='{\n  "key": "value"\n}'
                className="font-mono"
              />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderDtmfSection = () => {
    return (
      <Collapsible 
        open={openSections.dtmf} 
        onOpenChange={() => toggleSection('dtmf')}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <span className="font-medium">DTMF Configuration</span>
            {openSections.dtmf ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 space-y-3">
          <div>
            <Label>Digits to Send</Label>
            <Input
              value={config.digits || ''}
              onChange={(e) => updateConfig('digits', e.target.value)}
              placeholder="123#"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Allowed characters: 0-9, *, #
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderSendTextSection = () => {
    return (
      <Collapsible 
        open={openSections.sms} 
        onOpenChange={() => toggleSection('sms')}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <span className="font-medium">SMS Configuration</span>
            {openSections.sms ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 space-y-4">
          <div>
            <Label>Message Template</Label>
            <Textarea
              value={config.messageTemplate || ''}
              onChange={(e) => updateConfig('messageTemplate', e.target.value)}
              placeholder="Thank you for your call! We'll follow up soon."
              rows={3}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // Determine which sections to show based on tool type
  const getAdvancedSections = () => {
    switch (toolType) {
      case 'Transfer Call':
        return [renderTransferCallSection()];
      case 'Query':
        return [renderQueryToolSection()];
      case 'API Request':
        return [renderApiRequestSection()];
      case 'DTMF':
        return [renderDtmfSection()];
      case 'Send Text':
        return [renderSendTextSection()];
      default:
        return [];
    }
  };

  const sections = getAdvancedSections();

  if (sections.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Configuration</CardTitle>
        <CardDescription>
          Configure tool-specific options and settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {sections}
      </CardContent>
    </Card>
  );
};
