
import { ChevronLeft } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <ChevronLeft className="w-5 h-5 text-gray-400" />
        <h1 className="text-2xl font-semibold text-gray-900">All Agents</h1>
      </div>
    </div>
  );
};
