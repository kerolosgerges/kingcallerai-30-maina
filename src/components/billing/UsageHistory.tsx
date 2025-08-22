
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, PhoneCall, PhoneOutgoing, RefreshCw, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface UsageRecord {
  id: string;
  type: 'incoming_call' | 'outgoing_call' | 'incoming_sms' | 'outgoing_sms';
  timestamp: string;
  duration?: number; // in seconds for calls
  cost: number;
  phoneNumber: string;
  status: 'completed' | 'failed' | 'busy' | 'no_answer';
  description: string;
}

export const UsageHistory = () => {
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('last30');

  useEffect(() => {
    loadUsageHistory();
  }, []);

  const loadUsageHistory = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real implementation, this would fetch from your backend
      const mockUsage: UsageRecord[] = [
        {
          id: '1',
          type: 'incoming_call',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          duration: 245,
          cost: 0.15,
          phoneNumber: '+1 (555) 123-4567',
          status: 'completed',
          description: 'Customer inquiry call'
        },
        {
          id: '2',
          type: 'outgoing_sms',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          cost: 0.05,
          phoneNumber: '+1 (555) 987-6543',
          status: 'completed',
          description: 'Appointment reminder SMS'
        },
        {
          id: '3',
          type: 'outgoing_call',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          duration: 180,
          cost: 0.12,
          phoneNumber: '+1 (555) 456-7890',
          status: 'completed',
          description: 'Follow-up call'
        },
        {
          id: '4',
          type: 'incoming_sms',
          timestamp: new Date(Date.now() - 345600000).toISOString(),
          cost: 0.02,
          phoneNumber: '+1 (555) 321-0987',
          status: 'completed',
          description: 'Customer support inquiry'
        },
        {
          id: '5',
          type: 'outgoing_call',
          timestamp: new Date(Date.now() - 432000000).toISOString(),
          duration: 0,
          cost: 0.05,
          phoneNumber: '+1 (555) 654-3210',
          status: 'no_answer',
          description: 'Callback attempt'
        }
      ];
      
      setUsageRecords(mockUsage);
    } catch (error) {
      console.error('Error loading usage history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: UsageRecord['type']) => {
    switch (type) {
      case 'incoming_call':
        return <PhoneCall className="h-4 w-4 text-blue-600" />;
      case 'outgoing_call':
        return <PhoneOutgoing className="h-4 w-4 text-green-600" />;
      case 'incoming_sms':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'outgoing_sms':
        return <MessageSquare className="h-4 w-4 text-orange-600" />;
    }
  };

  const getTypeLabel = (type: UsageRecord['type']) => {
    switch (type) {
      case 'incoming_call':
        return 'Incoming Call';
      case 'outgoing_call':
        return 'Outgoing Call';
      case 'incoming_sms':
        return 'Incoming SMS';
      case 'outgoing_sms':
        return 'Outgoing SMS';
    }
  };

  const getStatusBadge = (status: UsageRecord['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'busy':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Busy</Badge>;
      case 'no_answer':
        return <Badge variant="outline">No Answer</Badge>;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cost);
  };

  const filteredRecords = usageRecords.filter(record => {
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    const matchesSearch = searchTerm === '' || 
      record.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filtering logic would go here
    return matchesType && matchesSearch;
  });

  const totalCost = filteredRecords.reduce((sum, record) => sum + record.cost, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading usage history...</span>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg border border-muted/60 bg-background/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Usage History
        </CardTitle>
        <CardDescription>
          Track your calls and SMS usage with detailed cost breakdown
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-sm text-muted-foreground">Incoming Calls</div>
                <div className="text-lg font-semibold">
                  {filteredRecords.filter(r => r.type === 'incoming_call').length}
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <PhoneOutgoing className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-sm text-muted-foreground">Outgoing Calls</div>
                <div className="text-lg font-semibold">
                  {filteredRecords.filter(r => r.type === 'outgoing_call').length}
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-sm text-muted-foreground">SMS Total</div>
                <div className="text-lg font-semibold">
                  {filteredRecords.filter(r => r.type.includes('sms')).length}
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
                <div className="text-lg font-semibold text-green-600">
                  {formatCost(totalCost)}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <Input
            placeholder="Search phone number or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="incoming_call">Incoming Calls</SelectItem>
              <SelectItem value="outgoing_call">Outgoing Calls</SelectItem>
              <SelectItem value="incoming_sms">Incoming SMS</SelectItem>
              <SelectItem value="outgoing_sms">Outgoing SMS</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="last90">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsageHistory}
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Usage Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(record.type)}
                    <span className="text-sm">{getTypeLabel(record.type)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(record.timestamp), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell className="font-mono text-sm">{record.phoneNumber}</TableCell>
                <TableCell>
                  {record.duration !== undefined ? formatDuration(record.duration) : '-'}
                </TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell className="font-semibold text-green-600">
                  {formatCost(record.cost)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {record.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No usage records found matching your filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
