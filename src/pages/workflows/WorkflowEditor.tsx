import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { SidebarProvider } from '@/components/ui/sidebar';
import { WorkflowBuilder } from '@/components/workflows/WorkflowBuilder';
import { WorkflowStarter } from '@/components/workflows/WorkflowStarter';
import { WorkflowValidationPanel } from '@/components/workflows/WorkflowValidationPanel';
import { ActionSequenceBuilder } from '@/components/workflows/ActionSequenceBuilder';
import { PanelManager } from '@/components/workflows/PanelManager';
import { Save, Play, ArrowLeft, Settings, Eye, GitBranch, RefreshCw, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateWorkflow, getWorkflowSuggestions } from '@/utils/workflowValidation';

interface WorkflowData {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'draft';
  nodes: any[];
  edges: any[];
  lastRun?: string;
  totalRuns: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
  settings?: {
    allowReEntry: boolean;
    allowMultipleOpportunities: boolean;
    stopOnResponse: boolean;
    timezone: string;
    timeWindow: boolean;
    fromName: string;
    fromEmail: string;
    fromNumber: string;
    markAsRead: boolean;
  };
}

interface EnrollmentRecord {
  id: string;
  contact: string;
  enrollmentReason: string;
  dateEnrolled: string;
  currentAction: string;
  status: 'active' | 'completed' | 'error';
}

