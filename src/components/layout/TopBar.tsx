import { useState } from "react";
import { Bell, HelpCircle, Ticket, ChevronDown, Plus, Settings, Users, Phone, Zap, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SupportModal } from "./SupportModal";
import { TicketsModal } from "./TicketsModal";
import { BillingProvider } from "@/components/billing/BillingProvider";
import { WalletCreditsTracker } from "@/components/billing/WalletCreditsTracker";
import { useNavigate, useParams } from "react-router-dom";

export const TopBar = () => {
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [ticketsModalOpen, setTicketsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { subAccountId = 'default' } = useParams();
  const { toast } = useToast();

  const quickActions = [{
    title: "Create Assistant",
    description: "Build a new AI assistant",
    icon: Plus,
    action: () => navigate(`/${subAccountId}/assistants`)
  }, {
    title: "Add Contact",
    description: "Add a new contact to your database",
    icon: Users,
    action: () => navigate(`/${subAccountId}/contacts`)
  }, {
    title: "Buy Phone Number",
    description: "Purchase a new phone number",
    icon: Phone,
    action: () => navigate(`/${subAccountId}/settings/phone-numbers`)
  }, {
    title: "Account Settings",
    description: "Manage your account preferences",
    icon: Settings,
    action: () => navigate(`/${subAccountId}/settings/profile`)
  }];

  const handleDownloadJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      subAccountId,
      exportType: "dashboard_data",
      metadata: {
        userAgent: navigator.userAgent,
        currentRoute: window.location.pathname,
        exportedBy: "system"
      },
      dashboardConfig: {
        quickActions,
        settings: {
          theme: "default",
          notifications: true
        }
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Export Complete",
      description: "Dashboard data downloaded as JSON file"
    });
  };

  return (
    <BillingProvider>
      <header className="flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
        </div>

        <div className="flex items-center gap-3">
          {/* Wallet Credits Tracker */}
          <WalletCreditsTracker />

          {/* Support Button */}
          <Button variant="ghost" size="sm" onClick={() => setSupportModalOpen(true)} className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Support</span>
          </Button>

          {/* Tickets Button */}
          <Button variant="ghost" size="sm" onClick={() => setTicketsModalOpen(true)} className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            <span className="hidden sm:inline">Tickets</span>
          </Button>

          {/* Quick Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Actions</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {quickActions.map((action, index) => (
                <DropdownMenuItem key={index} onClick={action.action} className="p-3">
                  <div className="flex items-start gap-3">
                    <action.icon className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white border shadow-lg z-50">
              <DropdownMenuLabel className="text-base">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Test Notifications */}
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="p-4 border-b">
                  <div className="flex items-start gap-3 w-full">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">New agent created</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Your AI assistant "Customer Support Bot" has been successfully created and is ready to use.
                      </div>
                      <div className="text-xs text-gray-400 mt-1">2 minutes ago</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-4 border-b">
                  <div className="flex items-start gap-3 w-full">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Call completed successfully</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Call to +1 (555) 123-4567 completed. Duration: 3m 45s
                      </div>
                      <div className="text-xs text-gray-400 mt-1">5 minutes ago</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-4 border-b">
                  <div className="flex items-start gap-3 w-full">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">API rate limit warning</div>
                      <div className="text-xs text-gray-500 mt-1">
                        You've used 80% of your monthly API quota. Consider upgrading your plan.
                      </div>
                      <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-4 border-b">
                  <div className="flex items-start gap-3 w-full">
                    <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">New contact added</div>
                      <div className="text-xs text-gray-500 mt-1">
                        John Smith was added to your contact list by the import process.
                      </div>
                      <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-4 border-b">
                  <div className="flex items-start gap-3 w-full">
                    <div className="h-2 w-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Integration error</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Failed to sync with CRM. Check your integration settings.
                      </div>
                      <div className="text-xs text-gray-400 mt-1">3 hours ago</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-4">
                  <div className="flex items-start gap-3 w-full">
                    <div className="h-2 w-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">System maintenance scheduled</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Scheduled maintenance tomorrow at 2:00 AM EST. Expected downtime: 30 minutes.
                      </div>
                      <div className="text-xs text-gray-400 mt-1">1 day ago</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/${subAccountId}/settings/notifications`)} className="p-3 text-center text-blue-600 hover:text-blue-700 font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <SupportModal open={supportModalOpen} onOpenChange={setSupportModalOpen} />
      <TicketsModal open={ticketsModalOpen} onOpenChange={setTicketsModalOpen} />
    </BillingProvider>
  );
};
