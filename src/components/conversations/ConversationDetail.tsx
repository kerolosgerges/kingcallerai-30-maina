
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSubAccount } from "@/contexts/SubAccountContext";
import { serviceRegistry } from "@/services/ServiceRegistry";
import { 
  X, 
  MoreHorizontal, 
  Send, 
  Paperclip, 
  Smile,
  Plus,
  Tag as TagIcon,
  Info,
  Check,
  CheckCheck,
  Clock,
  User,
  Settings,
  MessageSquare,
  Phone
} from "lucide-react";
import { format } from "date-fns";
import type { Conversation } from "@/types/conversation";

interface ConversationDetailProps {
  conversation: Conversation;
  agents?: any[];
  isLoadingAgents?: boolean;
  onCallWithAgent?: (contact: any, agentId: string, agentName: string) => void;
  onClose: () => void;
}

// Timeline activity interface
interface TimelineActivity {
  id: string;
  type: 'contact_created' | 'automation_triggered' | 'sms_sent' | 'agent_called' | 'email_sent' | 'note_added';
  title: string;
  description: string;
  timestamp: Date;
  icon: any;
}

// Dummy timeline data
const getDummyTimelineData = (): TimelineActivity[] => {
  const now = new Date();
  return [
    {
      id: '1',
      type: 'contact_created',
      title: 'Contact Created',
      description: 'Contact was added to the system',
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      icon: User
    },
    {
      id: '2',
      type: 'automation_triggered',
      title: 'Automation Triggered',
      description: 'Welcome sequence automation was started',
      timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      icon: Settings
    },
    {
      id: '3',
      type: 'sms_sent',
      title: 'SMS Sent',
      description: 'Welcome SMS message sent successfully',
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      icon: MessageSquare
    },
    {
      id: '4',
      type: 'agent_called',
      title: 'Agent Called',
      description: 'AI agent initiated phone call - Duration: 3m 45s',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: Phone
    },
    {
      id: '5',
      type: 'email_sent',
      title: 'Email Sent',
      description: 'Follow-up email campaign delivered',
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      icon: MessageSquare
    },
    {
      id: '6',
      type: 'note_added',
      title: 'Note Added',
      description: 'Contact expressed interest in premium plan',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: Plus
    }
  ];
};

