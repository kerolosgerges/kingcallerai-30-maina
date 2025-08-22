import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

const WorkflowKPIs = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Workflow KPIs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <GitBranch className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Workflow KPIs Disabled</h3>
          <p>Focus on core features: Contacts and File Management only.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowKPIs;