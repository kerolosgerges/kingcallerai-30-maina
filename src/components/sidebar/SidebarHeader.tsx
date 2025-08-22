
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";

interface SidebarHeaderProps {
  showLaunchPad: boolean;
  onNavigate: (url: string) => void;
  isActive: (url: string) => boolean;
}

export const SidebarHeader = ({ showLaunchPad, onNavigate, isActive }: SidebarHeaderProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const launchPadItem = {
    title: "LaunchPad",
    url: "launchpad",
    icon: Sparkles,
  };

  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-center px-4 py-6">
        <img 
          src="https://www.kingcaller.ai/assets/images/logo.svg" 
          alt="KingCaller" 
          className="h-16 w-auto" 
        />
      </div>
      
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

      {/* LaunchPad */}
      {showLaunchPad && (
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={isActive(launchPadItem.url)}
            onClick={() => onNavigate(launchPadItem.url)}
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

      <GlobalSearchModal 
        open={searchModalOpen} 
        onOpenChange={setSearchModalOpen} 
      />
    </>
  );
};