export const ConversationDetail = ({ 
  conversation, 
  agents = [], 
  isLoadingAgents = false, 
  onCallWithAgent,
  onClose 
}: ConversationDetailProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messages, setMessages] = useState(conversation.messages?.map(msg => ({
    ...msg,
    status: msg.type === 'user' ? 'delivered' : 'received'
  })) || []);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(undefined);
  const [callResult, setCallResult] = useState<any>(null);

  const { toast } = useToast();
  const { currentSubAccount } = useSubAccount();

  const handleCall = async () => {
    if (!selectedAgentId || !conversation?.metadata?.phoneNumber || !currentSubAccount?.id) return;
    try {
      const response = await fetch("https://voiceai.kingcaller.ai/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          agent_id: selectedAgentId,
          recipient_phone_number: conversation.metadata.phoneNumber,
          saas_id: currentSubAccount.id
        })
      });
      const data = await response.json();
      setCallResult(data);
      console.log("Call API result:", data);
    } catch (error) {
      setCallResult({ error: String(error) });
      console.log("Call API error:", error);
    }
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentSubAccount) return;
    
    setIsSendingMessage(true);
    try {
      // Add user message immediately to UI
      const userMessage = {
        id: `temp_${Date.now()}`,
        type: 'user' as const,
        content: newMessage.trim(),
        timestamp: new Date(),
        sender: 'user',
        status: 'sent' as const
      };
      
      setMessages(prev => [...prev, userMessage]);
      const messageContent = newMessage.trim();
      setNewMessage("");

      // Save to Firebase
      const success = await serviceRegistry.contactService.addMessageToConversation(
        currentSubAccount.id,
        conversation.id,
        {
          content: messageContent,
          type: 'user',
          sender: 'user'
        }
      );

      if (success) {
        // Update message status to delivered after a short delay
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === userMessage.id ? { ...msg, status: 'delivered' as const } : msg
          ));
        }, 1000);

        // Update to read status after another delay
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === userMessage.id ? { ...msg, status: 'read' as const } : msg
          ));
        }, 2000);

        // Simulate agent response after a short delay
        setTimeout(async () => {
          const agentResponse = {
            id: `agent_${Date.now()}`,
            type: 'agent' as const,
            content: `Thank you for your message: "${messageContent}". How can I assist you further?`,
            timestamp: new Date(),
            sender: 'agent',
            status: 'received' as const
          };
          
          setMessages(prev => [...prev, agentResponse]);
          
          // Save agent response to Firebase
          await serviceRegistry.contactService.addMessageToConversation(
            currentSubAccount.id,
            conversation.id,
            {
              content: agentResponse.content,
              type: 'agent',
              sender: 'agent'
            }
          );
        }, 1500);
      } else {
        // Remove the temporary message if save failed
        setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !currentSubAccount) return;
    
    setIsAddingNote(true);
    try {
      const success = await serviceRegistry.contactService.addNoteToContact(
        currentSubAccount.id,
        conversation.id,
        newNote.trim()
      );
      
      if (success) {
        setNewNote("");
        toast({
          title: "Note added",
          description: "Note has been saved to the contact",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add note",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim() || !currentSubAccount) return;
    
    setIsAddingTag(true);
    try {
      const success = await serviceRegistry.contactService.addTagToContact(
        currentSubAccount.id,
        conversation.id,
        newTag.trim()
      );
      
      if (success) {
        setNewTag("");
        toast({
          title: "Tag added",
          description: "Tag has been added to the contact",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add tag",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      });
    } finally {
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!currentSubAccount) return;
    
    try {
      const success = await serviceRegistry.contactService.removeTagFromContact(
        currentSubAccount.id,
        conversation.id,
        tag
      );
      
      if (success) {
        toast({
          title: "Tag removed",
          description: "Tag has been removed from the contact",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to remove tag",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove tag",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex max-w-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Chat Header - Fixed */}
        <div className="bg-white border-b p-4 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center space-x-3 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback>
                {getInitials(conversation.userName || 'Unknown')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="font-semibold truncate">{conversation.userName}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 truncate">{conversation.userEmail}</span>
                {conversation.metadata.tags.includes('WhatsApp') && (
                  <span className="text-green-600 text-xs whitespace-nowrap">WhatsApp</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 bg-gray-50 overflow-hidden relative">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 pb-20">
              {messages.map((message, index) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}>
                  <div className={`relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground ml-12' 
                      : message.type === 'agent'
                      ? 'bg-white border shadow-sm mr-12'
                      : 'bg-muted text-muted-foreground mx-8 text-center text-sm'
                  }`}>
                    {/* Info Icon */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute -top-2 ${message.type === 'user' ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 rounded-full bg-background border shadow-sm`}
                      onClick={() => {
                        toast({
                          title: "Message Info",
                          description: `Sent by: ${message.sender || message.type}\nStatus: ${message.status}\nTime: ${format(message.timestamp, 'PPpp')}`,
                        });
                      }}
                    >
                      <Info className="h-3 w-3" />
                    </Button>

                    <p className="text-sm break-words">{message.content}</p>
                    <div className={`flex items-center justify-between mt-2 text-xs ${
                      message.type === 'user' 
                        ? 'text-primary-foreground/70' 
                        : message.type === 'agent'
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground/70'
                    }`}>
                      <span>{format(message.timestamp, 'h:mm a')}</span>
                      
                      {/* Tick/Double Tick System for user messages */}
                      {message.type === 'user' && (
                        <div className="flex items-center ml-2">
                          {message.status === 'sent' && (
                            <Check className="h-3 w-3 text-primary-foreground/50" />
                          )}
                          {message.status === 'delivered' && (
                            <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                          )}
                          {message.status === 'read' && (
                            <CheckCheck className="h-3 w-3 text-blue-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator when sending */}
              {isSendingMessage && (
                <div className="flex justify-start">
                  <div className="bg-white border shadow-sm rounded-2xl px-4 py-3 mr-12">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Message Input - Fixed at bottom */}
        <div className="bg-white border-t p-4 flex-shrink-0 z-10 shadow-lg">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="flex-shrink-0 h-10 w-10 p-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              type="text"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 min-w-0 h-10"
            />
            <Button variant="ghost" size="sm" className="flex-shrink-0 h-10 w-10 p-0">
              <Smile className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              className="flex-shrink-0 h-10 px-4"
              disabled={!newMessage.trim() || isSendingMessage}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Fixed width and scrollable */}
      <div className="w-64 bg-white border-l flex-shrink-0 h-full overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Contact</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Minimal Contact Info */}
            <div className="text-center mb-4">
              <Avatar className="h-12 w-12 mx-auto mb-2">
                <AvatarFallback>
                  {getInitials(conversation.userName || 'Unknown')}
                </AvatarFallback>
              </Avatar>
              <h4 className="font-medium text-sm truncate">{conversation.userName}</h4>
              <p className="text-xs text-muted-foreground truncate">{conversation.userEmail}</p>
              <div className="flex justify-center mt-1">
                <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {conversation.status}
                </Badge>
              </div>
            </div>

            {/* Compact Tags */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">TAGS</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsAddingTag(!isAddingTag)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {conversation.metadata.tags.length > 0 ? (
                    conversation.metadata.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </div>
                
                {isAddingTag && (
                  <div className="flex gap-1">
                    <Input
                      placeholder="Tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="flex-1 h-7 text-xs"
                    />
                    <Button 
                      onClick={handleAddTag} 
                      size="sm"
                      disabled={!newTag.trim() || isAddingTag}
                      className="h-7 w-7 p-0"
                    >
                      <TagIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Compact Add Note */}
            <div>
              <span className="text-xs font-medium text-muted-foreground">ADD NOTE</span>
              <Textarea
                placeholder="Quick note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="mt-1 text-xs"
                rows={2}
              />
              <Button 
                onClick={handleAddNote} 
                size="sm" 
                className="w-full mt-2 h-7 text-xs"
                disabled={!newNote.trim() || isAddingNote}
              >
                {isAddingNote ? "Adding..." : "Add Note"}
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Agent Call Section */}
            {agents && agents.length > 0 && onCallWithAgent && (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">CALL WITH AGENT</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Select
                      value={selectedAgentId}
                      onValueChange={(agentId) => {
                        setSelectedAgentId(agentId);
                      }}
                    >
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Select agent to call..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {isLoadingAgents ? (
                          <SelectItem value="loading" disabled>
                            Loading agents...
                          </SelectItem>
                        ) : (
                          agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id} className="text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>{agent.name}</span>
                                {agent.model && (
                                  <Badge variant="outline" className="text-xs h-4 px-1">
                                    {agent.model}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    
                    <p className="text-xs text-muted-foreground">
                      Select an agent to initiate a voice call
                    </p>
                    <Button
                      className="w-full mt-2"
                      size="sm"
                      onClick={handleCall}
                      disabled={!selectedAgentId}
                    >
                      Call
                    </Button>
                    {/* Call status and error feedback */}
                    {callResult && (
                      <div className="mt-2">
                        {callResult.error ? (
                          <div className="text-xs text-destructive bg-destructive/10 rounded px-2 py-1">
                            {typeof callResult.error === "string"
                              ? `Call failed: ${callResult.error}`
                              : "Call failed. Please try again."}
                          </div>
                        ) : callResult.status ? (
                          <div className="text-xs text-primary bg-primary/10 rounded px-2 py-1">
                            Call status: {callResult.status}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">
                            Call initiated.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />
              </>
            )}

            {/* Timeline Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">TIMELINE</span>
              </div>
              
              <div className="space-y-3">
                {getDummyTimelineData().map((activity, index) => {
                  const IconComponent = activity.icon;
                  const isRecent = index < 2; // Mark first 2 as recent
                  
                  return (
                    <div key={activity.id} className="flex gap-3 group">
                      {/* Timeline line and icon */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isRecent 
                            ? 'bg-primary/10 text-primary border-2 border-primary/20' 
                            : 'bg-muted text-muted-foreground border-2 border-muted'
                        }`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        {index < getDummyTimelineData().length - 1 && (
                          <div className="w-0.5 h-6 bg-border mt-1"></div>
                        )}
                      </div>
                      
                      {/* Activity content */}
                      <div className="flex-1 min-w-0 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-foreground">{activity.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 break-words">{activity.description}</p>
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {format(activity.timestamp, 'MMM d')}
                          </span>
                        </div>
                        
                        {/* Activity type badge for recent items */}
                        {isRecent && (
                          <Badge 
                            variant="outline" 
                            className="text-xs mt-1 h-5 px-2"
                          >
                            {activity.type.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
