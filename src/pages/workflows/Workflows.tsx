import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateWorkflowDialog } from '@/components/workflows/CreateWorkflowDialog';
import { Plus, Search, GitBranch, Play, Pause, Edit, Trash2, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'draft';
  lastRun?: string;
  totalRuns: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
  nodes: any[];
  edges: any[];
}

const Workflows = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock initial workflows
  useEffect(() => {
    const mockWorkflows: Workflow[] = [
      {
        id: 'wf-1',
        name: 'Lead Qualification Workflow',
        description: 'Automated lead qualification and scoring',
        status: 'active',
        lastRun: '2024-01-20T10:30:00Z',
        totalRuns: 147,
        successRate: 94.2,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-20T10:30:00Z',
        nodes: [],
        edges: []
      },
      {
        id: 'wf-2',
        name: 'Customer Onboarding',
        description: 'Welcome new customers and collect information',
        status: 'paused',
        lastRun: '2024-01-19T14:15:00Z',
        totalRuns: 89,
        successRate: 87.6,
        createdAt: '2024-01-10T11:00:00Z',
        updatedAt: '2024-01-19T14:15:00Z',
        nodes: [],
        edges: []
      },
      {
        id: 'wf-3',
        name: 'Payment Reminder',
        description: 'Automated payment reminders for overdue accounts',
        status: 'draft',
        totalRuns: 0,
        successRate: 0,
        createdAt: '2024-01-22T16:45:00Z',
        updatedAt: '2024-01-22T16:45:00Z',
        nodes: [],
        edges: []
      }
    ];
    setWorkflows(mockWorkflows);
  }, []);

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (workflow.description && workflow.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateWorkflow = async (data: { name: string; description?: string }) => {
    setIsLoading(true);
    try {
      const newWorkflow: Workflow = {
        id: `wf-${Date.now()}`,
        name: data.name,
        description: data.description,
        status: 'draft',
        totalRuns: 0,
        successRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nodes: [],
        edges: []
      };
      
      setWorkflows(prev => [newWorkflow, ...prev]);
      
      toast({
        title: "Workflow Created",
        description: `${data.name} has been created successfully.`,
      });

      // Navigate to editor after creation
      setTimeout(() => {
        navigate(`${newWorkflow.id}`);
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => {
      if (workflow.id === workflowId) {
        const newStatus = workflow.status === 'active' ? 'paused' : 'active';
        toast({
          title: `Workflow ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
          description: `${workflow.name} is now ${newStatus}.`,
        });
        return { ...workflow, status: newStatus };
      }
      return workflow;
    }));
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    toast({
      title: "Workflow Deleted",
      description: `${workflow?.name} has been deleted.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-600" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GitBranch className="h-6 w-6" />
            Workflows
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage automated voice workflows
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Total: {workflows.length}</span>
          <span>Active: {workflows.filter(w => w.status === 'active').length}</span>
          <span>Draft: {workflows.filter(w => w.status === 'draft').length}</span>
        </div>
      </div>

      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWorkflows.length === 0 ? (
            <div className="text-center py-12">
              <GitBranch className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Create your first workflow to get started.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Workflow
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Runs</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        {workflow.description && (
                          <div className="text-sm text-muted-foreground">{workflow.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(workflow.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(workflow.status)}
                          {workflow.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{workflow.totalRuns}</TableCell>
                    <TableCell>
                      {workflow.totalRuns > 0 ? `${workflow.successRate}%` : '—'}
                    </TableCell>
                    <TableCell>
                      {workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>
                      {new Date(workflow.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`${workflow.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`${workflow.id}/preview`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(workflow.id)}
                        >
                          {workflow.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Workflow Dialog */}
      <CreateWorkflowDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateWorkflow={handleCreateWorkflow}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Workflows;