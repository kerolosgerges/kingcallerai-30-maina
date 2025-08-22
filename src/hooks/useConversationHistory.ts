
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Conversation, ConversationFilter } from '@/types/conversation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useConversationHistory = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  // Only load conversations when on conversations page
  const isConversationsPage = location.pathname.includes('/conversations');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<ConversationFilter>({});

  // Mock data for demonstration
  const mockConversations: Conversation[] = [
    {
      id: '1',
      agentId: 'agent-1',
      agentName: 'Customer Support Agent',
      userId: 'user-1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() - 3300000),
      duration: 300,
      status: 'completed',
      messages: [
        {
          id: 'm1',
          type: 'agent',
          content: 'Hello! How can I help you today?',
          timestamp: new Date(Date.now() - 3600000),
          confidence: 0.95,
          sentiment: 'positive'
        },
        {
          id: 'm2',
          type: 'user',
          content: 'I need help with my account',
          timestamp: new Date(Date.now() - 3580000),
          confidence: 0.92,
          sentiment: 'neutral'
        }
      ],
      metadata: {
        phoneNumber: '+1234567890',
        tags: ['support', 'account'],
        customFields: {},
        analytics: {
          wordsSpoken: 156,
          averageResponseTime: 2.3,
          interruptionCount: 1,
          satisfactionScore: 8
        }
      }
    }
  ];

  const applyFilter = (conversations: Conversation[], filter: ConversationFilter): Conversation[] => {
    return conversations.filter(conversation => {
      // Date range filter
      if (filter.dateRange) {
        const convDate = conversation.startTime;
        if (convDate < filter.dateRange.start || convDate > filter.dateRange.end) {
          return false;
        }
      }

      // Agent filter
      if (filter.agentIds && filter.agentIds.length > 0) {
        if (!filter.agentIds.includes(conversation.agentId)) {
          return false;
        }
      }

      // Status filter
      if (filter.status && filter.status.length > 0) {
        if (!filter.status.includes(conversation.status)) {
          return false;
        }
      }

      // Tags filter
      if (filter.tags && filter.tags.length > 0) {
        const hasMatchingTag = filter.tags.some(tag => 
          conversation.metadata.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Search query
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const searchableText = [
          conversation.agentName,
          conversation.userName,
          conversation.userEmail,
          ...conversation.messages.map(m => m.content),
          ...conversation.metadata.tags
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Duration filter
      if (filter.minDuration && conversation.duration && conversation.duration < filter.minDuration) {
        return false;
      }
      if (filter.maxDuration && conversation.duration && conversation.duration > filter.maxDuration) {
        return false;
      }

      return true;
    });
  };

  const exportConversations = async (format: 'csv' | 'json' | 'xlsx', conversationIds?: string[]) => {
    try {
      setLoading(true);
      
      const dataToExport = conversationIds 
        ? conversations.filter(c => conversationIds.includes(c.id))
        : filteredConversations;

      let exportData: any;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'csv':
          const csvHeaders = ['ID', 'Agent', 'User', 'Start Time', 'Duration', 'Status', 'Messages Count'];
          const csvRows = dataToExport.map(conv => [
            conv.id,
            conv.agentName,
            conv.userName || 'Anonymous',
            conv.startTime.toISOString(),
            conv.duration || 0,
            conv.status,
            conv.messages.length
          ]);
          
          exportData = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
          filename = `conversations_${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;

        case 'json':
          exportData = JSON.stringify(dataToExport, null, 2);
          filename = `conversations_${Date.now()}.json`;
          mimeType = 'application/json';
          break;

        case 'xlsx':
          // For XLSX, you'd typically use a library like xlsx or exceljs
          // For now, we'll use JSON format
          exportData = JSON.stringify(dataToExport, null, 2);
          filename = `conversations_${Date.now()}.json`;
          mimeType = 'application/json';
          break;
      }

      // Create and download file
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export completed",
        description: `${dataToExport.length} conversations exported successfully`
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteConversations = async (conversationIds: string[]): Promise<boolean> => {
    try {
      setLoading(true);
      
      const updatedConversations = conversations.filter(
        conv => !conversationIds.includes(conv.id)
      );
      
      setConversations(updatedConversations);
      
      toast({
        title: "Conversations deleted",
        description: `${conversationIds.length} conversations deleted successfully`
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete conversations",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && conversations.length === 0 && isConversationsPage) {
      // Wait for page to be fully loaded before loading conversations
      const timeoutId = setTimeout(() => {
        setLoading(true);
        setConversations(mockConversations);
        setLoading(false);
      }, 100); // Small delay to ensure page is loaded

      return () => clearTimeout(timeoutId);
    }
  }, [currentUser, conversations.length, isConversationsPage]);

  useEffect(() => {
    const filtered = applyFilter(conversations, filter);
    setFilteredConversations(filtered);
  }, [conversations, filter]);

  return {
    conversations: filteredConversations,
    loading,
    filter,
    setFilter,
    exportConversations,
    deleteConversations
  };
};
