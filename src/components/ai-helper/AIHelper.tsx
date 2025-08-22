
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Sparkles, Bot, User, Code, FileText, Users, Phone, Zap, Brain, Mail, Workflow, Wrench, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    action?: string;
    data?: any;
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  prompt: string;
  category: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'create-assistant',
    title: 'Create Assistant',
    description: 'Build a new AI assistant',
    icon: Brain,
    prompt: 'Help me create a new AI assistant',
    category: 'Assistants'
  },
  {
    id: 'add-contact',
    title: 'Add Contact',
    description: 'Add a new contact to your database',
    icon: Users,
    prompt: 'I want to add a new contact',
    category: 'Contacts'
  },
  {
    id: 'create-campaign',
    title: 'Create Campaign',
    description: 'Launch a new marketing campaign',
    icon: Mail,
    prompt: 'Help me create a marketing campaign',
    category: 'Campaigns'
  },
  {
    id: 'build-workflow',
    title: 'Build Workflow',
    description: 'Create an automated workflow',
    icon: Workflow,
    prompt: 'I need to build a new workflow',
    category: 'Workflows'
  },
  {
    id: 'create-tool',
    title: 'Create Tool',
    description: 'Build a custom tool or integration',
    icon: Wrench,
    prompt: 'Help me create a custom tool',
    category: 'Tools'
  },
  {
    id: 'view-analytics',
    title: 'View Analytics',
    description: 'Analyze your performance data',
    icon: BarChart3,
    prompt: 'Show me my analytics and performance data',
    category: 'Analytics'
  }
];

export const AIHelper = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hi! I'm your AI Helper. I can assist you with creating assistants, managing contacts, building campaigns, setting up workflows, and much more. What would you like to do today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('assistant') || input.includes('agent')) {
      return "I can help you create a new AI assistant! Here's what I need:\n\n📝 **Assistant Details:**\n• Name for your assistant\n• Primary purpose/role\n• System prompt/instructions\n• Voice preference\n• Model type (GPT-4, etc.)\n\nWould you like me to guide you through creating one step by step?";
    }
    
    if (input.includes('contact')) {
      return "Let's add a new contact to your database! I can help you with:\n\n👤 **Contact Information:**\n• Name and email\n• Phone number\n• Company details\n• Tags and categories\n• Custom fields\n\nWhat contact information do you have ready?";
    }
    
    if (input.includes('campaign')) {
      return "Great! I'll help you create a marketing campaign. Here's what we can set up:\n\n📧 **Campaign Setup:**\n• Campaign name and type\n• Target audience\n• Message templates\n• Scheduling options\n• Success metrics\n\nWhat type of campaign are you planning?";
    }
    
    if (input.includes('workflow')) {
      return "I can help you build an automated workflow! Here are the possibilities:\n\n⚡ **Workflow Options:**\n• Call flows and routing\n• Contact management automation\n• Campaign triggers\n• Integration workflows\n• Custom business logic\n\nWhat process would you like to automate?";
    }
    
    if (input.includes('tool')) {
      return "Let's create a custom tool for your platform! I can help with:\n\n🔧 **Tool Development:**\n• API integrations\n• Custom functions\n• Data processing tools\n• Third-party connections\n• Webhook endpoints\n\nWhat functionality do you need?";
    }
    
    if (input.includes('analytics') || input.includes('data') || input.includes('report')) {
      return "I can help you analyze your performance data! Here's what I can show you:\n\n📊 **Analytics Options:**\n• Call performance metrics\n• Campaign success rates\n• Contact engagement data\n• Revenue and conversion tracking\n• Custom reports\n\nWhat specific metrics are you interested in?";
    }
    
    // Default response
    return "I understand you'd like help with that! I can assist you with creating assistants, managing contacts, building campaigns, setting up workflows, creating tools, and analyzing your data. Could you be more specific about what you'd like to accomplish?";
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Helper</h1>
              <p className="text-gray-600">Your intelligent assistant for managing the platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/50 border-b border-gray-200/50 p-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <motion.div
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-blue-50/80 hover:border-blue-200 border-gray-200 bg-white/80 backdrop-blur-sm"
                  onClick={() => handleQuickAction(action)}
                >
                  <action.icon className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-medium text-center leading-tight">{action.title}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-600' 
                          : 'bg-gradient-to-br from-purple-500 to-blue-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>
                      
                      <Card className={`${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50'
                      }`}>
                        <CardContent className="p-4">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                          <div className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    
                    <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about managing your platform..."
                className="min-h-[60px] max-h-[120px] resize-none border border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white/80 backdrop-blur-sm"
                disabled={isTyping}
              />
            </div>
            
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-[60px] px-6 shadow-sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
