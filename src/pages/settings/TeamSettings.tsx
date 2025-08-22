
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import TeamManagement from '@/components/team/TeamManagement';

const TeamSettings = () => {
  return (
    <div className="min-h-screen p-0 font-poppins bg-gradient-to-br from-background via-accent/50 to-muted/40">
      <div className="px-6 pt-8 pb-4 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Team Management
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage team members, roles, and permissions
          </p>
        </div>
        
        <div className="bg-card/70 rounded-2xl shadow-xl p-5 md:p-8 border border-muted/70 w-full">
          <TeamManagement />
        </div>
      </div>
    </div>
  );
};

export default TeamSettings;
