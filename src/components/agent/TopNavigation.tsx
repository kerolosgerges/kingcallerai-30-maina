import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  Copy as CopyIcon,
  Check as CheckIcon,
  Download as DownloadIcon,
  TreePine,
  Settings,
  FileText,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface TopNavigationProps {
  agentName: string;
  selectedModel: string;
  selectedVoice: string;
  agentId?: string;
  agentData?: any;
  urlParams?: { subAccountId?: string; agentId?: string };
  onAgentNameChange: (name: string) => void;
  onSave?: () => Promise<boolean>;
  onBack?: () => void;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  children?: React.ReactNode;
}

export const TopNavigation = ({
  agentName,
  agentId,
  agentData,
  urlParams,
  onAgentNameChange,
  onSave,
  onBack,
  hasUnsavedChanges = false,
  isSaving = false,
  activeTab = "prompt-tree",
  onTabChange,
  children,
  selectedModel,
  selectedVoice,
}: TopNavigationProps) => {
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  const agentIdDisplay =
    agentData?.agent_id ?? urlParams?.agentId ?? agentId ?? "";

  const handleSave = async () => {
    if (onSave) await onSave();
  };

  const getAgentType = () =>
    agentData?.agent_type
      ? agentData.agent_type.charAt(0).toUpperCase() +
        agentData.agent_type.slice(1)
      : "-";

  const getAgentStatus = () =>
    agentData?.assistant_status
      ? agentData.assistant_status.charAt(0).toUpperCase() +
        agentData.assistant_status.slice(1)
      : "-";

  const updatedAt = agentData?.updated_at || agentData?.updatedAt;
  const createdAt = agentData?.created_at || agentData?.createdAt;
  const timeDisplay = updatedAt
    ? `Last saved ${dayjs(updatedAt).fromNow()}`
    : createdAt
    ? `Created ${dayjs(createdAt).fromNow()}`
    : "";

  const handleExport = () => {
    if (!agentData) return;
    const filename = `agent_${agentIdDisplay || "export"}.json`;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(agentData, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", filename);
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
    setExported(true);
    setTimeout(() => setExported(false), 1300);
  };

  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 shadow-sm">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="p-1" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex flex-col">
          {/* Agent Name */}
          <div className="flex items-center space-x-2">
            <Input
              value={agentName}
              onChange={(e) => onAgentNameChange(e.target.value)}
              className="text-lg font-semibold border border-slate-200 bg-transparent p-2 h-auto focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 w-64 rounded-md"
              spellCheck={false}
            />
            {timeDisplay && (
              <span className="text-xs text-slate-400 ml-2">{timeDisplay}</span>
            )}
          </div>
          {/* ID, type, status */}
          <div className="flex items-center space-x-4 text-xs text-slate-500 mt-0.5">
            <span className="flex items-center">
              Assistant ID:&nbsp;
              {agentIdDisplay ? (
                <>
                  <span className="font-mono text-slate-800 select-all">
                    {agentIdDisplay}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          aria-label="Copy Agent ID"
                          className="ml-1 rounded p-0.5 hover:bg-slate-100 transition"
                          onClick={() => {
                            navigator.clipboard.writeText(agentIdDisplay);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1200);
                          }}
                        >
                          {copied ? (
                            <CheckIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <CopyIcon className="w-4 h-4 text-slate-500 hover:text-slate-900" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {copied ? "Copied!" : "Copy Agent ID"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              ) : (
                <span className="italic">New Assistant</span>
              )}
            </span>
            {agentData && (
              <>
                <span>• Type: {getAgentType()}</span>
                <span>• Status: {getAgentStatus()}</span>
              </>
            )}
            {/* Pricing & Latency */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help hover:text-slate-700 underline decoration-dotted">
                    • $0.115/min • ~1.0s latency
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-white border border-slate-200 shadow-lg p-3 max-w-xs"
                >
                  <div className="space-y-2">
                    <div className="font-medium text-slate-900">
                      Cost & Latency Details
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>- Voice Engine</span>
                        <span>$0.070/min, 450ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- LLM (OpenAI)</span>
                        <span>$0.045/min, 500–800ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- Transcription</span>
                        <span>20–50ms</span>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Center section */}
      <div className="flex items-center">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
          <TabsList className="bg-slate-100/80 h-8">
            <TabsTrigger value="prompt-tree" className="flex items-center gap-1.5 text-xs px-3 py-1 data-[state=active]:bg-white data-[state=active]:text-primary">
              <TreePine className="w-3 h-3" />
              Prompt Tree
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1.5 text-xs px-3 py-1 data-[state=active]:bg-white data-[state=active]:text-primary">
              <Settings className="w-3 h-3" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-1.5 text-xs px-3 py-1 data-[state=active]:bg-white data-[state=active]:text-primary">
              <FileText className="w-3 h-3" />
              Logs
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        {hasUnsavedChanges && (
          <span className="text-xs text-amber-600 font-medium">
            • Unsaved changes
          </span>
        )}
        {agentData && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Export agent config"
                  onClick={handleExport}
                >
                  {exported ? (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <DownloadIcon className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {exported ? "Exported!" : "Export as JSON"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}



        <Button
          className="bg-green-600 hover:bg-green-700 text-white font-medium w-40"
          onClick={handleSave}
        >
          Save Changes
        </Button>

       

      </div>

    
    </div>
  );
};
