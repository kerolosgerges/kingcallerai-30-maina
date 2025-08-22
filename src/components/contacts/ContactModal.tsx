
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { X, Phone, Mail, MessageSquare, Calendar, Star, Edit, Save, Plus, ChevronDown } from "lucide-react";
import { Contact } from "@/pages/Contacts";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, addDoc, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useSubAccount } from "@/contexts/SubAccountContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useSubAccountKingCallerAuth } from "@/hooks/useSubAccountKingCallerAuth";

interface ContactModalProps {
  contact: Contact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (contact: Contact) => void;
}

interface Conversation {
  id: string;
  agentId: string;
  agentName: string;
  userId: string;
  userName: string;
  userEmail: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  messages: Message[];
  metadata: {
    phoneNumber?: string;
    tags: string[];
    customFields: Record<string, any>;
    analytics: {
      wordsSpoken: number;
      averageResponseTime: number;
      interruptionCount: number;
    };
  };
}

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface Activity {
  id: string;
  type: "call" | "email" | "sms" | "task" | "note";
  description: string;
  timestamp: string;
  notes?: string;
}

export const ContactModal = ({ contact, open, onOpenChange, onUpdate }: ContactModalProps) => {
  console.log('🔵 ContactModal rendered with:', { contact: contact?.name || 'null', open });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState<Contact>(contact);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);

  const navigate = useNavigate();
  const { subAccountId } = useParams();
  const { currentUser } = useAuth();
  const { currentSubAccount } = useSubAccount();
  const { toast } = useToast();
  const kingCallerAuth = useSubAccountKingCallerAuth();

  // Sync editedContact with contact prop changes
  useEffect(() => {
    if (contact) {
      console.log('🔄 ContactModal: Syncing editedContact with new contact:', contact.name);
      setEditedContact(contact);
    }
  }, [contact]);

  // Close modal if contact becomes null
  useEffect(() => {
    if (open && !contact) {
      console.log('🔴 ContactModal: No contact available, closing modal');
      onOpenChange(false);
    }
  }, [open, contact, onOpenChange]);

  // Load conversations for this contact
  useEffect(() => {
    if (!open || !currentUser || !currentSubAccount || !contact?.id) return;

    setIsLoadingConversations(true);
    
    // In a real app, you'd have a conversations collection linked to contacts
    // For now, we'll simulate conversations based on contact data
    const mockConversations: Conversation[] = [
      {
        id: `conv-${contact?.id || 'unknown'}-1`,
        agentId: "agent1",
        agentName: "AI Assistant",
        userId: contact?.id || '',
        userName: contact?.name || 'Unknown',
        userEmail: contact?.email || '',
        startTime: new Date(Date.now() - 86400000), // 1 day ago
        status: 'completed',
        messages: [
          {
            id: "msg1",
            type: 'user',
            content: "Hi, I'm interested in your services",
            timestamp: new Date(Date.now() - 86400000),
            sentiment: 'positive'
          },
          {
            id: "msg2",
            type: 'agent',
            content: "Hello! I'd be happy to help you learn more about our services.",
            timestamp: new Date(Date.now() - 86400000 + 60000),
            sentiment: 'positive'
          }
        ],
        metadata: {
          phoneNumber: contact?.phone || '',
          tags: contact?.tags || [],
          customFields: contact?.customFields || {},
          analytics: {
            wordsSpoken: 120,
            averageResponseTime: 2.5,
            interruptionCount: 0
          }
        }
      }
    ];

    setConversations(mockConversations);
    setIsLoadingConversations(false);
  }, [open, contact?.id, currentUser, currentSubAccount]);

  // Load agents when modal opens
  useEffect(() => {
    const loadAgents = async () => {
      if (!open || !currentUser || !currentSubAccount) return;
      
      setIsLoadingAgents(true);
      try {
        const agentsList = await kingCallerAuth.getAgents();
        console.log('🤖 Loaded agents:', agentsList);
        setAgents(agentsList.filter((agent: any) => agent.status === 'active') || []);
      } catch (error) {
        console.error('❌ Error loading agents:', error);
        setAgents([]);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    loadAgents();
  }, [open, currentUser, currentSubAccount, kingCallerAuth]);

  const handleSave = () => {
    if (editedContact && contact) {
      console.log('💾 Saving contact:', editedContact.name);
      onUpdate(editedContact);
      setIsEditing(false);
    } else {
      console.error('🚨 Cannot save - missing contact data');
    }
  };

  const handleCancel = () => {
    if (contact) {
      setEditedContact(contact);
      setIsEditing(false);
    }
  };

  const handleQuickAction = (action: string) => {
    // Add activity record
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type: action as "call" | "email" | "sms",
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} initiated`,
      timestamp: new Date().toISOString(),
      notes: `Quick ${action} action performed`
    };

    setActivities(prev => [newActivity, ...prev]);

    // Navigate to conversations
    navigate(`/${subAccountId}/conversations/${contact?.id || 'unknown'}/view`);
    onOpenChange(false);

    toast({
      title: "Action Initiated",
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} action started successfully.`,
    });
  };

  const handleCallWithAgent = (agentId: string, agentName: string) => {
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type: "call",
      description: `Call with agent ${agentName} initiated`,
      timestamp: new Date().toISOString(),
      notes: `Voice call started with AI agent: ${agentName}`
    };

    setActivities(prev => [newActivity, ...prev]);
    onOpenChange(false);

    toast({
      title: "Call Started",
      description: `Starting voice call with agent ${agentName}`,
    });
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const noteActivity: Activity = {
      id: `note-${Date.now()}`,
      type: "note",
      description: "Note added",
      timestamp: new Date().toISOString(),
      notes: newNote
    };

    setActivities(prev => [noteActivity, ...prev]);
    setNewNote("");

    toast({
      title: "Note Added",
      description: "Your note has been saved successfully.",
    });
  };

  if (!open || !contact) {
    console.log('🔴 ContactModal: Early return -', { open, hasContact: !!contact });
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Contact Details</h2>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={contact?.avatar} />
              <AvatarFallback className="text-xl">
                {contact?.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold">{contact?.name || 'Unknown Contact'}</h3>
              <p className="text-gray-600 text-lg">{contact?.company || 'No Company'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-medium">Score: {contact?.score || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button size="lg" className="flex-1" onClick={() => handleQuickAction('call')}>
              <Phone className="h-5 w-5 mr-2" />
              Call
            </Button>
            <Button size="lg" variant="outline" className="flex-1" onClick={() => handleQuickAction('email')}>
              <Mail className="h-5 w-5 mr-2" />
              Email
            </Button>
            <Button size="lg" variant="outline" className="flex-1" onClick={() => handleQuickAction('sms')}>
              <MessageSquare className="h-5 w-5 mr-2" />
              SMS
            </Button>
            
            {/* Call with Agents Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" variant="outline" className="flex-1" disabled={isLoadingAgents}>
                  <Phone className="h-5 w-5 mr-2" />
                  Call with Agents
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border shadow-lg z-[60]" align="end">
                {isLoadingAgents ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <span className="text-sm text-gray-600">Loading agents...</span>
                  </div>
                ) : agents.length > 0 ? (
                  agents.map((agent) => (
                    <DropdownMenuItem 
                      key={agent.agent_id || agent.id}
                      onClick={() => handleCallWithAgent(agent.agent_id || agent.id, agent.name)}
                      className="cursor-pointer hover:bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{agent.name}</p>
                          <p className="text-xs text-gray-500">{agent.model || 'AI Agent'}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <span className="text-sm text-gray-500">No active agents available</span>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2">
            {(contact?.tags || []).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="profile" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mx-6 mt-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto p-6">
              <TabsContent value="profile" className="h-full">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Contact Information</CardTitle>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium">Name</Label>
                         {isEditing ? (
                           <Input 
                             className="mt-2"
                             value={editedContact.name || ''}
                             onChange={(e) => setEditedContact({...editedContact, name: e.target.value})}
                           />
                         ) : (
                           <p className="text-base mt-2">{contact?.name || 'N/A'}</p>
                         )}
                      </div>
                      <div>
                        <Label className="text-base font-medium">Company</Label>
                        {isEditing ? (
                          <Input 
                            className="mt-2"
                            value={editedContact.company || ''}
                            onChange={(e) => setEditedContact({...editedContact, company: e.target.value})}
                          />
                         ) : (
                           <p className="text-base mt-2">{contact?.company || '-'}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium">Email</Label>
                        {isEditing ? (
                           <Input 
                             className="mt-2"
                             value={editedContact.email || ''}
                             onChange={(e) => setEditedContact({...editedContact, email: e.target.value})}
                           />
                         ) : (
                           <p className="text-base mt-2">{contact?.email || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-base font-medium">Phone</Label>
                        {isEditing ? (
                           <Input 
                             className="mt-2"
                             value={editedContact.phone || ''}
                             onChange={(e) => setEditedContact({...editedContact, phone: e.target.value})}
                           />
                         ) : (
                           <p className="text-base mt-2">{contact?.phone || 'N/A'}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium">Status</Label>
                         {isEditing ? (
                           <Select value={editedContact.status || 'new'} onValueChange={(value) => setEditedContact({...editedContact, status: value as any})}>
                             <SelectTrigger className="mt-2">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="new">New</SelectItem>
                               <SelectItem value="contacted">Contacted</SelectItem>
                               <SelectItem value="qualified">Qualified</SelectItem>
                               <SelectItem value="customer">Customer</SelectItem>
                               <SelectItem value="inactive">Inactive</SelectItem>
                             </SelectContent>
                           </Select>
                         ) : (
                           <p className="text-base mt-2 capitalize">{contact?.status || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-base font-medium">Lead Source</Label>
                         {isEditing ? (
                           <Select value={editedContact.leadSource || 'Website'} onValueChange={(value) => setEditedContact({...editedContact, leadSource: value})}>
                             <SelectTrigger className="mt-2">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="Website">Website</SelectItem>
                               <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                               <SelectItem value="Google Ads">Google Ads</SelectItem>
                               <SelectItem value="Referral">Referral</SelectItem>
                               <SelectItem value="Phone Call">Phone Call</SelectItem>
                             </SelectContent>
                           </Select>
                         ) : (
                           <p className="text-base mt-2">{contact?.leadSource || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="conversations" className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Live Conversations</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full overflow-auto">
                    {isLoadingConversations ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading conversations...</p>
                      </div>
                    ) : conversations.length > 0 ? (
                      <div className="space-y-4">
                        {conversations.map((conversation) => (
                          <div key={conversation.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                               onClick={() => navigate(`/${subAccountId}/conversations/${contact?.id || 'unknown'}/view`)}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  conversation.status === 'active' ? 'bg-green-500' :
                                  conversation.status === 'completed' ? 'bg-blue-500' :
                                  conversation.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                                }`}></div>
                                <span className="font-medium capitalize">{conversation.status}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDistanceToNow(conversation.startTime, { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {conversation.messages[conversation.messages.length - 1]?.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Messages: {conversation.messages.length}</span>
                              <span>Agent: {conversation.agentName}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No conversations yet</p>
                        <Button className="mt-4" onClick={() => handleQuickAction('call')}>
                          Start Conversation
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full overflow-auto">
                     {[...(contact?.activities || []), ...activities].length > 0 ? (
                       <div className="space-y-4">
                         {[...activities, ...(contact?.activities || [])].map((activity) => (
                          <div key={activity.id} className="flex gap-4 p-4 border rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              {activity.type === 'call' && <Phone className="h-5 w-5 text-blue-600" />}
                              {activity.type === 'email' && <Mail className="h-5 w-5 text-blue-600" />}
                              {activity.type === 'sms' && <MessageSquare className="h-5 w-5 text-blue-600" />}
                              {activity.type === 'task' && <Calendar className="h-5 w-5 text-blue-600" />}
                              {activity.type === 'note' && <Edit className="h-5 w-5 text-blue-600" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-base">{activity.description}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                              </p>
                              {activity.notes && (
                                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{activity.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No activity recorded yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Add New Note</Label>
                      <Textarea 
                        placeholder="Add notes about this contact..."
                        className="min-h-[120px]"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Save Note
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {activities.filter(a => a.type === 'note').map((note) => (
                        <div key={note.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Note</span>
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(note.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-gray-700">{note.notes}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
