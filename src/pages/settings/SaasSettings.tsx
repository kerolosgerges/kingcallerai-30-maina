
import React from 'react';
import SaasSettingsTab from '@/components/settings/SaasSettingsTab';

const SaasSettings = () => {
  return (
    <div className="min-h-screen p-0 font-poppins bg-gradient-to-br from-background via-accent/50 to-muted/40">
      <div className="px-6 pt-8 pb-4 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            SAAS Settings
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage your business information and configuration
          </p>
        </div>
        
        <div className="bg-card/70 rounded-2xl shadow-xl p-5 md:p-8 border border-muted/70 w-full">
          <SaasSettingsTab />
        </div>
      </div>
    </div>
  );
};

export default SaasSettings;
