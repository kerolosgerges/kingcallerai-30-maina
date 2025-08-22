
import React from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { User, Phone, Bell, Shield, CreditCard, ShieldAlert, Users, ArrowLeft, Zap, Settings as SettingsIcon, Receipt } from 'lucide-react';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';

// Tab list with permission requirements
const SETTINGS_TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: User,
    permission: null, // Everyone can access profile
  },
  {
    value: 'phone-numbers',
    label: 'Phone Numbers',
    icon: Phone,
    permission: 'manage_phone_numbers' as const,
  },
  {
    value: 'phone-registration',
    label: 'Phone Registration',
    icon: Phone,
    permission: 'manage_phone_numbers' as const,
  },
  {
    value: 'notifications',
    label: 'Notifications',
    icon: Bell,
    permission: null, // Everyone can manage their notifications
  },
  {
    value: 'team',
    label: 'Team Management',
    icon: Users,
    permission: 'manage_team' as const,
  },
  {
    value: 'plans',
    label: 'Plans & Billing',
    icon: CreditCard,
    permission: 'manage_billing' as const,
  },
  {
    value: 'billing',
    label: 'Billing & Invoices',
    icon: Receipt,
    permission: 'manage_billing' as const,
  },
  {
    value: 'integrations',
    label: 'Integrations',
    icon: Zap,
    permission: 'manage_integrations' as const,
  },
  {
    value: 'security',
    label: 'Security',
    icon: Shield,
    permission: 'manage_security' as const,
  },
];

export const SettingsSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subAccountId } = useParams();
  
  // Extract the current tab from the pathname
  const currentPath = location.pathname;
  const activeTab = currentPath.split('/settings/')[1] || 'profile';

  return (
    <Sidebar className="w-64">
      <SidebarContent className="bg-white/70 backdrop-blur-sm border-r">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3">
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">Account Settings</span>
            </div>
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {SETTINGS_TABS.map((tab) => (
                <SidebarMenuItem key={tab.value}>
                  {tab.permission ? (
                    <PermissionGuard 
                      resource={tab.permission}
                      fallback={
                        <div className="px-4 py-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed">
                          <div className="flex items-center gap-3">
                            <tab.icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                            <ShieldAlert className="h-3 w-3 ml-auto" />
                          </div>
                        </div>
                      }
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={activeTab === tab.value}
                        className="h-auto p-3"
                      >
                        <NavLink to={`/${subAccountId}/settings/${tab.value}`} className="flex items-center gap-3 w-full">
                          <tab.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium">{tab.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </PermissionGuard>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={activeTab === tab.value}
                      className="h-auto p-3"
                    >
                      <NavLink to={`/${subAccountId}/settings/${tab.value}`} className="flex items-center gap-3 w-full">
                        <tab.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">{tab.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate(`/${subAccountId}/dashboard`)}
          className="w-full flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
