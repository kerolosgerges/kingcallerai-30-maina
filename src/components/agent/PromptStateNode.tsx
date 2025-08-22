import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit3, MessageCircle, Trash2 } from 'lucide-react';

interface PromptStateNodeProps {
  id: string;
  data: {
    label: string;
    prompt: string;
    isStarting?: boolean;
  };
}

export const PromptStateNode = memo(({ id, data }: PromptStateNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  const [editPrompt, setEditPrompt] = useState(data.prompt);

  const handleSave = () => {
    // In a real implementation, this would update the node data
    console.log('Saving node:', { id, label: editLabel, prompt: editPrompt });
    setIsEditing(false);
  };

  return (
    <>
      <Card className="min-w-[200px] max-w-[300px] bg-white border shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3 h-3 text-green-600" />
              <span className="font-medium text-xs text-gray-900">
                {data.label}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
              {!data.isStarting && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border leading-tight">
            {data.prompt.length > 80 
              ? `${data.prompt.substring(0, 80)}...` 
              : data.prompt
            }
          </div>
          
          {data.isStarting && (
            <div className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded text-center">
              Starting State
            </div>
          )}
        </CardContent>
        
        {/* Connection Handles */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Edit3 className="w-4 h-4" />
              Edit State: {data.label}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 mt-3">
            <div>
              <label className="text-xs font-medium mb-1 block">State Name</label>
              <Input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                placeholder="Enter state name"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium mb-1 block">Prompt</label>
              <Textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Enter the prompt for this state"
                className="min-h-[80px] text-xs"
              />
            </div>
            
            <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
              <strong>Tools (Optional)</strong>
              <p className="text-xs mt-1">
                Enable this state with capabilities such as calendar bookings, call
                termination, or your own custom functions.
              </p>
              <Button variant="outline" size="sm" className="mt-2 text-xs">
                + Add
              </Button>
            </div>
            
            <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
              <strong>MCPs (Optional)</strong>
              <p className="text-xs mt-1">
                Configure Model Context Protocol integrations for this state.
              </p>
              <Button variant="outline" size="sm" className="mt-2 text-xs">
                + Add
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="interruption" className="rounded" />
              <label htmlFor="interruption" className="text-xs">
                Enable State Interruption Sensitivity
              </label>
            </div>
            
            <div className="flex justify-end gap-2 pt-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});