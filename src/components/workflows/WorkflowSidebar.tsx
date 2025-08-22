import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Calendar, User, UserCheck, UserX, Tag, MinusCircle, StickyNote, Edit3, Bell, Crown, UserPlus, Copy, MessageCircle } from 'lucide-react';

interface WorkflowSidebarProps {
  workflow: any;
  onAddTrigger?: (trigger: any) => void;
  onAddAction?: (action: any) => void;
}

const triggerCategories = {
  contact: [
    {
      id: 'birthday-reminder',
      name: 'Birthday Reminder',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'contact-changed',
      name: 'Contact Changed',
      icon: UserCheck,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'contact-created',
      name: 'Contact Created',
      icon: User,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'contact-dnd',
      name: 'Contact DND',
      icon: MinusCircle,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'contact-tag',
      name: 'Contact Tag',
      icon: Tag,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ],
  activity: [
    {
      id: 'note-added',
      name: 'Note Added',
      icon: StickyNote,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'task-added',
      name: 'Task Added',
      icon: UserCheck,
      color: 'bg-cyan-100 text-cyan-600'
    }
  ]
};

const actionCategories = {
  contact: [
    {
      id: 'create-contact',
      name: 'Create Contact',
      icon: UserPlus,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'find-contact',
      name: 'Find Contact',
      icon: User,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'update-contact-field',
      name: 'Update Contact Field',
      icon: UserCheck,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'add-contact-tag',
      name: 'Add Contact Tag',
      icon: Tag,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'copy-contact',
      name: 'Copy Contact',
      icon: Copy,
      color: 'bg-pink-100 text-pink-600',
      premium: true
    }
  ],
  communication: [
    {
      id: 'edit-conversation',
      name: 'Edit Conversation',
      icon: MessageCircle,
      color: 'bg-blue-100 text-blue-600'
    }
  ]
};

export function WorkflowSidebar({ workflow, onAddTrigger, onAddAction }: WorkflowSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('triggers');

  const allTriggers = [...triggerCategories.contact, ...triggerCategories.activity];
  const allActions = [...actionCategories.contact, ...actionCategories.communication];

  const filteredTriggers = allTriggers.filter(trigger =>
    trigger.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActions = allActions.filter(action =>
    action.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTrigger = (trigger: any) => {
    // Keep sidebar open and add trigger to workflow
    if (onAddTrigger) {
      onAddTrigger(trigger);
    }
  };

  const handleAddAction = (action: any) => {
    // Keep sidebar open and add action to workflow
    if (onAddAction) {
      onAddAction(action);
    }
  };

  return (
    <Sidebar className="w-80" variant="sidebar" collapsible="icon">
      <SidebarContent className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-xs"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="triggers" className="text-xs">Triggers</TabsTrigger>
              <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="triggers" className="mt-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs">Add New Trigger</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="space-y-4">
                    {/* Add New Trigger Button */}
                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center bg-purple-50">
                      <Button
                        variant="ghost"
                        className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                        onClick={() => setActiveTab('triggers')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Trigger
                      </Button>
                    </div>

                    {/* Contact Triggers */}
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground mb-2">Contact</h3>
                      <SidebarMenu>
                        {triggerCategories.contact
                          .filter(trigger => 
                            trigger.name.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((trigger) => {
                            const Icon = trigger.icon;
                            return (
                              <SidebarMenuItem key={trigger.id}>
                                <SidebarMenuButton
                                  onClick={() => handleAddTrigger(trigger)}
                                  className="w-full justify-start h-auto p-2"
                                >
                                  <div className={`p-1 rounded-md mr-2 ${trigger.color}`}>
                                    <Icon className="h-3 w-3" />
                                  </div>
                                  <span className="text-xs">{trigger.name}</span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                      </SidebarMenu>
                    </div>

                    {/* Activity Triggers */}
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground mb-2">Activity</h3>
                      <SidebarMenu>
                        {triggerCategories.activity
                          .filter(trigger => 
                            trigger.name.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((trigger) => {
                            const Icon = trigger.icon;
                            return (
                              <SidebarMenuItem key={trigger.id}>
                                <SidebarMenuButton
                                  onClick={() => handleAddTrigger(trigger)}
                                  className="w-full justify-start h-auto p-2"
                                >
                                  <div className={`p-1 rounded-md mr-2 ${trigger.color}`}>
                                    <Icon className="h-3 w-3" />
                                  </div>
                                  <span className="text-xs">{trigger.name}</span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                      </SidebarMenu>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </TabsContent>

            <TabsContent value="actions" className="mt-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs">Actions</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="space-y-4">
                    {/* Contact Actions */}
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground mb-2">Contact</h3>
                      <SidebarMenu>
                        {actionCategories.contact
                          .filter(action => 
                            action.name.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((action) => {
                            const Icon = action.icon;
                            return (
                              <SidebarMenuItem key={action.id}>
                                <SidebarMenuButton
                                  onClick={() => handleAddAction(action)}
                                  className="w-full justify-start h-auto p-2"
                                >
                                  <div className={`p-1 rounded-md mr-2 ${action.color}`}>
                                    <Icon className="h-3 w-3" />
                                  </div>
                                  <span className="text-xs flex-1">{action.name}</span>
                                  {action.premium && (
                                    <Crown className="h-3 w-3 text-yellow-500" />
                                  )}
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                      </SidebarMenu>
                    </div>

                    {/* Communication Actions */}
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground mb-2">Communication</h3>
                      <SidebarMenu>
                        {actionCategories.communication
                          .filter(action => 
                            action.name.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((action) => {
                            const Icon = action.icon;
                            return (
                              <SidebarMenuItem key={action.id}>
                                <SidebarMenuButton
                                  onClick={() => handleAddAction(action)}
                                  className="w-full justify-start h-auto p-2"
                                >
                                  <div className={`p-1 rounded-md mr-2 ${action.color}`}>
                                    <Icon className="h-3 w-3" />
                                  </div>
                                  <span className="text-xs">{action.name}</span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                      </SidebarMenu>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}