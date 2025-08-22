
import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Phone } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface PhoneNumbersSidebarProps {
  selectedPhone: string | null;
}

// Mock data - replace with actual data from your API
const mockPhoneNumbers = [
  {
    number: "+1 (507) 580-5007",
    id: "15075805007",
    provider: "Twilio",
    status: "active",
    type: "local"
  }
];

export const PhoneNumbersSidebar = ({ selectedPhone }: PhoneNumbersSidebarProps) => {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handlePhoneSelect = (phoneId: string) => {
    navigate(`/phoneNumbers?phone=${phoneId}`);
  };

  const isActive = (phoneId: string) => selectedPhone === phoneId;

  return (
    <Sidebar className={collapsed ? "w-14" : "w-80"} collapsible="icon">
      <SidebarContent className="bg-white/70 backdrop-blur-sm border-r">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {!collapsed && "Your Numbers"}
          </SidebarGroupLabel>
          
          {!collapsed && (
            <div className="px-2 text-sm text-muted-foreground mb-4">
              {mockPhoneNumbers.length} phone number{mockPhoneNumbers.length !== 1 ? 's' : ''}
            </div>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {mockPhoneNumbers.length === 0 ? (
                <div className="p-4 text-center">
                  {!collapsed && (
                    <>
                      <p className="text-muted-foreground mb-4">You don't have any phone numbers</p>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Buy New Number
                      </Button>
                    </>
                  )}
                  {collapsed && (
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                mockPhoneNumbers.map((phone) => (
                  <SidebarMenuItem key={phone.id}>
                    <SidebarMenuButton
                      isActive={isActive(phone.id)}
                      onClick={() => handlePhoneSelect(phone.id)}
                      className="h-auto p-3"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{phone.number}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {phone.provider}
                              </Badge>
                              <Badge 
                                variant={phone.status === "active" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {phone.status}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
