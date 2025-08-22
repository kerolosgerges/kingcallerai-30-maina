import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Search, Calendar, User, UserCheck, UserX, Tag, MinusCircle, StickyNote, Edit3, Bell, Crown } from 'lucide-react';

interface TriggerSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTrigger: (trigger: any) => void;
}

const triggerCategories = {
  contact: [
    {
      id: 'birthday-reminder',
      name: 'Birthday Reminder',
      description: 'Triggers on contact birthday',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'contact-changed',
      name: 'Contact Changed',
      description: 'When contact information is updated',
      icon: UserCheck,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'contact-created',
      name: 'Contact Created',
      description: 'When a new contact is created',
      icon: User,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'contact-dnd',
      name: 'Contact DND',
      description: 'When contact DND status changes',
      icon: MinusCircle,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'contact-tag',
      name: 'Contact Tag',
      description: 'When a tag is added to contact',
      icon: Tag,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'custom-date-reminder',
      name: 'Custom Date Reminder',
      description: 'Triggers on custom date field',
      icon: Calendar,
      color: 'bg-indigo-100 text-indigo-600'
    }
  ],
  activity: [
    {
      id: 'note-added',
      name: 'Note Added',
      description: 'When a note is added to contact',
      icon: StickyNote,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'note-changed',
      name: 'Note Changed',
      description: 'When a note is modified',
      icon: Edit3,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 'task-added',
      name: 'Task Added',
      description: 'When a task is created',
      icon: UserCheck,
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      id: 'task-reminder',
      name: 'Task Reminder',
      description: 'Task reminder notification',
      icon: Bell,
      color: 'bg-purple-100 text-purple-600'
    }
  ]
};

export const TriggerSelectDialog = ({ open, onOpenChange, onSelectTrigger }: TriggerSelectDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all-triggers');

  const allTriggers = [...triggerCategories.contact, ...triggerCategories.activity];
  
  const filteredTriggers = allTriggers.filter(trigger =>
    trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trigger.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTrigger = (trigger: any) => {
    onSelectTrigger(trigger);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Workflow Trigger</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Adds a workflow trigger, and on execution, the Contact gets added to the workflow.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search Trigger"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all-triggers" className="text-xs">All triggers</TabsTrigger>
              <TabsTrigger value="discover" className="text-xs">Discover</TabsTrigger>
            </TabsList>

            <TabsContent value="all-triggers" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Contact</h3>
                  <div className="space-y-2">
                    {triggerCategories.contact
                      .filter(trigger => 
                        trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        trigger.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((trigger) => {
                        const Icon = trigger.icon;
                        return (
                          <Button
                            key={trigger.id}
                            variant="ghost"
                            className="w-full justify-start h-auto p-3 hover:bg-muted"
                            onClick={() => handleSelectTrigger(trigger)}
                          >
                            <div className={`p-2 rounded-md mr-3 ${trigger.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-medium">{trigger.name}</div>
                              <div className="text-xs text-muted-foreground">{trigger.description}</div>
                            </div>
                          </Button>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Activity</h3>
                  <div className="space-y-2">
                    {triggerCategories.activity
                      .filter(trigger => 
                        trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        trigger.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((trigger) => {
                        const Icon = trigger.icon;
                        return (
                          <Button
                            key={trigger.id}
                            variant="ghost"
                            className="w-full justify-start h-auto p-3 hover:bg-muted"
                            onClick={() => handleSelectTrigger(trigger)}
                          >
                            <div className={`p-2 rounded-md mr-3 ${trigger.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-medium">{trigger.name}</div>
                              <div className="text-xs text-muted-foreground">{trigger.description}</div>
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
                  <p className="text-sm">Discover new triggers</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};