
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import ProfileTab from '@/components/settings/ProfileTab';
import PhoneRegistrationTab from '@/components/settings/PhoneRegistrationTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import SecurityTab from '@/components/settings/SecurityTab';
import BillingTab from '@/components/settings/BillingTab';
import TeamManagement from '@/components/team/TeamManagement';
import Plans from '@/pages/Plans';
import PhoneNumbers from '@/pages/PhoneNumbers';
import Integrations from '@/pages/Integrations';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subAccountId } = useParams();
  const [activeTab, setActiveTab] = useState('profile');

  // Extract tab from pathname
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const settingsIndex = pathParts.indexOf('settings');
    if (settingsIndex !== -1 && pathParts[settingsIndex + 1]) {
      setActiveTab(pathParts[settingsIndex + 1]);
    } else {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/${subAccountId}/settings/${value}`);
  };

  return (
    <div className="min-h-screen p-0 font-poppins bg-gradient-to-br from-background via-accent/50 to-muted/40">
      <div className="px-6 pt-8 pb-4 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Account Settings
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage your account preferences and configuration
          </p>
        </div>
        
        <div className="bg-card/70 rounded-2xl shadow-xl p-5 md:p-8 border border-muted/70 w-full">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {/* Hidden TabsList since navigation is handled by sidebar */}
            <TabsList className="hidden">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="phone-numbers">Phone Numbers</TabsTrigger>
              <TabsTrigger value="phone-registration">Phone Registration</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="team">Team Management</TabsTrigger>
              <TabsTrigger value="plans">Plans & Billing</TabsTrigger>
              <TabsTrigger value="billing">Billing & Invoices</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <div className="w-full">
              <TabsContent value="profile" className="space-y-6 animate-fade-in">
                <ProfileTab />
              </TabsContent>

              <TabsContent value="phone-numbers" className="space-y-6 animate-fade-in">
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
                  <PhoneNumbers />
                </PermissionGuard>
              </TabsContent>
              
              <TabsContent value="phone-registration" className="space-y-6 animate-fade-in">
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
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6 animate-fade-in">
                <NotificationsTab />
              </TabsContent>

              <TabsContent value="team" className="space-y-6 animate-fade-in">
                <PermissionGuard 
                  resource="manage_team"
                  fallback={
                    <Alert>
                      <ShieldAlert className="h-4 w-4" />
                      <AlertDescription>
                        You don't have permission to manage team members. Contact your account administrator.
                      </AlertDescription>
                    </Alert>
                  }
                >
                  <TeamManagement />
                </PermissionGuard>
              </TabsContent>

              <TabsContent value="plans" className="space-y-6 animate-fade-in">
                <PermissionGuard 
                  resource="manage_billing"
                  fallback={
                    <Alert>
                      <ShieldAlert className="h-4 w-4" />
                      <AlertDescription>
                        You don't have permission to manage billing. Contact your account administrator.
                      </AlertDescription>
                    </Alert>
                  }
                >
                  <Plans />
                </PermissionGuard>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6 animate-fade-in">
                <PermissionGuard 
                  resource="manage_billing"
                  fallback={
                    <Alert>
                      <ShieldAlert className="h-4 w-4" />
                      <AlertDescription>
                        You don't have permission to manage billing. Contact your account administrator.
                      </AlertDescription>
                    </Alert>
                  }
                >
                  <BillingTab />
                </PermissionGuard>
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6 animate-fade-in">
                <PermissionGuard 
                  resource="manage_integrations"
                  fallback={
                    <Alert>
                      <ShieldAlert className="h-4 w-4" />
                      <AlertDescription>
                        You don't have permission to manage integrations. Contact your account administrator.
                      </AlertDescription>
                    </Alert>
                  }
                >
                  <Integrations />
                </PermissionGuard>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6 animate-fade-in">
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
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
