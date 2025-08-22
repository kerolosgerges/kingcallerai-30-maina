
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageSquare, Download, Trash2, Search, Filter, MoreHorizontal, Play, Clock, User } from 'lucide-react';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { format } from 'date-fns';

export const ConversationHistory = () => {
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  
  const { conversations, loading, filter, setFilter, exportConversations, deleteConversations } = useConversationHistory();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilter({ ...filter, searchQuery: query });
  };

  const handleSelectConversation = (conversationId: string, selected: boolean) => {
    if (selected) {
      setSelectedConversations(prev => [...prev, conversationId]);
    } else {
      setSelectedConversations(prev => prev.filter(id => id !== conversationId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedConversations(conversations.map(c => c.id));
    } else {
      setSelectedConversations([]);
    }
  };

  const handleExport = async () => {
    await exportConversations(exportFormat, selectedConversations.length > 0 ? selectedConversations : undefined);
    setShowExportDialog(false);
  };

  const handleDelete = async () => {
    if (selectedConversations.length === 0) return;
    
    const confirmed = window.confirm(`Delete ${selectedConversations.length} conversations? This action cannot be undone.`);
    if (confirmed) {
      const success = await deleteConversations(selectedConversations);
      if (success) {
        setSelectedConversations([]);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'abandoned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation History
              </CardTitle>
              <CardDescription>
                View and manage all agent conversations
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              {selectedConversations.length > 0 && (
                <>
                  <Button variant="outline" onClick={handleDelete} size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedConversations.length})
                  </Button>
                </>
              )}
              
              <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Conversations</DialogTitle>
                    <DialogDescription>
                      Choose format and export conversations
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Export Format</label>
                      <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV File</SelectItem>
                          <SelectItem value="json">JSON File</SelectItem>
                          <SelectItem value="xlsx">Excel File</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedConversations.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {selectedConversations.length} conversations selected for export
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleExport} disabled={loading}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedConversations.length === conversations.length && conversations.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversations.map((conversation) => (
                    <TableRow key={conversation.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedConversations.includes(conversation.id)}
                          onCheckedChange={(checked) => handleSelectConversation(conversation.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{conversation.agentName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{conversation.userName || 'Anonymous'}</div>
                            {conversation.userEmail && (
                              <div className="text-sm text-muted-foreground">{conversation.userEmail}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(conversation.startTime, 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(conversation.startTime, 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {conversation.duration ? formatDuration(conversation.duration) : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {conversation.messages.length} messages
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(conversation.status)}>
                          {conversation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {conversation.metadata.analytics.satisfactionScore && (
                          <div className="text-sm font-medium">
                            {conversation.metadata.analytics.satisfactionScore}/10
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {conversations.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No conversations found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search query' : 'Conversations will appear here once agents start interacting with users'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