export default function WorkflowEditor() {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [workflow, setWorkflow] = useState<WorkflowData>({
    id: workflowId || 'new',
    name: 'New Workflow',
    description: '',
    status: 'draft',
    nodes: [
      {
        id: 'add-trigger',
        type: 'custom',
        position: { x: 300, y: 100 },
        data: {
          label: 'Add New Trigger',
          nodeType: 'add-new-trigger',
          workflowId: workflowId || 'new',
        },
      }
    ],
    edges: [],
    totalRuns: 0,
    successRate: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      allowReEntry: false,
      allowMultipleOpportunities: false,
      stopOnResponse: false,
      timezone: 'America/New_York',
      timeWindow: false,
      fromName: 'Company Name',
      fromEmail: 'company@example.com',
      fromNumber: '+1234567890',
      markAsRead: false,
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentRecord[]>([]);

  const [workflowStep, setWorkflowStep] = useState<'select-trigger' | 'build-sequence' | 'visual-builder'>('select-trigger');
  const [selectedTrigger, setSelectedTrigger] = useState<any>(null);
  const [actionSequence, setActionSequence] = useState<any[]>([]);

  // Check if workflow is empty (needs trigger selection)
  const isEmptyWorkflow = useMemo(() => {
    const hasTrigger = workflow.nodes.some(node => 
      node.data.nodeType?.includes('trigger') ||
      ['contact-created', 'contact-changed', 'birthday-reminder', 'note-added', 'task-reminder', 'contact-tag']
        .includes(node.data.nodeType)
    );
    return !hasTrigger || workflow.nodes.length <= 1;
  }, [workflow.nodes]);

  // Workflow validation
  const validation = useMemo(() => {
    return validateWorkflow(workflow.nodes, workflow.edges);
  }, [workflow.nodes, workflow.edges]);

  const suggestions = useMemo(() => {
    return getWorkflowSuggestions(workflow.nodes, workflow.edges);
  }, [workflow.nodes, workflow.edges]);

  // Initialize with sample data
  useEffect(() => {
    // Sample enrollment data
    setEnrollmentData([
      {
        id: '1',
        contact: 'John Doe',
        enrollmentReason: 'Manual enrollment',
        dateEnrolled: '2024-01-15',
        currentAction: 'Step 1: Initial Contact',
        status: 'active'
      },
      {
        id: '2',
        contact: 'Jane Smith',
        enrollmentReason: 'API trigger',
        dateEnrolled: '2024-02-01',
        currentAction: 'Step 2: Send Email',
        status: 'completed'
      },
      {
        id: '3',
        contact: 'Alice Johnson',
        enrollmentReason: 'Schedule trigger',
        dateEnrolled: '2024-02-10',
        currentAction: 'Error: Invalid phone number',
        status: 'error'
      },
    ]);
  }, [workflowId]);

  const handleSelectTrigger = useCallback((trigger: any) => {
    console.log('🎯 Selected trigger:', trigger);
    
    // Create trigger node
    const triggerNode = {
      id: `${workflowId}-trigger-${Date.now()}`,
      type: 'custom',
      position: { x: 300, y: 100 },
      data: {
        label: trigger.name,
        nodeType: trigger.id,
        workflowId: workflowId || 'new',
        ...trigger,
        isTrigger: true
      },
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [triggerNode],
      edges: []
    }));
    
    setSelectedTrigger(trigger);
    setWorkflowStep('build-sequence');
    setHasUnsavedChanges(true);
    
    toast({
      title: "Trigger Added",
      description: `${trigger.name} trigger has been set as your workflow start.`,
    });
  }, [workflowId, toast]);

  const handleUseTemplate = useCallback((template: any) => {
    console.log('🎯 Using template:', template);
    
    // Find the trigger for this template
    const triggerData = {
      id: template.trigger,
      name: template.name.replace('Template', 'Trigger'),
      nodeType: template.trigger
    };
    
    // Create complete workflow from template
    const triggerNode = {
      id: `${workflowId}-trigger-${Date.now()}`,
      type: 'custom',
      position: { x: 300, y: 100 },
      data: {
        label: triggerData.name,
        nodeType: template.trigger,
        workflowId: workflowId || 'new',
        isTrigger: true
      },
    };

    // Add some sample actions based on template
    const sampleActions = [];
    let yPosition = 250;
    
    for (let i = 0; i < template.actionCount; i++) {
      sampleActions.push({
        id: `${workflowId}-action-${Date.now()}-${i}`,
        type: 'custom',
        position: { x: 300, y: yPosition },
        data: {
          label: `Action ${i + 1}`,
          nodeType: 'action',
          workflowId: workflowId || 'new',
        },
      });
      yPosition += 150;
    }

    setWorkflow(prev => ({
      ...prev,
      name: template.name,
      nodes: [triggerNode, ...sampleActions],
      edges: []
    }));
    
    setSelectedTrigger(triggerData);
    setWorkflowStep('visual-builder');
    setHasUnsavedChanges(true);
    
    toast({
      title: "Template Applied",
      description: `${template.name} template has been applied to your workflow.`,
    });
  }, [workflowId, toast]);

  const handleAddActionToSequence = useCallback((action: any) => {
    const newAction = {
      id: `action-${Date.now()}`,
      type: action.nodeType || action.id,
      name: action.name,
      description: action.description,
      config: {},
      ...action
    };
    
    setActionSequence(prev => [...prev, newAction]);
    
    // Also add to workflow nodes
    const actionNode = {
      id: `${workflowId}-action-${Date.now()}`,
      type: 'custom',
      position: { x: 300, y: 250 + (actionSequence.length * 150) },
      data: {
        label: action.name,
        nodeType: action.nodeType || action.id,
        workflowId: workflowId || 'new',
        ...action
      },
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, actionNode],
    }));
    
    setHasUnsavedChanges(true);
    
    toast({
      title: "Action Added",
      description: `${action.name} has been added to your sequence.`,
    });
  }, [workflowId, actionSequence.length, toast]);

  const handleAddTrigger = useCallback((trigger: any) => {
    console.log('🎯 Adding trigger:', trigger);
    
    const newTriggerNode = {
      id: `${workflowId}-trigger-${Date.now()}`,
      type: 'custom',
      position: { x: 300, y: 100 },
      data: {
        label: trigger.name,
        nodeType: trigger.nodeType,
        workflowId: workflowId || 'new',
        ...trigger
      },
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [newTriggerNode, ...prev.nodes.filter(n => n.data.nodeType !== 'add-new-trigger')],
    }));
    
    setHasUnsavedChanges(true);
    
    toast({
      title: "Trigger Added",
      description: `${trigger.name} trigger has been added to your workflow.`,
    });
  }, [workflowId, toast]);

  const handleAddAction = useCallback((action: any) => {
    console.log('🎯 Adding action:', action);
    
    const newActionNode = {
      id: `${workflowId}-action-${Date.now()}`,
      type: 'custom',
      position: { x: 400, y: 300 },
      data: {
        label: action.name,
        nodeType: action.nodeType,
        workflowId: workflowId || 'new',
        ...action
      },
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newActionNode],
    }));
    
    setHasUnsavedChanges(true);
    
    toast({
      title: "Action Added",
      description: `${action.name} action has been added to your workflow.`,
    });
  }, [workflowId, toast]);

  const handleNodesChange = useCallback((newNodes: any[]) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: newNodes,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleEdgesChange = useCallback((newEdges: any[]) => {
    setWorkflow(prev => ({
      ...prev,
      edges: newEdges,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = async () => {
    try {
      // Save workflow logic here
      console.log('Saving workflow:', workflow);
      setHasUnsavedChanges(false);
      toast({
        title: "Workflow Saved",
        description: "Your workflow has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save workflow. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async () => {
    try {
      setWorkflow(prev => ({ ...prev, status: 'active' }));
      await handleSave();
      toast({
        title: "Workflow Published",
        description: "Your workflow is now active and running.",
      });
    } catch (error) {
      toast({
        title: "Publish Failed",
        description: "Failed to publish workflow. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Determine which view to show
  const renderWorkflowContent = () => {
    if (isEmptyWorkflow && workflowStep === 'select-trigger') {
      return (
        <WorkflowStarter
          onSelectTrigger={handleSelectTrigger}
          onUseTemplate={handleUseTemplate}
        />
      );
    }

    if (workflowStep === 'build-sequence' && selectedTrigger) {
      return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Build Your Action Sequence</h2>
            <p className="text-muted-foreground">
              Add actions that will run when "{selectedTrigger.name}" occurs
            </p>
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" />
              Trigger: {selectedTrigger.name}
            </Badge>
          </div>

          {/* Action Sequence Builder */}
          <ActionSequenceBuilder
            actions={actionSequence}
            onActionsChange={setActionSequence}
            onAddAction={handleAddActionToSequence}
            triggerType={selectedTrigger.id}
          />

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setWorkflowStep('select-trigger')}
            >
              Back to Triggers
            </Button>
            <Button
              onClick={() => setWorkflowStep('visual-builder')}
              disabled={actionSequence.length === 0}
            >
              Open Visual Builder
              <GitBranch className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    // Visual builder (existing functionality)
    return (
      <div className="h-[calc(100vh-160px)] flex flex-col">
        <PanelManager
          onAddTrigger={handleAddTrigger}
          onAddAction={handleAddAction}
        />
        <div className="flex-1 relative">
          <WorkflowBuilder
            workflowId={workflowId}
            nodes={workflow.nodes}
            edges={workflow.edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
          />
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/workflows')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workflows
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{workflow.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                    {workflow.status}
                  </Badge>
                  {hasUnsavedChanges && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Unsaved Changes
                    </Badge>
                  )}
                  {!validation.isValid && (
                    <Badge variant="destructive" className="text-xs">
                      Validation Issues
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Switch between views */}
              {!isEmptyWorkflow && (
                <div className="flex items-center gap-1 mr-4">
                  <Button
                    variant={workflowStep === 'build-sequence' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setWorkflowStep('build-sequence')}
                  >
                    Sequence
                  </Button>
                  <Button
                    variant={workflowStep === 'visual-builder' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setWorkflowStep('visual-builder')}
                  >
                    Visual
                  </Button>
                </div>
              )}
              
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              
              <Button size="sm" onClick={handlePublish} disabled={!validation.isValid}>
                <Play className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Tabs defaultValue="builder" className="h-full">
              <div className="bg-white border-b border-gray-200 px-6">
                <TabsList className="grid w-auto grid-cols-4">
                  <TabsTrigger value="builder" className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Builder
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="validation" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Validation
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="builder" className="m-0 h-full">
                {renderWorkflowContent()}
              </TabsContent>

              {/* Validation Tab */}
              <TabsContent value="validation" className="p-6">
                <div className="max-w-4xl space-y-6">
                  <WorkflowValidationPanel
                    validation={validation}
                    suggestions={suggestions}
                  />
                  
                  {/* Quick Fixes */}
                  {!validation.isValid && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Fixes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {validation.errors.includes('Workflow must start with at least one trigger') && (
                          <Button
                            variant="outline"
                            onClick={() => setWorkflowStep('select-trigger')}
                            className="w-full justify-start"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Add a Trigger to Start Your Workflow
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="p-6">
                <div className="max-w-4xl space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Workflow Name</Label>
                          <Input
                            id="name"
                            value={workflow.name}
                            onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={workflow.status}
                            onValueChange={(value: 'active' | 'paused' | 'draft') =>
                              setWorkflow(prev => ({ ...prev, status: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={workflow.description}
                          onChange={(e) => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what this workflow does..."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="allowReEntry">Allow Re-Entry</Label>
                          <Switch
                            id="allowReEntry"
                            checked={workflow.settings?.allowReEntry}
                            onCheckedChange={(checked) =>
                              setWorkflow(prev => ({
                                ...prev,
                                settings: { ...prev.settings, allowReEntry: checked },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="allowMultipleOpportunities">Allow Multiple Opportunities</Label>
                          <Switch
                            id="allowMultipleOpportunities"
                            checked={workflow.settings?.allowMultipleOpportunities}
                            onCheckedChange={(checked) =>
                              setWorkflow(prev => ({
                                ...prev,
                                settings: { ...prev.settings, allowMultipleOpportunities: checked },
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="stopOnResponse">Stop On Response</Label>
                          <Switch
                            id="stopOnResponse"
                            checked={workflow.settings?.stopOnResponse}
                            onCheckedChange={(checked) =>
                              setWorkflow(prev => ({
                                ...prev,
                                settings: { ...prev.settings, stopOnResponse: checked },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select
                            value={workflow.settings?.timezone}
                            onValueChange={(value: string) =>
                              setWorkflow(prev => ({
                                ...prev,
                                settings: { ...prev.settings, timezone: value },
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">America/New_York</SelectItem>
                              <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                              {/* Add more timezones as needed */}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeWindow">Time Window</Label>
                        <Switch
                          id="timeWindow"
                          checked={workflow.settings?.timeWindow}
                          onCheckedChange={(checked) =>
                            setWorkflow(prev => ({
                              ...prev,
                              settings: { ...prev.settings, timeWindow: checked },
                            }))
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Communication Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fromName">From Name</Label>
                          <Input
                            id="fromName"
                            value={workflow.settings?.fromName}
                            onChange={(e) =>
                              setWorkflow(prev => ({
                                ...prev,
                                settings: { ...prev.settings, fromName: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fromEmail">From Email</Label>
                          <Input
                            id="fromEmail"
                            type="email"
                            value={workflow.settings?.fromEmail}
                            onChange={(e) =>
                              setWorkflow(prev => ({
                                ...prev,
                                settings: { ...prev.settings, fromEmail: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fromNumber">From Number</Label>
                          <Input
                            id="fromNumber"
                            value={workflow.settings?.fromNumber}
                            onChange={(e) =>
                              setWorkflow(prev => ({
                                ...prev,
                                settings: { ...prev.settings, fromNumber: e.target.value },
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="markAsRead">Mark As Read</Label>
                        <Switch
                          id="markAsRead"
                          checked={workflow.settings?.markAsRead}
                          onCheckedChange={(checked) =>
                            setWorkflow(prev => ({
                              ...prev,
                              settings: { ...prev.settings, markAsRead: checked },
                            }))
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold">{workflow.totalRuns}</div>
                        <p className="text-xs text-muted-foreground">Total Runs</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold">{workflow.successRate}%</div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">Active Enrollments</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </CardContent>
                    </Card>
                  </div>
                  {/* Add charts and analytics here */}
                </div>
              </TabsContent>

              {/* Enrollments Tab */}
              <TabsContent value="enrollments" className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Enrollments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contact</TableHead>
                          <TableHead>Enrollment Reason</TableHead>
                          <TableHead>Date Enrolled</TableHead>
                          <TableHead>Current Action</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrollmentData.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.contact}</TableCell>
                            <TableCell>{record.enrollmentReason}</TableCell>
                            <TableCell>{record.dateEnrolled}</TableCell>
                            <TableCell>{record.currentAction}</TableCell>
                            <TableCell>
                              <Badge variant={record.status === 'active' ? 'default' : 'secondary'}>
                                {record.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
