
import React, { useState, useEffect } from "react";
import { ReorderableGrid } from "./ReorderableGrid";
import { OverviewKPIs } from "./OverviewKPIs";
import { VoiceAIKPIs } from "./VoiceAIKPIs";
import { MarketingKPIs } from "./MarketingKPIs";
import { CallMetricsKPIs } from "./CallMetricsKPIs";
import { AgentPerformanceKPIs } from "./AgentPerformanceKPIs";
import WorkflowKPIs from "./WorkflowKPIs";
import { IntegrationKPIs } from "./IntegrationKPIs";
import { RevenueKPIs } from "./RevenueKPIs";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ALL_WIDGETS = [
  { id: "overview", label: "Overview", component: OverviewKPIs },
  { id: "voice-ai", label: "Voice AI", component: VoiceAIKPIs },
  { id: "marketing", label: "Marketing", component: MarketingKPIs },
  { id: "calls", label: "Call Metrics", component: CallMetricsKPIs },
  { id: "agents", label: "Agent Performance", component: AgentPerformanceKPIs },
  { id: "workflows", label: "Workflows", component: WorkflowKPIs },
  { id: "integrations", label: "Integrations", component: IntegrationKPIs },
  { id: "revenue", label: "Revenue", component: RevenueKPIs },
];

interface WidgetManagerProps {
  initialOrder: string[];
  onOrderChange: (order: string[]) => void;
}

export function WidgetManager({ initialOrder, onOrderChange }: WidgetManagerProps) {
  const [editMode, setEditMode] = useState(false);
  const [order, setOrder] = useState<string[]>(initialOrder || []);

  // Widgets currently shown
  const activeWidgets = order;

  // Widgets not shown
  const availableWidgets = ALL_WIDGETS.filter((w) => !activeWidgets.includes(w.id));

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  const handleReorder = (newOrder: string[]) => {
    setOrder(newOrder);
    onOrderChange(newOrder);
  };

  const handleRemove = (id: string) => {
    const newOrder = order.filter((wid) => wid !== id);
    setOrder(newOrder);
    onOrderChange(newOrder);
    toast({ title: "Widget removed" });
  };

  const handleAdd = (id: string) => {
    const newOrder = [...order, id];
    setOrder(newOrder);
    onOrderChange(newOrder);
    toast({ title: "Widget added" });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Button size="sm" variant={editMode ? "default" : "outline"} onClick={() => setEditMode((e) => !e)}>
          {editMode ? "Exit Edit Mode" : "Edit Widgets"}
        </Button>
        {editMode && availableWidgets.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {availableWidgets.map((widget) => (
              <Button
                key={widget.id}
                size="sm"
                variant="secondary"
                onClick={() => handleAdd(widget.id)}
                className="flex gap-1"
              >
                + {widget.label}
              </Button>
            ))}
          </div>
        )}
        {editMode && availableWidgets.length === 0 && (
          <span className="text-xs text-muted-foreground">(All widgets in use)</span>
        )}
      </div>
      <ReorderableGrid
        onOrderChange={handleReorder}
        initialOrder={order}
        editMode={editMode}
        onRemoveWidget={handleRemove}
      />
    </div>
  );
}
