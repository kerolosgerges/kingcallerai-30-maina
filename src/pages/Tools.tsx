
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus, 
  Play, 
  Settings, 
  Code, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Wrench,
  Edit,
  Trash2,
  Eye,
  Filter,
  RotateCcw,
  Copy
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'webhook' | 'function' | 'integration';
  status: 'active' | 'inactive' | 'error';
  lastUsed?: Date;
  parameters: { [key: string]: any };
  endpoint?: string;
  method?: string;
}

interface ToolExecution {
  id: string;
  toolId: string;
  toolName: string;
  status: 'running' | 'success' | 'error';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  input: any;
  output?: any;
  error?: string;
}

const Tools = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolParameters, setToolParameters] = useState<{ [key: string]: any }>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("tools");

  // Mock data for tools
  const [tools] = useState<Tool[]>([
    {
      id: '1',
      name: 'Send Email',
      description: 'Send an email to a specific address',
      type: 'api',
      status: 'active',
      lastUsed: new Date('2024-01-15'),
      parameters: {
        to: 'string',
        subject: 'string',
        body: 'string',
        attachments: 'array'
      },
      endpoint: 'https://api.example.com/send-email',
      method: 'POST'
    },
    {
      id: '2',
      name: 'Create Calendar Event',
      description: 'Create a new calendar event',
      type: 'integration',
      status: 'active',
      lastUsed: new Date('2024-01-14'),
      parameters: {
        title: 'string',
        start_time: 'datetime',
        end_time: 'datetime',
        attendees: 'array'
      }
    },
    {
      id: '3',
      name: 'Update CRM Contact',
      description: 'Update contact information in CRM',
      type: 'api',
      status: 'inactive',
      parameters: {
        contact_id: 'string',
        name: 'string',
        email: 'string',
        phone: 'string'
      },
      endpoint: 'https://api.crm.com/contacts',
      method: 'PUT'
    },
    {
      id: '4',
      name: 'Generate Report',
      description: 'Generate analytics report',
      type: 'function',
      status: 'error',
      parameters: {
        date_range: 'string',
        metrics: 'array',
        format: 'string'
      }
    }
  ]);

  // Mock execution history
  const [executions] = useState<ToolExecution[]>([
    {
      id: '1',
      toolId: '1',
      toolName: 'Send Email',
      status: 'success',
      startTime: new Date('2024-01-15T10:30:00'),
      endTime: new Date('2024-01-15T10:30:02'),
      duration: 2000,
      input: { to: 'user@example.com', subject: 'Welcome', body: 'Welcome to our platform!' },
      output: { message_id: 'msg_123', status: 'sent' }
    },
    {
      id: '2',
      toolId: '2',
      toolName: 'Create Calendar Event',
      status: 'success',
      startTime: new Date('2024-01-15T09:15:00'),
      endTime: new Date('2024-01-15T09:15:01'),
      duration: 1500,
      input: { title: 'Team Meeting', start_time: '2024-01-16T14:00:00' },
      output: { event_id: 'evt_456' }
    },
    {
      id: '3',
      toolId: '4',
      toolName: 'Generate Report',
      status: 'error',
      startTime: new Date('2024-01-15T08:00:00'),
      endTime: new Date('2024-01-15T08:00:05'),
      duration: 5000,
      input: { date_range: 'last_30_days', format: 'pdf' },
      error: 'Invalid date range format'
    }
  ]);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getExecutionStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <RotateCcw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'api': return 'bg-blue-100 text-blue-800';
      case 'webhook': return 'bg-green-100 text-green-800';
      case 'function': return 'bg-purple-100 text-purple-800';
      case 'integration': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExecuteTool = async () => {
    if (!selectedTool) return;

    setIsExecuting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Tool Executed Successfully",
        description: `${selectedTool.name} executed with provided parameters`,
      });
      
      // In real app, add to execution history
      console.log('Executing tool:', selectedTool.name, 'with params:', toolParameters);
      
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "Failed to execute tool. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const renderParameterInput = (paramName: string, paramType: string) => {
    const value = toolParameters[paramName] || '';
    
    switch (paramType) {
      case 'string':
        return (
          <Input
            value={value}
            onChange={(e) => setToolParameters(prev => ({ ...prev, [paramName]: e.target.value }))}
            placeholder={`Enter ${paramName}`}
          />
        );
      case 'array':
        return (
          <Textarea
            value={Array.isArray(value) ? value.join('\n') : value}
            onChange={(e) => setToolParameters(prev => ({ 
              ...prev, 
              [paramName]: e.target.value.split('\n').filter(v => v.trim()) 
            }))}
            placeholder={`Enter ${paramName} (one per line)`}
            rows={3}
          />
        );
      case 'datetime':
        return (
          <Input
            type="datetime-local"
            value={value}
            onChange={(e) => setToolParameters(prev => ({ ...prev, [paramName]: e.target.value }))}
          />
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) => setToolParameters(prev => ({ ...prev, [paramName]: e.target.value }))}
            placeholder={`Enter ${paramName}`}
          />
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tools</h1>
          <p className="text-muted-foreground">Manage and execute your automation tools</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Create Tool
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tools">Tools Library</TabsTrigger>
          <TabsTrigger value="execute">Execute Tool</TabsTrigger>
          <TabsTrigger value="history">Execution History</TabsTrigger>
        </TabsList>

        {/* Tools Library Tab */}
        <TabsContent value="tools" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="function">Function</SelectItem>
                <SelectItem value="integration">Integration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(tool.status)}
                      <Badge className={getTypeColor(tool.type)}>{tool.type}</Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Parameters: {Object.keys(tool.parameters).length}</span>
                      {tool.lastUsed && (
                        <span>Last used: {tool.lastUsed.toLocaleDateString()}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedTool(tool);
                          setToolParameters({});
                          setActiveTab("execute");
                        }}
                        className="flex-1"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Execute
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Execute Tool Tab */}
        <TabsContent value="execute" className="space-y-6">
          {selectedTool ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Wrench className="h-5 w-5" />
                      <span>{selectedTool.name}</span>
                      <Badge className={getTypeColor(selectedTool.type)}>{selectedTool.type}</Badge>
                    </CardTitle>
                    <CardDescription>{selectedTool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Parameters</h3>
                      <div className="space-y-4">
                        {Object.entries(selectedTool.parameters).map(([paramName, paramType]) => (
                          <div key={paramName}>
                            <Label className="text-sm font-medium">
                              {paramName} ({paramType as string})
                            </Label>
                            {renderParameterInput(paramName, paramType as string)}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex space-x-4">
                      <Button 
                        onClick={handleExecuteTool}
                        disabled={isExecuting}
                        className="flex-1"
                      >
                        {isExecuting ? (
                          <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        {isExecuting ? 'Executing...' : 'Execute Tool'}
                      </Button>
                      <Button variant="outline">
                        <Code className="h-4 w-4 mr-2" />
                        Preview Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Tool Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedTool.status)}
                        <span className="capitalize">{selectedTool.status}</span>
                      </div>
                    </div>
                    
                    {selectedTool.endpoint && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Endpoint</Label>
                        <div className="text-sm font-mono bg-muted p-2 rounded">
                          {selectedTool.method} {selectedTool.endpoint}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Parameter Count</Label>
                      <span>{Object.keys(selectedTool.parameters).length}</span>
                    </div>
                    
                    {selectedTool.lastUsed && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Last Used</Label>
                        <span>{selectedTool.lastUsed.toLocaleString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tool Selected</h3>
                <p className="text-muted-foreground text-center">
                  Select a tool from the Tools Library to execute it with custom parameters.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => setActiveTab("tools")}
                >
                  Browse Tools
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Execution History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Executions</CardTitle>
              <CardDescription>
                View the history of tool executions and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {executions.map((execution) => (
                    <div key={execution.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getExecutionStatusIcon(execution.status)}
                          <div>
                            <h4 className="font-medium">{execution.toolName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {execution.startTime.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={execution.status === 'success' ? 'default' : 
                                   execution.status === 'error' ? 'destructive' : 'secondary'}
                          >
                            {execution.status}
                          </Badge>
                          {execution.duration && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {execution.duration}ms
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="font-medium">Input</Label>
                          <pre className="bg-muted p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(execution.input, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <Label className="font-medium">
                            {execution.status === 'error' ? 'Error' : 'Output'}
                          </Label>
                          <pre className="bg-muted p-2 rounded mt-1 overflow-auto">
                            {execution.status === 'error' 
                              ? execution.error 
                              : JSON.stringify(execution.output, null, 2)
                            }
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Tool Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Tool</DialogTitle>
            <DialogDescription>
              Add a new tool to your automation library
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tool Name</Label>
                <Input placeholder="Enter tool name" />
              </div>
              <div>
                <Label>Tool Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="function">Function</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe what this tool does..." />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowCreateDialog(false);
                toast({
                  title: "Tool Created",
                  description: "New tool has been added to your library",
                });
              }}>
                Create Tool
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tools;
