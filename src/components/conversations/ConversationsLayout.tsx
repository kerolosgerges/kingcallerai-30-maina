import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConversationDetail } from './ConversationDetail';
import { Search, MessageSquare, Phone, Mail, Clock, Filter, Users, Plus, ChevronDown } from "lucide-react";
import { useContacts } from '@/components/contacts/ContactsContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { useSubAccountKingCallerAuth } from '@/hooks/useSubAccountKingCallerAuth';
import { useToast } from '@/hooks/use-toast';
import { logCallToFirestore } from '@/utils/logCall';
import type { Conversation } from "@/types/conversation";
import type { Contact } from "@/pages/Contacts";

export const ConversationsLayout = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { currentSubAccount } = useSubAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  
  const { contacts, isLoading } = useContacts();
  const kingCallerAuth = useSubAccountKingCallerAuth();
  const { toast } = useToast();

  // Filter contacts directly instead of converting to conversations
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getLastActivity = (contact: Contact) => {
    const lastActivity = contact.activities[contact.activities.length - 1];
    return lastActivity ? lastActivity.description : 'No recent activity';
  };

  // Function to create conversation object
  const createConversation = (contact: Contact): Conversation => {
    return {
      id: contact.id,
      agentId: "system",
      agentName: "AI Assistant", 
      userName: contact.name,
      userEmail: contact.email,
      startTime: new Date(),
      status: 'active',
      messages: [{
        id: 'welcome',
        type: 'system',
        content: `Started conversation with ${contact.name}`,
        timestamp: new Date()
      }],
      metadata: {
        phoneNumber: contact.phone,
        tags: contact.tags,
        customFields: contact.customFields,
        analytics: {
          wordsSpoken: 0,
          averageResponseTime: 0,
          interruptionCount: 0
        }
      }
    };
  };

  // Function to start a conversation with a contact (only sets state, no navigation)
  const setContactConversation = (contact: Contact) => {
    const conversation = createConversation(contact);
    setSelectedConversation(conversation);
  };

  // Function to handle contact click (navigates to route)
  const startConversation = (contact: Contact) => {
    if (currentSubAccount) {
      navigate(`/${currentSubAccount.id}/conversations/${contact.id}/view`);
    }
  };

  // Load agents when component mounts - with proper caching
  useEffect(() => {
    const loadAgents = async () => {
      if (!currentSubAccount?.id) return;
      
      // Check if agents are already loaded for this sub-account
      if (agents.length > 0) {
        console.log('🔄 Agents already loaded, skipping API call');
        return;
      }
      
      setIsLoadingAgents(true);
      try {
        const agentsList = await kingCallerAuth.getAgents();
        console.log('🤖 Loaded agents for conversations:', agentsList);
        // Filter for active agents - check both status and assistantStatus fields
        const activeAgents = agentsList.filter((agent: any) => 
          agent.status === 'active' || 
          agent.assistantStatus === 'updated' || 
          agent.assistantStatus === 'seeding'
        );
        console.log('🎯 Filtered active agents:', activeAgents);
        setAgents(activeAgents);
      } catch (error) {
        console.error('❌ Error loading agents:', error);
        setAgents([]);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    loadAgents();
  }, [currentSubAccount?.id]); // Only depend on sub-account ID, not the entire object or auth

  // Handle call with agent
  const handleCallWithAgent = async (contact: Contact, agentId: string, agentName: string) => {
    if (!currentSubAccount) return;

    try {
      const callId = `call_${Date.now()}`;
      
      // Log call to Firebase
      await logCallToFirestore({
        saas_id: currentSubAccount.id,
        call_id: callId,
        agent_id: agentId,
        agent_name: agentName,
        phone: contact.phone || '',
        status: 'initiated',
        extra: {
          contact_id: contact.id,
          contact_name: contact.name,
          contact_email: contact.email,
        }
      });

      toast({
        title: "Call Initiated",
        description: `Starting call with ${agentName} to ${contact.name}`,
      });

      // Navigate to conversation view
      navigate(`/${currentSubAccount.id}/conversations/${contact.id}/view`);
    } catch (error) {
      console.error('❌ Error initiating call:', error);
      toast({
        title: "Call Failed",
        description: "Failed to initiate call with agent",
        variant: "destructive",
      });
    }
  };

  // Auto-select contact from URL parameter
  useEffect(() => {
    if (contactId && contacts.length > 0) {
      const contact = contacts.find(c => c.id === contactId);
      if (contact) {
        console.log('🎯 Auto-selecting contact from URL:', contact.name);
        setContactConversation(contact);
      } else {
        console.warn('❌ Contact not found with ID:', contactId);
        // Optionally show a toast or message that contact wasn't found
      }
    }
    // Clear selection if no contactId in URL
    if (!contactId) {
      setSelectedConversation(null);
    }
  }, [contactId, contacts]);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Contacts List */}
      <div className="w-80 bg-background border-r border-border flex flex-col">
        {/* Header with Search */}
        <div className="p-4 border-b border-border">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-foreground">Conversations</h1>
            <p className="text-sm text-muted-foreground">
              {contactId ? 'Viewing specific contact conversation' : 'View and manage your contacts'}
            </p>
            {contactId && selectedConversation && (
              <div className="mt-2 p-2 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium text-primary">
                  🎯 Opened from contact: {selectedConversation.userName}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contacts</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading contacts...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-4 text-center">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No contacts found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => startConversation(contact)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
                  selectedConversation?.id === contact.id ? 'bg-accent border-accent-foreground/20' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {contact.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {contact.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 hover:bg-primary/10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="w-48 bg-white border shadow-lg z-50"
                          >
                            {isLoadingAgents ? (
                              <DropdownMenuItem disabled>
                                Loading agents...
                              </DropdownMenuItem>
                            ) : agents.length > 0 ? (
                              agents.map((agent) => (
                                <DropdownMenuItem
                                  key={agent.id}
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleCallWithAgent(contact, agent.id, agent.agentName || agent.name);
                                   }}
                                  className="cursor-pointer hover:bg-accent"
                                >
                                   <Phone className="h-3 w-3 mr-2" />
                                   Call with {agent.agentName || agent.name}
                                </DropdownMenuItem>
                              ))
                            ) : (
                              <DropdownMenuItem disabled>
                                No agents available
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(contact.updatedAt || contact.createdAt)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground truncate mb-1">
                      {contact.email}
                    </p>
                    
                    {contact.phone && (
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        <Phone className="h-3 w-3 inline mr-1" />
                        {contact.phone}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground truncate">
                      {getLastActivity(contact)}
                    </p>
                    
                    {contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {contact.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{contact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ConversationDetail
            conversation={selectedConversation}
            agents={agents}
            isLoadingAgents={isLoadingAgents}
            onCallWithAgent={handleCallWithAgent}
            onClose={() => {
              // When closing, navigate back to conversations without contact ID
              if (currentSubAccount) {
                navigate(`/${currentSubAccount.id}/conversations`);
              }
              setSelectedConversation(null);
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">
                {contactId ? 'Contact conversation will load here' : 'Select a contact to view details'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {contactId 
                  ? 'If you can see this, the contact may not exist or is still loading'
                  : 'Choose a contact from the sidebar to view their information and start a conversation'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};