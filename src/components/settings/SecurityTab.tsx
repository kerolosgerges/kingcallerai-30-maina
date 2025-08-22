
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const SecurityTab = () => (
  <Card className="rounded-2xl shadow-lg border border-muted/60 bg-background/80">
    <CardHeader>
      <CardTitle>Security Settings</CardTitle>
      <CardDescription>
        Manage your password, 2FA, and other security settings.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg opacity-70 cursor-not-allowed shadow" disabled>
          Change Password (Coming soon)
        </button>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg opacity-70 cursor-not-allowed shadow" disabled>
          Setup 2FA (Coming soon)
        </button>
      </div>
      <p className="text-muted-foreground mt-4 italic">Security features will be available soon.</p>
    </CardContent>
  </Card>
);

export default SecurityTab;
