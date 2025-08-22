import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Phone, MessageCircle, GitBranch, Zap, PhoneOff, User, Calendar, Tag, Wrench, Globe, Clock, Mail } from 'lucide-react';

const iconMap = {
  start: Phone,
  say: MessageCircle,
  gather: User,
  'if-else': GitBranch,
  'api-request': Zap,
  'end-call': PhoneOff,
  'transfer-call': Phone,
  'webhook-trigger': Globe,
  'schedule-trigger': Clock,
  'email-trigger': Mail,
  conversation: MessageCircle,
  'google-calendar': Calendar,
  calendly: Calendar,
  tag: Tag,
  tool: Wrench,
};

const getNodeColor = (nodeType: string) => {
  switch (nodeType) {
    case 'start':
    case 'webhook-trigger':
    case 'schedule-trigger':
    case 'email-trigger':
    case 'add-new-trigger':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'end-call':
    case 'end':
      return 'bg-red-100 border-red-300 text-red-800';
    case 'if-else':
    case 'find-contact':
      return 'bg-purple-100 border-purple-300 text-purple-800';
    case 'contact-found':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'contact-not-found':
      return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'api-request':
      return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'transfer-call':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    default:
      return 'bg-blue-100 border-blue-300 text-blue-800';
  }
};

export const CustomNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const Icon = iconMap[data.nodeType as keyof typeof iconMap] || MessageCircle;
  const colorClass = getNodeColor(data.nodeType);
  
  // Special handling for trigger nodes
  if (data.nodeType === 'add-new-trigger') {
    return (
      <div className="px-4 py-3 rounded-lg border-2 border-dashed border-purple-300 min-w-[200px] bg-purple-50 text-purple-600">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">+</span>
          <span className="font-medium text-sm">{data.label}</span>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-purple-400 !border-2 !border-white"
        />
      </div>
    );
  }
  
  // Special handling for conditional branches
  if (data.nodeType === 'contact-found' || data.nodeType === 'contact-not-found') {
    return (
      <div className={`
        px-4 py-3 rounded-lg border-2 min-w-[150px] shadow-sm
        ${colorClass}
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        transition-all duration-200 hover:shadow-md
      `}>
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
        />
        
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {data.label}
            </div>
            <div className="text-xs opacity-75 truncate">
              {data.description || (data.nodeType === 'contact-found' ? 'Contact Found' : 'Contact Not Found')}
            </div>
          </div>
        </div>
        
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
        />
      </div>
    );
  }
  
  return (
    <div className={`
      px-4 py-3 rounded-lg border-2 min-w-[150px] shadow-sm
      ${colorClass}
      ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      transition-all duration-200 hover:shadow-md
    `}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />
      
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {data.label}
          </div>
          {data.description && (
            <div className="text-xs opacity-75 truncate">
              {data.description}
            </div>
          )}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />
      
      {/* Multiple outputs for if-else nodes */}
      {data.nodeType === 'if-else' && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="w-3 h-3 !bg-green-500 !border-2 !border-white"
            style={{ left: '25%' }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="w-3 h-3 !bg-red-500 !border-2 !border-white"
            style={{ left: '75%' }}
          />
        </>
      )}
    </div>
  );
};

export const nodeTypes = {
  custom: CustomNode,
};