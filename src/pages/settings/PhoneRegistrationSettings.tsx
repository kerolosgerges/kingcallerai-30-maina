
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import PhoneRegistrationTab from '@/components/settings/PhoneRegistrationTab';

const PhoneRegistrationSettings = () => {
  return (
    <div className="min-h-screen p-0 font-poppins bg-gradient-to-br from-background via-accent/50 to-muted/40">
      <div className="px-6 pt-8 pb-4 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Phone Registration
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Register your phone numbers for compliance and verification
          </p>
        </div>
        
        <div className="bg-card/70 rounded-2xl shadow-xl p-5 md:p-8 border border-muted/70 w-full">
          <PermissionGuard 
            resource="manage_phone_numbers"
            fallback={
              <Alert>
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  You don't have permission to manage phone numbers. Contact your account administrator.
                </AlertDescription>
              </Alert>
            }
          >
            <PhoneRegistrationTab />
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
};

export default PhoneRegistrationSettings;
