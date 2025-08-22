import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
  NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { nodeTypes } from './CustomNodes';
import { NodeConfigPanel } from './NodeConfigPanel';
import { TriggerSelectDialog } from './TriggerSelectDialog';
import { ActionSelectDialog } from './ActionSelectDialog';
// Simple placeholder components
const EmptyWorkflowState = ({ onAddFirstNode }: any) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <div className="mb-4">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">🔗</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">Start building your workflow</h3>
      <p className="text-muted-foreground mb-4">Add your first step to get started</p>
      <Button onClick={onAddFirstNode}>Add First Step</Button>
    </div>
  </div>
);

import { useToast } from '@/hooks/use-toast';

// Import custom node types from CustomNodes file

interface WorkflowBuilderProps {
  workflowId?: string;
  nodes?: Node[];
  edges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
}

const WorkflowBuilderInner = ({ 
  workflowId = 'default', 
  nodes: initialNodes = [], 
  edges: initialEdges = [],
  onNodesChange,
  onEdgesChange 
}: WorkflowBuilderProps) => {
  const { toast } = useToast();
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);

  // Grid configuration for controlled positioning
  const GRID_SIZE = 20;
  const NODE_WIDTH = 200;
  const NODE_HEIGHT = 80;
  const MIN_DISTANCE = 220; // Minimum distance between nodes

  // Utility functions for collision detection and grid snapping
  const snapToGrid = useCallback((position: { x: number; y: number }) => {
    return {
      x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(position.y / GRID_SIZE) * GRID_SIZE,
    };
  }, []);

  const checkCollision = useCallback((newPosition: { x: number; y: number }, nodeId?: string) => {
    return nodes.some(node => {
      if (node.id === nodeId) return false; // Skip self
      
      const distance = Math.sqrt(
        Math.pow(newPosition.x - node.position.x, 2) + 
        Math.pow(newPosition.y - node.position.y, 2)
      );
      
      return distance < MIN_DISTANCE;
    });
  }, [nodes]);

  const findValidPosition = useCallback((preferredPosition: { x: number; y: number }, nodeId?: string) => {
    let position = snapToGrid(preferredPosition);
    
    // If collision detected, find the nearest valid position
    if (checkCollision(position, nodeId)) {
      const searchRadius = MIN_DISTANCE;
      let found = false;
      
      // Search in expanding spiral pattern
      for (let radius = searchRadius; radius <= searchRadius * 3 && !found; radius += GRID_SIZE) {
        for (let angle = 0; angle < 360 && !found; angle += 45) {
          const radians = (angle * Math.PI) / 180;
          const testPosition = {
            x: position.x + Math.cos(radians) * radius,
            y: position.y + Math.sin(radians) * radius,
          };
          
          const snappedPosition = snapToGrid(testPosition);
          if (!checkCollision(snappedPosition, nodeId)) {
            position = snappedPosition;
            found = true;
          }
        }
      }
    }
    
    return position;
  }, [snapToGrid, checkCollision]);

  // Sync external changes
  React.useEffect(() => {
    console.log('🔄 WorkflowBuilder: External nodes changed:', initialNodes?.length);
    if (initialNodes && initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    console.log('🔄 WorkflowBuilder: External edges changed:', initialEdges?.length);
    if (initialEdges && initialEdges.length > 0) {
      setEdges(initialEdges);
    }
  }, [initialEdges, setEdges]);

  const isEmptyWorkflow = useMemo(() => {
    const isEmpty = !nodes || nodes.length === 0 || 
      (nodes.length <= 2 && nodes.every(node => 
        node.data.nodeType === 'start' || node.data.nodeType === 'end-call'
      ));
    console.log('🎯 isEmpty check:', { 
      nodes: nodes?.length, 
      isEmpty, 
      nodeTypes: nodes?.map(n => n.data.nodeType) 
    });
    return isEmpty;
  }, [nodes]);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // Process position changes to prevent overlaps
    const processedChanges = changes.map(change => {
      if (change.type === 'position' && change.position && change.dragging === false) {
        // Snap to grid and check for collisions when drag ends
        const validPosition = findValidPosition(change.position, change.id);
        return {
          ...change,
          position: validPosition,
        };
      }
      return change;
    });

    onNodesChangeInternal(processedChanges);
    if (onNodesChange) {
      // Get the updated nodes after the change
      const updatedNodes = nodes; // This will be updated by the internal handler
      onNodesChange(updatedNodes);
    }
  }, [onNodesChangeInternal, onNodesChange, nodes, findValidPosition]);

  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChangeInternal(changes);
    if (onEdgesChange) {
      const updatedEdges = edges;
      onEdgesChange(updatedEdges);
    }
  }, [onEdgesChangeInternal, onEdgesChange, edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `${workflowId}-edge-${Date.now()}`,
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      };
      const updatedEdges = addEdge(newEdge, edges);
      setEdges(updatedEdges);
      if (onEdgesChange) {
        onEdgesChange(updatedEdges);
      }
    },
    [setEdges, workflowId, edges, onEdgesChange]
  );

  const onNodeClick = useCallback((event: any, node: Node) => {
    setSelectedNode(node);
    setConfigPanelOpen(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setConfigPanelOpen(false);
  }, []);

  const handleAddNode = useCallback((nodeType: string, nodeData?: any, position?: { x: number; y: number }) => {
    const preferredPosition = position || { x: 400, y: 200 };
    const validPosition = findValidPosition(preferredPosition);
    const nodeId = `${workflowId}-${nodeType}-${Date.now()}`;
    
    // Use provided nodeData if available, otherwise fall back to defaults
    const config = nodeData || {
      label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1).replace('-', ' '),
      icon: 'MessageCircle',
      nodeType: nodeType,
    };

    const newNode: Node = {
      id: nodeId,
      type: 'custom',
      position: validPosition,
      data: {
        label: config.label || config.name,
        ...config,
        workflowId,
      },
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    
    if (onNodesChange) {
      onNodesChange(updatedNodes);
    }

    // Special handling for different node types
    if (nodeType === 'find-contact') {
      // Add a Find Contact node, then create if-else branching structure
      setTimeout(() => {
        const branchNodes = [];
        const branchEdges = [];
        
        // Contact Found branch
        const contactFoundId = `${workflowId}-contact-found-${Date.now()}`;
        const contactFoundNode: Node = {
          id: contactFoundId,
          type: 'custom',
          position: findValidPosition({ x: validPosition.x - 150, y: validPosition.y + 150 }),
          data: {
            label: 'Contact Found',
            nodeType: 'contact-found',
            workflowId,
          },
        };
        branchNodes.push(contactFoundNode);
        
        // Contact Not Found branch
        const contactNotFoundId = `${workflowId}-contact-not-found-${Date.now()}`;
        const contactNotFoundNode: Node = {
          id: contactNotFoundId,
          type: 'custom',
          position: findValidPosition({ x: validPosition.x + 150, y: validPosition.y + 150 }),
          data: {
            label: 'Contact Not Found',
            nodeType: 'contact-not-found',
            workflowId,
          },
        };
        branchNodes.push(contactNotFoundNode);
        
        // End nodes for each branch
        const endFoundId = `${workflowId}-end-found-${Date.now()}`;
        const endFoundNode: Node = {
          id: endFoundId,
          type: 'custom',
          position: findValidPosition({ x: validPosition.x - 150, y: validPosition.y + 300 }),
          data: {
            label: 'END',
            nodeType: 'end',
            workflowId,
          },
        };
        branchNodes.push(endFoundNode);
        
        const endNotFoundId = `${workflowId}-end-not-found-${Date.now()}`;
        const endNotFoundNode: Node = {
          id: endNotFoundId,
          type: 'custom',
          position: findValidPosition({ x: validPosition.x + 150, y: validPosition.y + 300 }),
          data: {
            label: 'END',
            nodeType: 'end',
            workflowId,
          },
        };
        branchNodes.push(endNotFoundNode);
        
        // Create edges
        branchEdges.push({
          id: `${workflowId}-edge-found-${Date.now()}`,
          source: nodeId,
          target: contactFoundId,
          type: 'smoothstep',
          style: { stroke: '#10b981', strokeWidth: 2 },
          label: 'Found',
        });
        
        branchEdges.push({
          id: `${workflowId}-edge-not-found-${Date.now()}`,
          source: nodeId,
          target: contactNotFoundId,
          type: 'smoothstep',
          style: { stroke: '#ef4444', strokeWidth: 2 },
          label: 'Not Found',
        });
        
        branchEdges.push({
          id: `${workflowId}-edge-end-found-${Date.now()}`,
          source: contactFoundId,
          target: endFoundId,
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        });
        
        branchEdges.push({
          id: `${workflowId}-edge-end-not-found-${Date.now()}`,
          source: contactNotFoundId,
          target: endNotFoundId,
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        });
        
        const finalNodes = [...updatedNodes, ...branchNodes];
        const finalEdges = [...edges, ...branchEdges];
        
        setNodes(finalNodes);
        setEdges(finalEdges);
        
        if (onNodesChange) onNodesChange(finalNodes);
        if (onEdgesChange) onEdgesChange(finalEdges);
      }, 100);
    }
    
    toast({
      title: "Node Added",
      description: `${config.label || config.name} has been added to your workflow.`,
    });
  }, [workflowId, nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, toast, findValidPosition]);

  const handleSelectTrigger = useCallback((trigger: any) => {
    handleAddNode(trigger.id, trigger);
  }, [handleAddNode]);

  const handleSelectAction = useCallback((action: any) => {
    handleAddNode(action.id, action);
  }, [handleAddNode]);

  const handleUpdateNode = useCallback((nodeId: string, newData: any) => {
    const updatedNodes = nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
    );
    setNodes(updatedNodes);
    
    if (onNodesChange) {
      onNodesChange(updatedNodes);
    }
    
    toast({
      title: "Node Updated",
      description: "Node configuration has been saved.",
    });
  }, [nodes, setNodes, onNodesChange, toast]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      
      if (typeof nodeType === 'undefined' || !nodeType) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      handleAddNode(nodeType, undefined, position);
    },
    [screenToFlowPosition, handleAddNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  console.log('🔄 WorkflowBuilder render:', { nodes: nodes?.length, edges: edges?.length, isEmptyWorkflow });

  if (isEmptyWorkflow) {
    return (
      <div className="w-full h-full bg-white relative flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Start building your workflow</h3>
            <p className="text-muted-foreground mb-4">Use the sidebar to add triggers and actions to your workflow</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white relative" ref={reactFlowWrapper}>
      {/* ReactFlow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="workflow-builder"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={GRID_SIZE} 
          size={1}
          className="opacity-30"
        />
        <Controls />
        <MiniMap
          zoomable
          pannable
          className="bg-background"
          nodeColor={(node) => {
            switch (node.data?.nodeType) {
              case 'start':
              case 'webhook-trigger':
              case 'schedule-trigger':
              case 'email-trigger':
                return '#10b981';
              case 'end-call':
                return '#ef4444';
              case 'if-else':
                return '#8b5cf6';
              default:
                return '#3b82f6';
            }
          }}
        />
      </ReactFlow>

      {/* Node Configuration Panel */}
      {configPanelOpen && selectedNode && (
        <div className="absolute top-4 right-4 z-20">
          <NodeConfigPanel
            node={selectedNode}
            onUpdate={handleUpdateNode}
            onDelete={(nodeId) => {
              const updatedNodes = nodes.filter(n => n.id !== nodeId);
              const updatedEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
              setNodes(updatedNodes);
              setEdges(updatedEdges);
              if (onNodesChange) onNodesChange(updatedNodes);
              if (onEdgesChange) onEdgesChange(updatedEdges);
              setConfigPanelOpen(false);
            }}
            onClose={() => setConfigPanelOpen(false)}
          />
        </div>
      )}

    </div>
  );
};

export const WorkflowBuilder = (props: WorkflowBuilderProps) => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner {...props} />
    </ReactFlowProvider>
  );
};