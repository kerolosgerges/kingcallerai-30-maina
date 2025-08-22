
import React, { useState } from 'react';
import { TriggerSidebar } from './TriggerSidebar';
import { ActionSidebar } from './ActionSidebar';
import { Button } from '@/components/ui/button';
import { Plus, X, Settings2, Zap, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PanelManagerProps {
  onAddTrigger: (trigger: any) => void;
  onAddAction: (action: any) => void;
}

type PanelState = {
  triggers: boolean;
  actions: boolean;
};

type PanelLayout = 'both' | 'triggers-only' | 'actions-only' | 'hidden';

export function PanelManager({ onAddTrigger, onAddAction }: PanelManagerProps) {
  const [panels, setPanels] = useState<PanelState>({ triggers: false, actions: false });
  const [panelWidth, setPanelWidth] = useState(320);

  const togglePanel = (panel: keyof PanelState) => {
    setPanels(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  };

  const setLayout = (layout: PanelLayout) => {
    switch (layout) {
      case 'both':
        setPanels({ triggers: true, actions: true });
        break;
      case 'triggers-only':
        setPanels({ triggers: true, actions: false });
        break;
      case 'actions-only':
        setPanels({ triggers: false, actions: true });
        break;
      case 'hidden':
        setPanels({ triggers: false, actions: false });
        break;
    }
  };

  const activePanelCount = Object.values(panels).filter(Boolean).length;
  const adjustedPanelWidth = activePanelCount === 2 ? Math.max(280, panelWidth * 0.85) : panelWidth;

  return (
    <>
      {/* Enhanced Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Panel Toggle Buttons */}
            <div className="flex items-center gap-1 mr-4">
              <Button
                variant={panels.triggers ? "default" : "outline"}
                size="sm"
                onClick={() => togglePanel('triggers')}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                Triggers
                {panels.triggers && <X className="h-3 w-3" />}
              </Button>
              
              <Button
                variant={panels.actions ? "default" : "outline"}
                size="sm"
                onClick={() => togglePanel('actions')}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Actions
                {panels.actions && <X className="h-3 w-3" />}
              </Button>
            </div>

            {/* Quick Layout Buttons */}
            <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayout('both')}
                className="text-xs"
                title="Show Both Panels"
              >
                Both
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayout('hidden')}
                className="text-xs"
                title="Hide All Panels"
              >
                Hide All
              </Button>
            </div>
          </div>

          {/* Panel Status Indicator */}
          {activePanelCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Settings2 className="h-4 w-4" />
              {activePanelCount} panel{activePanelCount > 1 ? 's' : ''} open
            </div>
          )}
        </div>
      </div>

      {/* Dual Panel Layout */}
      <div className="flex h-full">
        {/* Left Panel - Triggers */}
        {panels.triggers && (
          <div 
            className={cn(
              "border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
              activePanelCount === 2 ? "animate-slide-in-left" : "animate-fade-in"
            )}
            style={{ width: adjustedPanelWidth }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" />
                Workflow Triggers
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePanel('triggers')}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-full overflow-hidden">
              <TriggerSidebar
                onAddTrigger={onAddTrigger}
                onClose={() => togglePanel('triggers')}
              />
            </div>
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-50 relative">
          {/* Canvas content will be rendered here by parent component */}
          <div className="absolute inset-0" id="workflow-canvas-container" />
          
          {/* Floating Quick Add Buttons - Only show when no panels are open */}
          {activePanelCount === 0 && (
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <Button
                onClick={() => togglePanel('triggers')}
                className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Plus className="h-4 w-4" />
                Add Trigger
              </Button>
              <Button
                onClick={() => togglePanel('actions')}
                variant="outline"
                className="gap-2 shadow-lg hover:shadow-xl transition-shadow bg-white"
              >
                <Plus className="h-4 w-4" />
                Add Action
              </Button>
            </div>
          )}
        </div>

        {/* Right Panel - Actions */}
        {panels.actions && (
          <div 
            className={cn(
              "border-l border-gray-200 bg-white transition-all duration-300 ease-in-out",
              activePanelCount === 2 ? "animate-slide-in-right" : "animate-fade-in"
            )}
            style={{ width: adjustedPanelWidth }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Play className="h-4 w-4 text-blue-600" />
                Workflow Actions
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePanel('actions')}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-full overflow-hidden">
              <ActionSidebar
                onAddAction={onAddAction}
                onClose={() => togglePanel('actions')}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
