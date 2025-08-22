
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import PhoneNumbers from '@/pages/PhoneNumbers';

const PhoneNumbersSettings = () => {
  return (
    <div className="min-h-screen p-0 font-poppins bg-gradient-to-br from-background via-accent/50 to-muted/40">
      <div className="px-6 pt-8 pb-4 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Phone Numbers
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage your phone numbers and configurations
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
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground mb-2">Get Started with Phone Numbers</h2>
                <p className="text-muted-foreground max-w-md">
                  Set up your phone numbers to start making and receiving calls with your AI agents.
                </p>
              </div>
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors">
                Get Started
              </button>
            </div>
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
};

export default PhoneNumbersSettings;
