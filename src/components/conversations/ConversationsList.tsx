
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { Conversation } from "@/types/conversation";

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onConversationSelect: (conversation: Conversation) => void;
}

export const ConversationsList = ({
  conversations,
  selectedConversation,
  onConversationSelect
}: ConversationsListProps) => {
  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      case 'abandoned':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getChannelIcon = (tags: string[]) => {
    if (tags.includes('WhatsApp')) return '💬';
    if (tags.includes('Twitter')) return '🐦';
    if (tags.includes('Instagram')) return '📷';
    return '📞';
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const isSelected = selectedConversation?.id === conversation.id;
        
        return (
          <div
            key={conversation.id}
            onClick={() => onConversationSelect(conversation)}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
              isSelected ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {getInitials(conversation.userName || 'Unknown')}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`}></div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-sm truncate">
                      {conversation.userName || 'Unknown Contact'}
                    </h3>
                    {conversation.metadata.tags.includes('WhatsApp') && (
                      <span className="text-green-600 text-xs">WhatsApp</span>
                    )}
                    {conversation.metadata.tags.includes('Twitter') && (
                      <span className="text-blue-600 text-xs">Twitter</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(conversation.startTime, { addSuffix: false })}
                  </span>
                </div>

                {/* Last message preview */}
                {lastMessage && (
                  <p className="text-sm text-gray-600 truncate">
                    {lastMessage.type === 'user' ? '' : 'You: '}
                    {truncateMessage(lastMessage.content)}
                  </p>
                )}

                {/* Tags */}
                <div className="flex items-center space-x-2 mt-2">
                  {conversation.metadata.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {conversation.status === 'active' && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
