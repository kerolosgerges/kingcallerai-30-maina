
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowDown, Settings, Trash2, GripVertical } from 'lucide-react';
import { ActionSidebar } from './ActionSidebar';

interface Action {
  id: string;
  type: string;
  name: string;
  description?: string;
  config?: any;
  icon?: any;
  color?: string;
}

interface ActionSequenceBuilderProps {
  actions: Action[];
  onActionsChange: (actions: Action[]) => void;
  onAddAction: (action: any) => void;
  triggerType?: string;
}

export function ActionSequenceBuilder({ 
  actions, 
  onActionsChange, 
  onAddAction,
  triggerType 
}: ActionSequenceBuilderProps) {
  const [showActionSidebar, setShowActionSidebar] = useState(false);
  const [editingAction, setEditingAction] = useState<string | null>(null);

  const handleRemoveAction = (actionId: string) => {
    const updatedActions = actions.filter(action => action.id !== actionId);
    onActionsChange(updatedActions);
  };

  const handleMoveAction = (actionId: string, direction: 'up' | 'down') => {
    const currentIndex = actions.findIndex(action => action.id === actionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= actions.length) return;

    const updatedActions = [...actions];
    [updatedActions[currentIndex], updatedActions[newIndex]] = 
    [updatedActions[newIndex], updatedActions[currentIndex]];
    
    onActionsChange(updatedActions);
  };

  const getSuggestedActions = () => {
    const suggestions: Action[] = [];
    
    switch (triggerType) {
      case 'contact-created':
        suggestions.push(
          { id: 'welcome-email', type: 'send-email', name: 'Send Welcome Email', description: 'Welcome new contacts' },
          { id: 'add-tag', type: 'add-contact-tag', name: 'Add Tag', description: 'Tag as new contact' },
          { id: 'assign-user', type: 'assign-to-user', name: 'Assign to User', description: 'Assign to team member' }
        );
        break;
      case 'birthday-reminder':
        suggestions.push(
          { id: 'birthday-email', type: 'send-email', name: 'Send Birthday Email', description: 'Send birthday wishes' },
          { id: 'birthday-sms', type: 'send-sms', name: 'Send Birthday SMS', description: 'Send birthday text' }
        );
        break;
      case 'contact-tag':
        suggestions.push(
          { id: 'update-field', type: 'update-contact-field', name: 'Update Contact Field', description: 'Update contact information' },
          { id: 'follow-up-email', type: 'send-email', name: 'Send Follow-up Email', description: 'Follow up based on tag' }
        );
        break;
      default:
        suggestions.push(
          { id: 'send-email', type: 'send-email', name: 'Send Email', description: 'Send an email' },
          { id: 'add-note', type: 'add-to-notes', name: 'Add Note', description: 'Add a note to contact' }
        );
    }
    
    return suggestions;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Action Sequence</h3>
        <Badge variant="secondary" className="text-xs">
          {actions.length} action{actions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Suggested Actions (when no actions exist) */}
      {actions.length === 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Suggested Actions</h4>
          <div className="grid grid-cols-1 gap-2">
            {getSuggestedActions().slice(0, 3).map((suggestion) => (
              <Card 
                key={suggestion.id}
                className="cursor-pointer hover:shadow-sm transition-shadow border-dashed"
                onClick={() => onAddAction(suggestion)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">{suggestion.name}</h5>
                      <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action List */}
      {actions.length > 0 && (
        <div className="space-y-3">
          {actions.map((action, index) => (
            <div key={action.id} className="relative">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Drag Handle */}
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    
                    {/* Step Number */}
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    
                    {/* Action Info */}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{action.name}</h4>
                      {action.description && (
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAction(action.id)}
                        className="h-7 w-7 p-0"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAction(action.id)}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow between actions */}
              {index < actions.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Action Button */}
      <Button
        variant="outline"
        onClick={() => setShowActionSidebar(true)}
        className="w-full border-dashed"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Action
      </Button>

      {/* Action Sidebar */}
      {showActionSidebar && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l shadow-lg z-50">
          <ActionSidebar
            onAddAction={(action) => {
              onAddAction(action);
              setShowActionSidebar(false);
            }}
            onClose={() => setShowActionSidebar(false)}
          />
        </div>
      )}
    </div>
  );
}
