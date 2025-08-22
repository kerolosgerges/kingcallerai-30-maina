
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Phone, Home, Settings, Workflow, BarChart3, Zap, Brain, CreditCard, LogOut, User, Users, FileText, PhoneCall, Code, Wrench, Mail, Search, Bot, Sparkles, Building2, ChevronDown, MessageSquare, Folder } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubAccount } from "@/contexts/SubAccountContext";
import { useState, useEffect } from "react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearchModal } from "./search/GlobalSearchModal";

const navigationItems = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Contacts",
    url: "contacts",
    icon: Users,
  },
  {
    title: "Agents",
    url: "agents",
    icon: Zap,
  },
  {
    title: "Conversations",
    url: "conversations",
    icon: MessageSquare,
  },
  {
    title: "Workflows",
    url: "workflows",
    icon: Workflow,
  },
  {
    title: "Tools",
    url: "tools",
    icon: Wrench,
  },
  {
    title: "Analytics",
    url: "analytics",
    icon: BarChart3,
  },
  {
    title: "Knowledge",
    url: "knowledge",
    icon: Brain,
  },
  {
    title: "Voice Library",
    url: "voices",
    icon: Sparkles,
  },
  {
    title: "AI Helper",
    url: "ai-helper",
    icon: Bot,
  },
  {
    title: "File Manager",
    url: "files",
    icon: Folder,
  },
];

const logItems = [
  {
    title: "Webhook Logs",
    url: "webhook-logs",
    icon: FileText,
  },
  {
    title: "Workflow Logs",
    url: "workflow-logs",
    icon: FileText,
  },
  {
    title: "Call Logs",
    url: "call-logs",
    icon: PhoneCall,
  },
  {
    title: "API Logs",
    url: "api-logs",
    icon: Code,
  },
];

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subAccountId = 'default' } = useParams();
  const { state } = useSidebar();
  const { currentUser, logout } = useAuth();
  const { currentSubAccount } = useSubAccount();
  const collapsed = state === "collapsed";
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [showLaunchPad, setShowLaunchPad] = useState(false);


  // Check if we should show LaunchPad (first time user or coming from onboarding)
  useEffect(() => {
    const isFirstTimeUser = localStorage.getItem(`launchpad_completed_${subAccountId}`) !== 'true';
    const isFromOnboarding = location.pathname.includes('/launchpad');
    
    setShowLaunchPad(isFirstTimeUser || isFromOnboarding);
  }, [subAccountId, location.pathname]);

  const handleNavigation = (url: string) => {
    navigate(`/${subAccountId}/${url}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };


  const isActive = (url: string) => {
    const currentPath = location.pathname;
    const expectedPath = `/${subAccountId}/${url}`;
    
    if (url === "dashboard" && currentPath === `/${subAccountId}/dashboard`) return true;
    if (url === "launchpad" && currentPath === `/${subAccountId}/launchpad`) return true;
    if (url !== "dashboard" && url !== "launchpad" && currentPath.startsWith(expectedPath)) return true;
    return false;
  };

  const getUserInitials = (email: string) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  const getDisplayName = (subAccountId: string) => {
    const lastFour = subAccountId.slice(-4);
    return `${currentSubAccount?.name || 'Workspace'} (${lastFour})`;
  };


  const launchPadItem = {
    title: "LaunchPad",
    url: "launchpad",
    icon: Sparkles,
  };

  return (
    <>
      <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
        <SidebarContent className="bg-white/70 backdrop-blur-sm border-r">
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-center px-4 py-6">
              <img 
                src="https://www.kingcaller.ai/assets/images/logo.svg" 
                alt="KingCaller" 
                className="h-16 w-auto" 
              />
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Search Bar */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setSearchModalOpen(true)}
                    className="h-auto p-4 bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-4 w-full text-gray-500">
                      <Search className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="text-sm">Search...</span>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* LaunchPad - Only show for first time users or during onboarding flow */}
                {showLaunchPad && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isActive(launchPadItem.url)}
                      onClick={() => handleNavigation(launchPadItem.url)}
                      className="h-auto p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <launchPadItem.icon className="h-5 w-5 flex-shrink-0 text-primary" />
                        {!collapsed && (
                          <span className="font-medium text-primary">{launchPadItem.title}</span>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {/* Main Navigation */}
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive(item.url)}
                      onClick={() => handleNavigation(item.url)}
                      className="h-auto p-4"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Logs Collapsible Group */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-auto p-4">
                      <div className="flex items-center gap-4 w-full">
                        <FileText className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="font-medium">Logs</span>
                            <ChevronDown className="h-4 w-4 ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    {logItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          isActive={isActive(item.url)}
                          onClick={() => handleNavigation(item.url)}
                          className="h-auto p-3 pl-12"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            {!collapsed && (
                              <span className="text-sm">{item.title}</span>
                            )}
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="p-4 space-y-3">

          {/* User Profile */}
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto p-2">
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.photoURL || undefined} />
                      <AvatarFallback>
                        {getUserInitials(currentUser.email || '')}
                      </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">
                          {currentUser.displayName || currentUser.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {currentUser.email}
                        </div>
                      </div>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`/${subAccountId}/profile`)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/${subAccountId}/settings`)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </SidebarFooter>
      </Sidebar>

      <GlobalSearchModal 
        open={searchModalOpen} 
        onOpenChange={setSearchModalOpen} 
      />
    </>
  );
};
