import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Save, Trash2 } from 'lucide-react';

interface NodeConfigPanelProps {
  node: any;
  onUpdate: (nodeId: string, data: any) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
}

export const NodeConfigPanel = ({ node, onUpdate, onDelete, onClose }: NodeConfigPanelProps) => {
  const [config, setConfig] = useState(node?.data || {});

  const handleSave = () => {
    onUpdate(node.id, config);
    onClose();
  };

  const handleDelete = () => {
    onDelete(node.id);
    onClose();
  };

  const renderNodeConfig = () => {
    switch (node?.data?.nodeType) {
      case 'say':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={config.message || ''}
                onChange={(e) => setConfig({ ...config, message: e.target.value })}
                placeholder="Enter the message to speak..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voice">Voice</Label>
              <Select value={config.voice || 'alloy'} onValueChange={(value) => setConfig({ ...config, voice: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alloy">Alloy</SelectItem>
                  <SelectItem value="echo">Echo</SelectItem>
                  <SelectItem value="fable">Fable</SelectItem>
                  <SelectItem value="onyx">Onyx</SelectItem>
                  <SelectItem value="nova">Nova</SelectItem>
                  <SelectItem value="shimmer">Shimmer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'gather':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                value={config.prompt || ''}
                onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
                placeholder="What do you want to ask the caller?"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected-input">Expected Input</Label>
              <Select value={config.expectedInput || 'speech'} onValueChange={(value) => setConfig({ ...config, expectedInput: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speech">Speech</SelectItem>
                  <SelectItem value="dtmf">DTMF (Keypad)</SelectItem>
                  <SelectItem value="both">Speech & DTMF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                value={config.timeout || 5}
                onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) })}
                min="1"
                max="30"
              />
            </div>
          </div>
        );

      case 'if-else':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={config.condition || 'contains'} onValueChange={(value) => setConfig({ ...config, condition: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="starts-with">Starts with</SelectItem>
                  <SelectItem value="ends-with">Ends with</SelectItem>
                  <SelectItem value="greater-than">Greater than</SelectItem>
                  <SelectItem value="less-than">Less than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value to Compare</Label>
              <Input
                id="value"
                value={config.value || ''}
                onChange={(e) => setConfig({ ...config, value: e.target.value })}
                placeholder="Enter comparison value..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variable">Variable to Check</Label>
              <Input
                id="variable"
                value={config.variable || ''}
                onChange={(e) => setConfig({ ...config, variable: e.target.value })}
                placeholder="e.g., user_input, score, etc."
              />
            </div>
          </div>
        );

      case 'api-request':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">API URL</Label>
              <Input
                id="url"
                value={config.url || ''}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select value={config.method || 'GET'} onValueChange={(value) => setConfig({ ...config, method: value })}>
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
            <div className="space-y-2">
              <Label htmlFor="headers">Headers (JSON)</Label>
              <Textarea
                id="headers"
                value={config.headers || ''}
                onChange={(e) => setConfig({ ...config, headers: e.target.value })}
                placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Request Body (JSON)</Label>
              <Textarea
                id="body"
                value={config.body || ''}
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                placeholder='{"data": "value"}'
                rows={3}
              />
            </div>
          </div>
        );

      case 'transfer-call':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                value={config.phoneNumber || ''}
                onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcement">Announcement</Label>
              <Textarea
                id="announcement"
                value={config.announcement || ''}
                onChange={(e) => setConfig({ ...config, announcement: e.target.value })}
                placeholder="Message to play before transfer..."
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="wait-for-answer"
                checked={config.waitForAnswer || false}
                onCheckedChange={(checked) => setConfig({ ...config, waitForAnswer: checked })}
              />
              <Label htmlFor="wait-for-answer">Wait for answer</Label>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={config.label || ''}
                onChange={(e) => setConfig({ ...config, label: e.target.value })}
                placeholder="Enter node label..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={config.description || ''}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="Describe what this step does..."
                rows={3}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-80 h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{node?.data?.label || 'Configure Node'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderNodeConfig()}
        
        <div className="flex items-center gap-2 pt-4 border-t">
          <Button onClick={handleSave} size="sm" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={handleDelete} size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};