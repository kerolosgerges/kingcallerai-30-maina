
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarFooterProps {
  subAccountId: string;
}

export const SidebarFooter = ({ subAccountId }: SidebarFooterProps) => {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { currentUser, logout } = useAuth();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getUserInitials = (email: string) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  if (!currentUser) return null;

  return (
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
  );
};
