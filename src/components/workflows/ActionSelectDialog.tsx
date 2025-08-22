import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Search, User, UserPlus, UserCheck, Tag, TagIcon, UserX, MinusCircle, StickyNote, Copy, MessageCircle, Crown } from 'lucide-react';

interface ActionSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAction: (action: any) => void;
}

const actionCategories = {
  contact: [
    {
      id: 'create-contact',
      name: 'Create Contact',
      description: 'Create a new contact',
      icon: UserPlus,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'find-contact',
      name: 'Find Contact',
      description: 'Search for existing contact',
      icon: User,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'update-contact-field',
      name: 'Update Contact Field',
      description: 'Modify contact information',
      icon: UserCheck,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'add-contact-tag',
      name: 'Add Contact Tag',
      description: 'Add a tag to contact',
      icon: Tag,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'remove-contact-tag',
      name: 'Remove Contact Tag',
      description: 'Remove a tag from contact',
      icon: TagIcon,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'assign-to-user',
      name: 'Assign To User',
      description: 'Assign contact to a user',
      icon: UserCheck,
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      id: 'remove-assigned-user',
      name: 'Remove Assigned User',
      description: 'Unassign contact from user',
      icon: UserX,
      color: 'bg-gray-100 text-gray-600'
    },
    {
      id: 'enable-disable-dnd',
      name: 'Enable/Disable DND',
      description: 'Toggle Do Not Disturb status',
      icon: MinusCircle,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'add-to-notes',
      name: 'Add To Notes',
      description: 'Add a note to contact',
      icon: StickyNote,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 'copy-contact',
      name: 'Copy Contact',
      description: 'Duplicate contact information',
      icon: Copy,
      color: 'bg-pink-100 text-pink-600',
      premium: true
    }
  ],
  communication: [
    {
      id: 'edit-conversation',
      name: 'Edit Conversation',
      description: 'Modify conversation details',
      icon: MessageCircle,
      color: 'bg-blue-100 text-blue-600'
    }
  ]
};

export const ActionSelectDialog = ({ open, onOpenChange, onSelectAction }: ActionSelectDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all-actions');

  const allActions = [...actionCategories.contact, ...actionCategories.communication];
  
  const filteredActions = allActions.filter(action =>
    action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAction = (action: any) => {
    onSelectAction(action);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Actions</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Pick an action for this step
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all-actions" className="text-xs">All actions</TabsTrigger>
              <TabsTrigger value="discover" className="text-xs">Discover</TabsTrigger>
            </TabsList>

            <TabsContent value="all-actions" className="mt-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Contact</h3>
                  <div className="space-y-2">
                    {actionCategories.contact
                      .filter(action => 
                        action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        action.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((action) => {
                        const Icon = action.icon;
                        return (
                          <Button
                            key={action.id}
                            variant="ghost"
                            className="w-full justify-start h-auto p-3 hover:bg-muted relative"
                            onClick={() => handleSelectAction(action)}
                          >
                            <div className={`p-2 rounded-md mr-3 ${action.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-left flex-1">
                              <div className="text-sm font-medium">{action.name}</div>
                              <div className="text-xs text-muted-foreground">{action.description}</div>
                            </div>
                            {action.premium && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                          </Button>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Communication</h3>
                  <div className="space-y-2">
                    {actionCategories.communication
                      .filter(action => 
                        action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        action.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((action) => {
                        const Icon = action.icon;
                        return (
                          <Button
                            key={action.id}
                            variant="ghost"
                            className="w-full justify-start h-auto p-3 hover:bg-muted"
                            onClick={() => handleSelectAction(action)}
                          >
                            <div className={`p-2 rounded-md mr-3 ${action.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-medium">{action.name}</div>
                              <div className="text-xs text-muted-foreground">{action.description}</div>
                            </div>
                          </Button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discover" className="mt-4">
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  <div className="text-2xl mb-2">🔍</div>
                  <p className="text-sm">Discover new actions</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};