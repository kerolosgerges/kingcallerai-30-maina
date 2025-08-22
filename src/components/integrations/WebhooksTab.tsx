
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type WebhookType = {
  id: number;
  name: string;
  url: string;
  status: string;
};

interface Props {
  webhooks: WebhookType[];
}

const WebhooksTab: React.FC<Props> = ({ webhooks }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>Configure webhook endpoints for real-time notifications</CardDescription>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Webhook
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">{webhook.name}</div>
                <div className="text-sm text-gray-500 font-mono">{webhook.url}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                  {webhook.status}
                </Badge>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhooksTab;
