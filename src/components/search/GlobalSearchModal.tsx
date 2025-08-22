
import { useState } from "react";
import { Search, FileText, Users, Brain, Phone, Settings, BarChart3, Zap, Wrench, Mail, Workflow, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  icon: React.ComponentType<any>;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: React.ComponentType<any>;
  category: string;
}

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearchModal = ({ open, onOpenChange }: GlobalSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "View your voice AI business metrics",
      url: "/dashboard",
      icon: BarChart3,
      category: "Navigation",
    },
    {
      id: "contacts",
      title: "Contacts",
      description: "Manage your contact database",
      url: "/contacts",
      icon: Users,
      category: "Navigation",
    },
    {
      id: "tools",
      title: "Tools",
      description: "Manage your AI tools and integrations",
      url: "/tools",
      icon: Wrench,
      category: "Navigation",
    },
    {
      id: "assistants",
      title: "Assistants",
      description: "Manage your AI assistants",
      url: "/agents",
      icon: Brain,
      category: "Navigation",
    },
    {
      id: "campaigns",
      title: "Campaigns",
      description: "Create and manage campaigns",
      url: "/campaigns",
      icon: Mail,
      category: "Navigation",
    },
    {
      id: "workflows",
      title: "Workflows",
      description: "Automate your processes",
      url: "/workflows",
      icon: Workflow,
      category: "Navigation",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View performance insights",
      url: "/analytics",
      icon: BarChart3,
      category: "Navigation",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure your account",
      url: "/settings",
      icon: Settings,
      category: "Navigation",
    },
  ];

  const searchResults: SearchResult[] = [
    {
      id: "1",
      title: "Dashboard",
      description: "View your voice AI business metrics",
      type: "Page",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      id: "2",
      title: "Create Assistant",
      description: "Build a new voice AI assistant",
      type: "Action",
      url: "/agents/new",
      icon: Brain,
    },
    {
      id: "3",
      title: "Contact Management",
      description: "View and manage your contacts",
      type: "Page",
      url: "/contacts",
      icon: Users,
    },
    {
      id: "4",
      title: "Account Settings",
      description: "Configure your account preferences",
      type: "Page",
      url: "/settings",
      icon: Settings,
    },
    {
      id: "5",
      title: "Call Logs",
      description: "Review your call history and recordings",
      type: "Page",
      url: "/call-logs",
      icon: FileText,
    },
    {
      id: "6",
      title: "Tools",
      description: "Manage your AI tools and integrations",
      type: "Page",
      url: "/tools",
      icon: Wrench,
    },
  ];

  const filteredResults = searchResults.filter(result =>
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuickActions = quickActions.filter(action =>
    action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResultClick = (url: string) => {
    navigate(url);
    onOpenChange(false);
    setSearchQuery("");
  };

  const showQuickActions = searchQuery.length === 0;
  const showResults = searchQuery.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">Search</DialogTitle>
        </DialogHeader>
        
        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for pages, assistants, contacts, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
              autoFocus
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          {showQuickActions && (
            <div className="mt-4 space-y-4">
              <div className="text-sm font-medium text-gray-600 mb-3">Quick Actions</div>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.slice(0, 6).map((action) => (
                  <div
                    key={action.id}
                    onClick={() => handleResultClick(action.url)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
                  >
                    <div className="flex-shrink-0">
                      <action.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">{action.title}</div>
                      <div className="text-xs text-gray-500 truncate">{action.description}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {showResults && (
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              {filteredResults.length > 0 || filteredQuickActions.length > 0 ? (
                <>
                  {filteredQuickActions.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600 mb-2">Quick Actions</div>
                      {filteredQuickActions.map((action) => (
                        <div
                          key={action.id}
                          onClick={() => handleResultClick(action.url)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <action.icon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">{action.title}</div>
                            <div className="text-sm text-gray-500 truncate">{action.description}</div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              {action.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {filteredResults.length > 0 && (
                    <div className="space-y-2">
                      {filteredQuickActions.length > 0 && <div className="border-t pt-3 mt-3" />}
                      <div className="text-sm font-medium text-gray-600 mb-2">Search Results</div>
                      {filteredResults.map((result) => (
                        <div
                          key={result.id}
                          onClick={() => handleResultClick(result.url)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <result.icon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">{result.title}</div>
                            <div className="text-sm text-gray-500 truncate">{result.description}</div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              {result.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {showQuickActions && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 text-center">
                Type to search for specific pages, assistants, or actions
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
