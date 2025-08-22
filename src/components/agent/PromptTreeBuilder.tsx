import React, { useCallback, useState, useRef, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Save, ArrowLeft, RotateCcw } from 'lucide-react';
import { PromptStateNode } from './PromptStateNode';

const nodeTypes = {
  promptState: PromptStateNode,
};

// Grid configuration for controlled positioning
const GRID_SIZE = 20;
const NODE_WIDTH = 250;
const NODE_HEIGHT = 120;
const MIN_DISTANCE = 180; // Minimum distance between nodes
const VERTICAL_SPACING = 200; // Vertical spacing between levels
const HORIZONTAL_SPACING = 300; // Horizontal spacing between siblings

// Initial starting position
const INITIAL_POSITION = { x: 400, y: 100 };

const initialNodes: Node[] = [
  {
    id: 'welcome',
    type: 'promptState',
    position: INITIAL_POSITION,
    data: { 
      label: 'Welcome',
      prompt: 'Welcome! How can I help you today?',
      isStarting: true
    },
  },
];

const initialEdges: Edge[] = [];

interface PromptTreeBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: { nodes: Node[]; edges: Edge[] }) => void;
}

export const PromptTreeBuilder: React.FC<PromptTreeBuilderProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Utility functions for smart positioning
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
    
    // If collision detected, find the nearest valid position using spiral search
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

  // Get smart position for new nodes based on tree structure
  const getSmartPosition = useCallback(() => {
    if (nodes.length === 0) {
      return INITIAL_POSITION;
    }

    // Find the most recently added node (highest y position)
    const lastNode = nodes.reduce((latest, node) => 
      node.position.y > latest.position.y ? node : latest
    );

    // Position new node below the last node
    const preferredPosition = {
      x: lastNode.position.x,
      y: lastNode.position.y + VERTICAL_SPACING,
    };

    return findValidPosition(preferredPosition);
  }, [nodes, findValidPosition]);

  // Enhanced nodes change handler with collision detection
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // Process position changes to prevent overlaps and enforce bounds
    const processedChanges = changes.map(change => {
      if (change.type === 'position' && change.position && change.dragging === false) {
        // Snap to grid and check for collisions when drag ends
        const validPosition = findValidPosition(change.position, change.id);
        
        // Enforce canvas bounds (prevent nodes from going too far)
        const boundedPosition = {
          x: Math.max(-200, Math.min(validPosition.x, 1200)),
          y: Math.max(0, Math.min(validPosition.y, 2000)),
        };
        
        return {
          ...change,
          position: boundedPosition,
        };
      }
      return change;
    });

    onNodesChange(processedChanges);
  }, [onNodesChange, findValidPosition]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNewState = useCallback(() => {
    const newId = `state_${Date.now()}`;
    const smartPosition = getSmartPosition();
    
    const newNode: Node = {
      id: newId,
      type: 'promptState',
      position: smartPosition,
      data: {
        label: `New State ${nodes.length}`,
        prompt: 'Enter your prompt here...',
        isStarting: false
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes, getSmartPosition]);

  // Auto-arrange function to reorganize nodes in a tree structure
  const autoArrangeNodes = useCallback(() => {
    if (nodes.length === 0) return;

    const arrangedNodes = nodes.map((node, index) => {
      let position = { ...INITIAL_POSITION };
      
      if (node.data.isStarting) {
        // Keep starting node at the top
        position = INITIAL_POSITION;
      } else {
        // Arrange other nodes in a vertical flow
        const nonStartingIndex = nodes.filter(n => !n.data.isStarting).indexOf(node);
        position = {
          x: INITIAL_POSITION.x + (nonStartingIndex % 2 === 0 ? 0 : HORIZONTAL_SPACING),
          y: INITIAL_POSITION.y + VERTICAL_SPACING * (Math.floor(nonStartingIndex / 2) + 1),
        };
      }
      
      return {
        ...node,
        position: snapToGrid(position),
      };
    });
    
    setNodes(arrangedNodes);
  }, [nodes, setNodes, snapToGrid]);

  const handleSave = () => {
    console.log('Saving prompt tree:', { nodes, edges });
    if (onSave) {
      onSave({ nodes, edges });
      console.log('onSave called from PromptTreeBuilder');
    }
    onOpenChange(false);
  };

  const canvasStyle = useMemo(() => ({
    backgroundColor: "#F7F9FB"
  }), []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-base font-medium">Prompt Tree Editor</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={autoArrangeNodes}
                className="flex items-center gap-2"
                title="Auto-arrange nodes"
              >
                <RotateCcw className="w-4 h-4" />
                Arrange
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={addNewState}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New State
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>

          {/* Flow Canvas */}
          <div className="flex-1 relative" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              style={canvasStyle}
              onNodeClick={(_, node) => setSelectedNode(node.id)}
              snapToGrid={true}
              snapGrid={[GRID_SIZE, GRID_SIZE]}
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
              minZoom={0.3}
              maxZoom={1.5}
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
            >
              <MiniMap 
                zoomable 
                pannable 
                nodeColor={(node) => {
                  if (node.data?.isStarting) return '#10b981';
                  return '#3b82f6';
                }}
                className="bg-white"
              />
              <Controls showInteractive={false} />
              <Background 
                variant={BackgroundVariant.Dots}
                gap={GRID_SIZE}
                size={1}
                className="opacity-30"
              />
            </ReactFlow>

            {/* Floating Help Text */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 max-w-xs">
              <p className="font-medium mb-1">💡 Smart Tree Builder</p>
              <p>• New nodes auto-position below existing ones</p>
              <p>• Drag nodes - they'll snap to grid and avoid overlaps</p>
              <p>• Use "Arrange" to auto-organize your tree</p>
            </div>

            {/* Floating New State Button */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
              <Button
                onClick={addNewState}
                className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg"
              >
                <Plus className="w-5 h-5" />
                New State
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
