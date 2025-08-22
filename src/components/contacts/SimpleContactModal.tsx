import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Contact } from '@/pages/Contacts';
import { useNavigate } from 'react-router-dom';
import { PhoneInput } from '@/components/ui/phone-input';
import { Eye, Edit, Trash2, Save, X, MessageSquare, Phone, Clock, Send, User, Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'customer', 'inactive']).optional(),
  leadSource: z.string().optional(),
});


type ContactFormData = z.infer<typeof contactSchema>;

interface SimpleContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact | null;
  mode: 'create' | 'view' | 'edit';
  onSubmit?: (data: ContactFormData) => Promise<void>;
  onUpdate?: (contact: Contact) => Promise<void>;
  onDelete?: (contactId: string) => Promise<void>;
  isLoading?: boolean;
}

export const SimpleContactModal: React.FC<SimpleContactModalProps> = ({
  open,
  onOpenChange,
  contact,
  mode,
  onSubmit,
  onUpdate,
  onDelete,
  isLoading = false,
}) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [pastCalls, setPastCalls] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      address: '',
      notes: '',
      status: 'new',
      leadSource: 'manual',
    },
  });

  // Update form and load conversation data when contact changes
  useEffect(() => {
    if (contact && (mode === 'view' || mode === 'edit')) {
      form.reset({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        title: contact.title || '',
        address: contact.address || '',
        notes: contact.notes || '',
        status: contact.status || 'new',
        leadSource: contact.leadSource || 'manual',
      });

      // Load recent conversations and past calls
      if (mode === 'view') {
        loadRecentConversations(contact.id);
        loadPastCalls(contact.id);
      }
    } else if (mode === 'create') {
      form.reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        address: '',
        notes: '',
        status: 'new',
        leadSource: 'manual',
      });
    }
  }, [contact, mode, form]);

  // Reset mode when dialog opens/closes
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode, open]);

  const handleSubmit = async (values: ContactFormData) => {
    try {
      if (currentMode === 'create' && onSubmit) {
        await onSubmit(values);
        form.reset();
        onOpenChange(false);
        toast({
          title: "Contact Created",
          description: `${values.name} has been added to your contacts.`,
        });
      } else if (currentMode === 'edit' && onUpdate && contact) {
        const updatedContact: Contact = {
          ...contact,
          ...values,
          updatedAt: new Date(),
        };
        await onUpdate(updatedContact);
        setCurrentMode('view');
        toast({
          title: "Contact Updated",
          description: `${values.name} has been updated successfully.`,
        });
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        title: "Error",
        description: "Failed to save contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!contact || !onDelete) return;
    
    try {
      await onDelete(contact.id);
      onOpenChange(false);
      toast({
        title: "Contact Deleted",
        description: `${contact.name} has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load recent conversations
  const loadRecentConversations = async (contactId: string) => {
    setIsLoadingConversations(true);
    try {
      // Mock recent conversations data - in real app, this would come from API
      const mockMessages = [
        {
          id: '1',
          type: 'agent',
          content: 'Hello! How can I help you today?',
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
          status: 'delivered'
        },
        {
          id: '2',
          type: 'user',
          content: 'I need help with my order',
          timestamp: new Date(Date.now() - 240000), // 4 minutes ago
          status: 'read'
        },
        {
          id: '3',
          type: 'agent',
          content: 'I can help you with that. Let me look up your order details.',
          timestamp: new Date(Date.now() - 180000), // 3 minutes ago
          status: 'delivered'
        },
        {
          id: '4',
          type: 'user',
          content: 'Thank you!',
          timestamp: new Date(Date.now() - 120000), // 2 minutes ago
          status: 'read'
        }
      ];
      
      setRecentMessages(mockMessages);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // Load past calls
  const loadPastCalls = async (contactId: string) => {
    try {
      // Mock past calls data - in real app, this would come from API
      const mockCalls = [
        {
          id: '1',
          type: 'outbound',
          duration: '5:30',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          status: 'completed',
          recording: 'available'
        },
        {
          id: '2',
          type: 'inbound',
          duration: '2:15',
          timestamp: new Date(Date.now() - 172800000), // 2 days ago
          status: 'completed',
          recording: 'available'
        },
        {
          id: '3',
          type: 'outbound',
          duration: '0:00',
          timestamp: new Date(Date.now() - 259200000), // 3 days ago
          status: 'missed',
          recording: 'none'
        }
      ];
      
      setPastCalls(mockCalls);
    } catch (error) {
      console.error('Error loading past calls:', error);
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !contact) return;

    const messageData = {
      id: `temp_${Date.now()}`,
      type: 'agent',
      content: newMessage.trim(),
      timestamp: new Date(),
      status: 'sent'
    };

    setRecentMessages(prev => [...prev, messageData]);
    setNewMessage('');

    toast({
      title: "Message Sent",
      description: "Your message has been delivered.",
    });
  };

  const getDialogTitle = () => {
    switch (currentMode) {
      case 'create': return 'Create New Contact';
      case 'edit': return 'Edit Contact';
      case 'view': return 'Contact Details';
      default: return 'Contact';
    }
  };

  const isReadOnly = currentMode === 'view';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[90vw] h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">{getDialogTitle()}</DialogTitle>
              <DialogDescription className="text-xs">
                {currentMode === 'create' && 'Add a new contact to your database.'}
                {currentMode === 'view' && 'View and manage contact information.'}
                {currentMode === 'edit' && 'Update contact information.'}
              </DialogDescription>
            </div>
            {currentMode === 'view' && contact && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMode('edit')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {currentMode === 'view' && contact ? (
            <Tabs defaultValue="profile" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 mb-3 h-8">
                <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
                <TabsTrigger value="conversations" className="text-xs">Recent Conversations</TabsTrigger>
                <TabsTrigger value="calls" className="text-xs">Past Calls</TabsTrigger>
                <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-hidden">
                <TabsContent value="profile" className="h-full overflow-auto">
                  <div className="grid grid-cols-3 gap-6 h-full">
                    {/* Contact Information */}
                    <div className="col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center gap-6 p-4 border rounded-lg bg-gray-50">
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback className="text-2xl">
                                {contact.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="text-2xl font-semibold">{contact.name}</h3>
                              <p className="text-lg text-gray-600">{contact.company || 'No Company'}</p>
                              <div className="flex gap-2 mt-2">
                                {contact.tags?.map((tag) => (
                                  <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Email
                                </label>
                                <p className="text-base">{contact.email || 'N/A'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  Phone
                                </label>
                                <p className="text-base">{contact.phone || 'N/A'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Status</label>
                                <p className="text-base capitalize">{contact.status || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <p className="text-base">{contact.title || 'N/A'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Address
                                </label>
                                <p className="text-base">{contact.address || 'N/A'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Lead Source</label>
                                <p className="text-base">{contact.leadSource || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                          
                          {contact.notes && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Notes</label>
                              <p className="text-base">{contact.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button className="w-full" size="lg">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Contact
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            size="lg"
                            onClick={() => {
                              onOpenChange(false);
                              navigate(`/conversations?contactId=${contact?.id}`);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                          <Button variant="outline" className="w-full" size="lg">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Meeting
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="conversations" className="h-full">
                  <div className="grid grid-cols-3 gap-6 h-full">
                    {/* Chat Messages */}
                    <div className="col-span-2">
                      <Card className="h-full flex flex-col">
                        <CardHeader className="flex-shrink-0">
                          <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Recent Conversations
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col overflow-hidden">
                          <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-4">
                              {isLoadingConversations ? (
                                <div className="text-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                  <p className="text-gray-600">Loading conversations...</p>
                                </div>
                              ) : recentMessages.length > 0 ? (
                                recentMessages.map((message) => (
                                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                                      message.type === 'user' 
                                        ? 'bg-primary text-primary-foreground ml-12' 
                                        : 'bg-gray-100 mr-12'
                                    }`}>
                                      <p className="text-sm break-words">{message.content}</p>
                                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                                        <span>{format(message.timestamp, 'h:mm a')}</span>
                                        {message.type === 'user' && (
                                          <span className="capitalize">{message.status}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                  <p>No recent conversations</p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                          
                          {/* Message Input */}
                          <div className="flex gap-2 mt-4 pt-4 border-t">
                            <Input
                              placeholder="Type a message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              className="flex-1"
                            />
                            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Conversation Stats */}
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Conversation Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{recentMessages.length}</div>
                            <p className="text-sm text-gray-600">Total Messages</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {recentMessages.filter(m => m.type === 'user').length}
                            </div>
                            <p className="text-sm text-gray-600">User Messages</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {recentMessages.filter(m => m.type === 'agent').length}
                            </div>
                            <p className="text-sm text-gray-600">Agent Responses</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="calls" className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Past Calls
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-4">
                          {pastCalls.length > 0 ? (
                            pastCalls.map((call) => (
                              <div key={call.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                      call.type === 'inbound' ? 'bg-green-500' : 
                                      call.type === 'outbound' ? 'bg-blue-500' : 'bg-gray-500'
                                    }`}></div>
                                    <span className="font-medium capitalize">{call.type} Call</span>
                                    <Badge variant={call.status === 'completed' ? 'default' : 'secondary'}>
                                      {call.status}
                                    </Badge>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {format(call.timestamp, 'MMM d, h:mm a')}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4 text-gray-400" />
                                      <span className="text-sm">{call.duration}</span>
                                    </div>
                                    {call.recording === 'available' && (
                                      <Button variant="outline" size="sm">
                                        Play Recording
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No past calls found</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activity" className="h-full overflow-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Activity tracking coming soon...</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 overflow-auto p-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} readOnly={isReadOnly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} readOnly={isReadOnly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} readOnly={isReadOnly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <PhoneInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter phone number"
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leadSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Source</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="facebook">Facebook Ads</SelectItem>
                            <SelectItem value="google">Google Ads</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional notes..." {...field} readOnly={isReadOnly} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  {currentMode === 'edit' && (
                    <Button type="button" variant="outline" onClick={() => setCurrentMode('view')}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel Edit
                    </Button>
                  )}
                  {!isReadOnly && (
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : currentMode === 'create' ? 'Create Contact' : 'Save Changes'}
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};