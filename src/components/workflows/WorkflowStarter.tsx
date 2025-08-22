
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Calendar, User, UserCheck, MinusCircle, Tag, StickyNote, Bell, ArrowRight } from 'lucide-react';

interface WorkflowStarterProps {
  onSelectTrigger: (trigger: any) => void;
  onUseTemplate?: (template: any) => void;
}

const triggerTypes = [
  {
    id: 'contact-created',
    name: 'Contact Created',
    description: 'When a new contact is added to your system',
    icon: User,
    color: 'bg-green-100 text-green-600',
    category: 'contact'
  },
  {
    id: 'contact-changed',
    name: 'Contact Updated',
    description: 'When contact information is modified',
    icon: UserCheck,
    color: 'bg-blue-100 text-blue-600',
    category: 'contact'
  },
  {
    id: 'contact-tag',
    name: 'Contact Tagged',
    description: 'When a specific tag is added to a contact',
    icon: Tag,
    color: 'bg-purple-100 text-purple-600',
    category: 'contact'
  },
  {
    id: 'birthday-reminder',
    name: 'Birthday Reminder',
    description: 'Based on contact birthday dates',
    icon: Calendar,
    color: 'bg-pink-100 text-pink-600',
    category: 'schedule'
  },
  {
    id: 'note-added',
    name: 'Note Added',
    description: 'When a note is added to a contact',
    icon: StickyNote,
    color: 'bg-orange-100 text-orange-600',
    category: 'activity'
  },
  {
    id: 'task-reminder',
    name: 'Task Due',
    description: 'When a task becomes due',
    icon: Bell,
    color: 'bg-yellow-100 text-yellow-600',
    category: 'schedule'
  }
];

const workflowTemplates = [
  {
    id: 'welcome-sequence',
    name: 'Welcome New Contacts',
    description: 'Automatically welcome new contacts with a series of messages',
    trigger: 'contact-created',
    actionCount: 3,
    estimatedTime: '5 min setup'
  },
  {
    id: 'birthday-wishes',
    name: 'Birthday Wishes',
    description: 'Send birthday wishes to contacts automatically',
    trigger: 'birthday-reminder',
    actionCount: 2,
    estimatedTime: '3 min setup'
  },
  {
    id: 'follow-up-sequence',
    name: 'Follow-up Sequence',
    description: 'Follow up with tagged contacts over time',
    trigger: 'contact-tag',
    actionCount: 4,
    estimatedTime: '7 min setup'
  }
];

export function WorkflowStarter({ onSelectTrigger, onUseTemplate }: WorkflowStarterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Triggers' },
    { id: 'contact', name: 'Contact Events' },
    { id: 'schedule', name: 'Time-based' },
    { id: 'activity', name: 'Activity Events' }
  ];

  const filteredTriggers = selectedCategory === 'all' 
    ? triggerTypes 
    : triggerTypes.filter(trigger => trigger.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Start Your Workflow</h2>
        <p className="text-muted-foreground">
          Every workflow begins with a trigger. Choose what event should start your automation.
        </p>
      </div>

      {/* Quick Templates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Quick Start Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflowTemplates.map((template) => (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {template.actionCount} steps
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {template.estimatedTime}
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => onUseTemplate?.(template)}
                    className="group-hover:shadow-sm"
                  >
                    Use Template
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Trigger Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Or Choose a Custom Trigger</h3>
        
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Trigger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTriggers.map((trigger) => {
            const Icon = trigger.icon;
            return (
              <Card 
                key={trigger.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 group hover:border-blue-300"
                onClick={() => onSelectTrigger(trigger)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md ${trigger.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">{trigger.name}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {trigger.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
