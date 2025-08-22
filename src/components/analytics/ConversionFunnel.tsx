
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const ConversionFunnel = () => {
  const funnelData = [
    { stage: 'Website Visitors', count: 10000, percentage: 100 },
    { stage: 'Lead Captured', count: 2500, percentage: 25 },
    { stage: 'Qualified Leads', count: 1250, percentage: 12.5 },
    { stage: 'Calls Initiated', count: 875, percentage: 8.75 },
    { stage: 'Successful Calls', count: 655, percentage: 6.55 },
    { stage: 'Conversions', count: 234, percentage: 2.34 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>Customer journey from visit to conversion</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {funnelData.map((stage, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{stage.stage}</span>
              <span className="text-muted-foreground">
                {stage.count.toLocaleString()} ({stage.percentage}%)
              </span>
            </div>
            <Progress value={stage.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
