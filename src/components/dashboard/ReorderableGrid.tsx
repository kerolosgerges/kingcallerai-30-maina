import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Phone, Brain, Workflow, Zap, TrendingUp, DollarSign } from "lucide-react";
import { VoiceAIKPIs } from "./VoiceAIKPIs";
import { MarketingKPIs } from "./MarketingKPIs";
import { CallMetricsKPIs } from "./CallMetricsKPIs";
import { AgentPerformanceKPIs } from "./AgentPerformanceKPIs";
import WorkflowKPIs from "./WorkflowKPIs";
import { IntegrationKPIs } from "./IntegrationKPIs";
import { RevenueKPIs } from "./RevenueKPIs";
import { OverviewKPIs } from "./OverviewKPIs";

interface KPITab {
  id: string;
  title: string;
  icon: any;
  component: React.ComponentType;
}

interface ReorderableGridProps {
  onOrderChange: (newOrder: string[]) => void;
  initialOrder?: string[];
  editMode?: boolean;
  onRemoveWidget?: (id: string) => void;
}

export const ReorderableGrid = ({
  onOrderChange,
  initialOrder = [],
  editMode = false,
  onRemoveWidget,
}: ReorderableGridProps) => {
  const defaultTabs: KPITab[] = [
    {
      id: "overview",
      title: "Overview",
      icon: BarChart3,
      component: OverviewKPIs
    },
    {
      id: "voice-ai",
      title: "Voice AI",
      icon: Brain,
      component: VoiceAIKPIs
    },
    {
      id: "marketing",
      title: "Marketing",
      icon: TrendingUp,
      component: MarketingKPIs
    },
    {
      id: "calls",
      title: "Call Metrics",
      icon: Phone,
      component: CallMetricsKPIs
    },
    {
      id: "agents",
      title: "Agent Performance",
      icon: Users,
      component: AgentPerformanceKPIs
    },
    {
      id: "workflows",
      title: "Workflows",
      icon: Workflow,
      component: WorkflowKPIs
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: Zap,
      component: IntegrationKPIs
    },
    {
      id: "revenue",
      title: "Revenue",
      icon: DollarSign,
      component: RevenueKPIs
    }
  ];

  const [tabs, setTabs] = useState<KPITab[]>(() => {
    if (initialOrder.length === 0) return defaultTabs;
    
    const orderedTabs = initialOrder.map(id => 
      defaultTabs.find(tab => tab.id === id)
    ).filter(Boolean) as KPITab[];
    
    const missingTabs = defaultTabs.filter(tab => 
      !initialOrder.includes(tab.id)
    );
    
    return [...orderedTabs, ...missingTabs];
  });

  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "overview");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newTabs = Array.from(tabs);
    const [reorderedTab] = newTabs.splice(result.source.index, 1);
    newTabs.splice(result.destination.index, 0, reorderedTab);

    setTabs(newTabs);
    onOrderChange(newTabs.map(tab => tab.id));
  };

  useEffect(() => {
    if (initialOrder.length > 0) {
      const orderedTabs = initialOrder.map(id => 
        defaultTabs.find(tab => tab.id === id)
      ).filter(Boolean) as KPITab[];
      
      const missingTabs = defaultTabs.filter(tab => 
        !initialOrder.includes(tab.id)
      );
      
      setTabs([...orderedTabs, ...missingTabs]);
    }
  }, [initialOrder]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tabs.map((tab, index) => (
          <div key={tab.id} className="relative group p-0">
            {editMode && onRemoveWidget && (
              <button
                onClick={() => onRemoveWidget(tab.id)}
                className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 shadow transition-opacity opacity-80 group-hover:opacity-100"
                aria-label="Remove widget"
              >
                ×
              </button>
            )}
            <tab.component />
          </div>
        ))}
      </div>
    </div>
  );
};
