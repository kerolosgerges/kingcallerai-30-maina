
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Calendar, User, UserCheck, MinusCircle, Tag, StickyNote, Bell } from 'lucide-react';

interface TriggerSidebarProps {
  onAddTrigger: (trigger: any) => void;
  onClose: () => void;
}

const triggerCategories = {
  contact: [
    {
      id: 'birthday-reminder',
      name: 'Birthday Reminder',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600',
      nodeType: 'birthday-reminder'
    },
    {
      id: 'contact-changed',
      name: 'Contact Changed',
      icon: UserCheck,
      color: 'bg-blue-100 text-blue-600',
      nodeType: 'contact-changed'
    },
    {
      id: 'contact-created',
      name: 'Contact Created',
      icon: User,
      color: 'bg-green-100 text-green-600',
      nodeType: 'contact-created'
    },
    {
      id: 'contact-dnd',
      name: 'Contact DND',
      icon: MinusCircle,
      color: 'bg-red-100 text-red-600',
      nodeType: 'contact-dnd'
    },
    {
      id: 'contact-tag',
      name: 'Contact Tag',
      icon: Tag,
      color: 'bg-yellow-100 text-yellow-600',
      nodeType: 'contact-tag'
    }
  ],
  activity: [
    {
      id: 'note-added',
      name: 'Note Added',
      icon: StickyNote,
      color: 'bg-orange-100 text-orange-600',
      nodeType: 'note-added'
    },
    {
      id: 'task-added',
      name: 'Task Added',
      icon: UserCheck,
      color: 'bg-cyan-100 text-cyan-600',
      nodeType: 'task-added'
    },
    {
      id: 'task-reminder',
      name: 'Task Reminder',
      icon: Bell,
      color: 'bg-purple-100 text-purple-600',
      nodeType: 'task-reminder'
    }
  ]
};

export function TriggerSidebar({ onAddTrigger, onClose }: TriggerSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const allTriggers = [...triggerCategories.contact, ...triggerCategories.activity];
  
  const filteredTriggers = allTriggers.filter(trigger =>
    trigger.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTrigger = (trigger: any) => {
    onAddTrigger(trigger);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Adds a workflow trigger, and on execution, the Contact gets added to the workflow.
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search Trigger"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-xs"
          />
        </div>

        {/* Add New Trigger Button */}
        <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center bg-purple-50">
          <Button
            variant="ghost"
            className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Trigger
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-6">
          {/* Contact Triggers */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Contact
            </h4>
            <div className="space-y-2">
              {triggerCategories.contact
                .filter(trigger => 
                  trigger.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((trigger) => {
                  const Icon = trigger.icon;
                  return (
                    <button
                      key={trigger.id}
                      onClick={() => handleSelectTrigger(trigger)}
                      className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
                    >
                      <div className={`p-2 rounded-md mr-3 ${trigger.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{trigger.name}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Activity Triggers */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Activity
            </h4>
            <div className="space-y-2">
              {triggerCategories.activity
                .filter(trigger => 
                  trigger.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((trigger) => {
                  const Icon = trigger.icon;
                  return (
                    <button
                      key={trigger.id}
                      onClick={() => handleSelectTrigger(trigger)}
                      className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
                    >
                      <div className={`p-2 rounded-md mr-3 ${trigger.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{trigger.name}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
