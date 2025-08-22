
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConversationHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  totalConversations: number;
}

export const ConversationHeader = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalConversations
}: ConversationHeaderProps) => {
  return (
    <div className="p-4 border-b bg-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Conversations</h1>
        <span className="text-sm text-gray-500">{totalConversations} conversations</span>
      </div>
      
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1">
        <Button
          variant={statusFilter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => onStatusFilterChange("all")}
          className="text-xs"
        >
          All
        </Button>
        <Button
          variant={statusFilter === "active" ? "default" : "ghost"}
          size="sm"
          onClick={() => onStatusFilterChange("active")}
          className="text-xs"
        >
          Unassigned
        </Button>
        <Button
          variant={statusFilter === "completed" ? "default" : "ghost"}
          size="sm"
          onClick={() => onStatusFilterChange("completed")}
          className="text-xs"
        >
          Assigned
        </Button>
        <Button
          variant={statusFilter === "failed" ? "default" : "ghost"}
          size="sm"
          onClick={() => onStatusFilterChange("failed")}
          className="text-xs"
        >
          Resolved
        </Button>
      </div>
    </div>
  );
};
