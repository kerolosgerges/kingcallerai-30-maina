
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, UserPlus, UserCheck, Tag, UserX, MinusCircle, StickyNote, Copy, MessageCircle, Crown } from 'lucide-react';

interface ActionSidebarProps {
  onAddAction: (action: any) => void;
  onClose: () => void;
}

const actionCategories = {
  contact: [
    {
      id: 'find-contact',
      name: 'Find Contact',
      icon: User,
      color: 'bg-purple-100 text-purple-600',
      nodeType: 'find-contact'
    },
    {
      id: 'create-contact',
      name: 'Create Contact',
      icon: UserPlus,
      color: 'bg-green-100 text-green-600',
      nodeType: 'create-contact'
    },
    {
      id: 'update-contact-field',
      name: 'Update Contact Field',
      icon: UserCheck,
      color: 'bg-orange-100 text-orange-600',
      nodeType: 'update-contact-field'
    },
    {
      id: 'add-contact-tag',
      name: 'Add Contact Tag',
      icon: Tag,
      color: 'bg-purple-100 text-purple-600',
      nodeType: 'add-contact-tag'
    },
    {
      id: 'remove-contact-tag',
      name: 'Remove Contact Tag',
      icon: Tag,
      color: 'bg-red-100 text-red-600',
      nodeType: 'remove-contact-tag'
    },
    {
      id: 'assign-to-user',
      name: 'Assign To User',
      icon: UserCheck,
      color: 'bg-cyan-100 text-cyan-600',
      nodeType: 'assign-to-user'
    },
    {
      id: 'remove-assigned-user',
      name: 'Remove Assigned User',
      icon: UserX,
      color: 'bg-gray-100 text-gray-600',
      nodeType: 'remove-assigned-user'
    },
    {
      id: 'enable-disable-dnd',
      name: 'Enable/Disable DND',
      icon: MinusCircle,
      color: 'bg-yellow-100 text-yellow-600',
      nodeType: 'enable-disable-dnd'
    },
    {
      id: 'add-to-notes',
      name: 'Add To Notes',
      icon: StickyNote,
      color: 'bg-indigo-100 text-indigo-600',
      nodeType: 'add-to-notes'
    },
    {
      id: 'copy-contact',
      name: 'Copy Contact',
      icon: Copy,
      color: 'bg-pink-100 text-pink-600',
      nodeType: 'copy-contact',
      premium: true
    }
  ],
  communication: [
    {
      id: 'edit-conversation',
      name: 'Edit Conversation',
      icon: MessageCircle,
      color: 'bg-blue-100 text-blue-600',
      nodeType: 'edit-conversation'
    }
  ]
};

export function ActionSidebar({ onAddAction, onClose }: ActionSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const allActions = [...actionCategories.contact, ...actionCategories.communication];
  
  const filteredActions = allActions.filter(action =>
    action.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAction = (action: any) => {
    onAddAction(action);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Pick an action for this step
        </p>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search Actions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-blue-200 focus:border-blue-400 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Scrollable Content */} 
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-6">
          {/* Contact Actions */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Contact
            </h4>
            <div className="space-y-2">
              {actionCategories.contact
                .filter(action => 
                  action.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleSelectAction(action)}
                      className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group relative"
                    >
                      <div className={`p-2 rounded-md mr-3 ${action.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium flex-1">{action.name}</span>
                      {action.premium && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Communication Actions */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Communication
            </h4>
            <div className="space-y-2">
              {actionCategories.communication
                .filter(action => 
                  action.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleSelectAction(action)}
                      className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
                    >
                      <div className={`p-2 rounded-md mr-3 ${action.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{action.name}</span>
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
