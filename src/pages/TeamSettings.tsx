
import React from 'react';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import TeamManagement from '@/components/team/TeamManagement';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

const TeamSettings = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-accent/50 to-muted/40">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Team Settings
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage your team members, roles, and permissions
          </p>
        </div>
        
        <div className="bg-card/70 rounded-2xl shadow-xl p-8 border border-muted/70">
          <PermissionGuard 
            resource="manage_team"
            fallback={
              <Alert>
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  You don't have permission to manage team settings. Contact your account administrator.
                </AlertDescription>
              </Alert>
            }
          >
            <TeamManagement />
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
};

export default TeamSettings;
