
export interface Conversation {
  id: string;
  agentId: string;
  agentName: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  messages: ConversationMessage[];
  metadata: ConversationMetadata;
  recordings?: ConversationRecording[];
}

export interface ConversationMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  sender?: string;
  status?: 'sent' | 'delivered' | 'read' | 'received';
  audioUrl?: string;
  confidence?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface ConversationMetadata {
  phoneNumber?: string;
  location?: string;
  userAgent?: string;
  referrer?: string;
  tags: string[];
  customFields: Record<string, any>;
  analytics: {
    wordsSpoken: number;
    averageResponseTime: number;
    interruptionCount: number;
    satisfactionScore?: number;
  };
}

export interface ConversationRecording {
  id: string;
  type: 'full' | 'snippet';
  url: string;
  duration: number;
  size: number;
  format: string;
  createdAt: Date;
}

export interface ConversationFilter {
  dateRange?: { start: Date; end: Date };
  agentIds?: string[];
  status?: string[];
  tags?: string[];
  searchQuery?: string;
  minDuration?: number;
  maxDuration?: number;
}
