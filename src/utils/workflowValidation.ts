
export interface WorkflowValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface WorkflowNode {
  id: string;
  type: string;
  data: {
    nodeType: string;
    label: string;
    [key: string]: any;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export function validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Rule 1: Must have at least one trigger
  const triggerNodes = nodes.filter(node => 
    node.data.nodeType?.includes('trigger') || 
    node.data.nodeType === 'contact-created' ||
    node.data.nodeType === 'contact-changed' ||
    node.data.nodeType === 'birthday-reminder' ||
    node.data.nodeType === 'note-added' ||
    node.data.nodeType === 'task-reminder' ||
    node.data.nodeType === 'contact-tag'
  );

  if (triggerNodes.length === 0) {
    errors.push('Workflow must start with at least one trigger');
  }

  // Rule 2: Trigger nodes should not have incoming connections
  triggerNodes.forEach(trigger => {
    const incomingEdges = edges.filter(edge => edge.target === trigger.id);
    if (incomingEdges.length > 0) {
      warnings.push(`Trigger "${trigger.data.label}" has incoming connections - triggers should be the starting point`);
    }
  });

  // Rule 3: All nodes (except triggers) should be reachable from a trigger
  const reachableNodes = new Set<string>();
  
  function markReachable(nodeId: string) {
    if (reachableNodes.has(nodeId)) return;
    reachableNodes.add(nodeId);
    
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    outgoingEdges.forEach(edge => markReachable(edge.target));
  }

  // Start from all trigger nodes
  triggerNodes.forEach(trigger => markReachable(trigger.id));

  // Check for unreachable nodes
  const unreachableNodes = nodes.filter(node => 
    !reachableNodes.has(node.id) && 
    !triggerNodes.some(trigger => trigger.id === node.id)
  );

  unreachableNodes.forEach(node => {
    warnings.push(`Node "${node.data.label}" is not reachable from any trigger`);
  });

  // Rule 4: Should have at least one action after triggers
  const actionNodes = nodes.filter(node => 
    node.data.nodeType?.includes('action') ||
    node.data.nodeType === 'find-contact' ||
    node.data.nodeType === 'create-contact' ||
    node.data.nodeType === 'update-contact-field' ||
    node.data.nodeType === 'add-contact-tag' ||
    node.data.nodeType === 'send-email' ||
    node.data.nodeType === 'send-sms'
  );

  if (actionNodes.length === 0 && nodes.length > 1) {
    warnings.push('Workflow should include at least one action after the trigger');
  }

  // Rule 5: Check for isolated nodes (no connections at all)
  const isolatedNodes = nodes.filter(node => {
    const hasIncoming = edges.some(edge => edge.target === node.id);
    const hasOutgoing = edges.some(edge => edge.source === node.id);
    const isTrigger = triggerNodes.some(trigger => trigger.id === node.id);
    
    return !hasIncoming && !hasOutgoing && !isTrigger;
  });

  isolatedNodes.forEach(node => {
    warnings.push(`Node "${node.data.label}" has no connections`);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function getWorkflowSuggestions(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] {
  const suggestions: string[] = [];
  
  const triggerNodes = nodes.filter(node => 
    node.data.nodeType?.includes('trigger') || 
    ['contact-created', 'contact-changed', 'birthday-reminder', 'note-added', 'task-reminder', 'contact-tag']
      .includes(node.data.nodeType)
  );

  // Suggest actions based on trigger type
  triggerNodes.forEach(trigger => {
    const triggerConnections = edges.filter(edge => edge.source === trigger.id);
    
    if (triggerConnections.length === 0) {
      switch (trigger.data.nodeType) {
        case 'contact-created':
          suggestions.push('Consider adding a "Send Welcome Email" action after the contact created trigger');
          break;
        case 'birthday-reminder':
          suggestions.push('Add a "Send Birthday Message" action to complete the birthday workflow');
          break;
        case 'contact-tag':
          suggestions.push('Add actions like "Update Contact Field" or "Send Follow-up Email" after tag assignment');
          break;
        default:
          suggestions.push(`Add an action after the "${trigger.data.label}" trigger to make the workflow functional`);
      }
    }
  });

  // Suggest adding conditions for complex workflows
  if (nodes.length > 3 && !nodes.some(node => node.data.nodeType === 'condition')) {
    suggestions.push('Consider adding conditions to create branching logic in your workflow');
  }

  return suggestions;
}
