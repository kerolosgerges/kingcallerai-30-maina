import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, Settings, GitBranch, Clock, Phone, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowStep {
  id: string;
  type: string;
  label: string;
  duration?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface WorkflowExecution {
  id: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed';
  steps: WorkflowStep[];
  caller?: string;
  duration?: string;
}

const WorkflowPreview = () => {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [workflow, setWorkflow] = useState<any>(null);
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Mock workflow data
    const mockWorkflow = {
      id: workflowId,
      name: 'Lead Qualification Workflow',
      description: 'Automated lead qualification and scoring process',
      status: 'active',
      steps: [
        { id: '1', type: 'start', label: 'Start Call', icon: Phone },
        { id: '2', type: 'say', label: 'Welcome Message', icon: MessageCircle },
        { id: '3', type: 'gather', label: 'Collect Information', icon: MessageCircle },
        { id: '4', type: 'api-request', label: 'Score Lead', icon: MessageCircle },
        { id: '5', type: 'if-else', label: 'Qualification Check', icon: MessageCircle },
        { id: '6', type: 'end-call', label: 'End Call', icon: Phone },
      ]
    };
    setWorkflow(mockWorkflow);
  }, [workflowId]);

  const handleStartTest = () => {
    setIsRunning(true);
    const mockExecution: WorkflowExecution = {
      id: `exec-${Date.now()}`,
      startTime: new Date().toISOString(),
      status: 'running',
      caller: 'Test User',
      steps: workflow.steps.map((step: any) => ({
        ...step,
        status: 'pending' as const
      }))
    };
    
    setExecution(mockExecution);
    
    // Simulate step execution
    simulateExecution(mockExecution);
    
    toast({
      title: "Test Started",
      description: "Workflow test execution has begun.",
    });
  };

  const simulateExecution = async (exec: WorkflowExecution) => {
    const steps = [...exec.steps];
    
    for (let i = 0; i < steps.length; i++) {
      // Update current step to running
      steps[i].status = 'running';
      setExecution(prev => prev ? { ...prev, steps: [...steps] } : null);
      
      // Simulate step duration
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      // Complete the step
      steps[i].status = 'completed';
      steps[i].duration = `${(2 + Math.random() * 3).toFixed(1)}s`;
      setExecution(prev => prev ? { ...prev, steps: [...steps] } : null);
    }
    
    // Complete execution
    setExecution(prev => prev ? {
      ...prev,
      status: 'completed',
      endTime: new Date().toISOString(),
      duration: `${((Date.now() - new Date(exec.startTime).getTime()) / 1000).toFixed(1)}s`
    } : null);
    
    setIsRunning(false);
    
    toast({
      title: "Test Completed",
      description: "Workflow test execution finished successfully.",
    });
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'start':
      case 'end-call':
        return Phone;
      default:
        return MessageCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!workflow) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <GitBranch className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Loading Workflow...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/workflows/${workflowId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                <h1 className="text-lg font-semibold">{workflow.name} - Preview</h1>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Test Mode
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/workflows/${workflowId}`)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                onClick={handleStartTest}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Test
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workflow Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflow.steps.map((step: any, index: number) => {
                  const Icon = getStepIcon(step.type);
                  const executionStep = execution?.steps.find(s => s.id === step.id);
                  const status = executionStep?.status || 'pending';
                  
                  return (
                    <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          status === 'running' ? 'bg-blue-100' :
                          status === 'completed' ? 'bg-green-100' :
                          status === 'failed' ? 'bg-red-100' :
                          'bg-gray-100'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            status === 'running' ? 'text-blue-600' :
                            status === 'completed' ? 'text-green-600' :
                            status === 'failed' ? 'text-red-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{step.label}</span>
                          <div className="flex items-center gap-2">
                            {executionStep?.duration && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {executionStep.duration}
                              </span>
                            )}
                            <Badge variant="outline" className={getStatusColor(status)}>
                              {status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Execution Details */}
          <Card>
            <CardHeader>
              <CardTitle>Test Execution</CardTitle>
            </CardHeader>
            <CardContent>
              {execution ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <Badge variant="outline" className={getStatusColor(execution.status)}>
                        {execution.status}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Duration</label>
                      <div className="text-sm">
                        {execution.duration || `${((Date.now() - new Date(execution.startTime).getTime()) / 1000).toFixed(1)}s`}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Started</label>
                      <div className="text-sm">
                        {new Date(execution.startTime).toLocaleTimeString()}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Caller</label>
                      <div className="text-sm">{execution.caller || '—'}</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Progress</label>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Steps Completed</span>
                        <span>
                          {execution.steps.filter(s => s.status === 'completed').length} / {execution.steps.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(execution.steps.filter(s => s.status === 'completed').length / execution.steps.length) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Play className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Test</h3>
                  <p className="text-muted-foreground mb-4">
                    Click "Start Test" to run this workflow and see how it performs.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPreview;