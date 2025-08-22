
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import SecurityTab from '@/components/settings/SecurityTab';

const SecuritySettings = () => {
  return (
    <div className="min-h-screen p-0 font-poppins bg-gradient-to-br from-background via-accent/50 to-muted/40">
      <div className="px-6 pt-8 pb-4 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Security Settings
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage your account security and authentication settings
          </p>
        </div>
        
        <div className="bg-card/70 rounded-2xl shadow-xl p-5 md:p-8 border border-muted/70 w-full">
          <PermissionGuard 
            resource="manage_settings"
            fallback={
              <Alert>
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  You don't have permission to manage security settings. Contact your account administrator.
                </AlertDescription>
              </Alert>
            }
          >
            <SecurityTab />
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
