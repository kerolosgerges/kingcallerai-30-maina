
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './CustomNodes';

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onNodeClick?: (event: any, node: Node) => void;
  onPaneClick?: () => void;
  className?: string;
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  className = "w-full h-full"
}: WorkflowCanvasProps) {
  return (
    <div className={className}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="workflow-canvas"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
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
              case 'trigger':
                return '#10b981'; // Green for triggers
              case 'action':
                return '#3b82f6'; // Blue for actions
              case 'condition':
                return '#8b5cf6'; // Purple for conditions
              case 'end':
                return '#ef4444'; // Red for end nodes
              default:
                return '#6b7280'; // Gray for others
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}
