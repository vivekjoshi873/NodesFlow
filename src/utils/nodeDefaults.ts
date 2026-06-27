import { v4 as uuidv4 } from 'uuid'
import type {
  NodeType,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeData,
} from '@/types/workflow'
import { NODE_TYPE_LABELS, VALID_CONNECTIONS } from '@/types/workflow'

export function getDefaultNodeData(type: NodeType, name: string): WorkflowNodeData {
  switch (type) {
    case 'trigger':
      return {
        nodeType: 'trigger',
        name,
        description: '',
        summary: 'Starting point of workflow',
      }
    case 'decision':
      return {
        nodeType: 'decision',
        name,
        field: '',
        operator: 'equals',
        value: '',
        summary: 'Condition not configured',
      }
    case 'delay':
      return {
        nodeType: 'delay',
        name,
        duration: 1,
        unit: 'seconds',
        summary: 'Wait 1 seconds',
      }
    case 'action':
      return {
        nodeType: 'action',
        name,
        actionName: '',
        parameters: [],
        summary: 'No action configured',
      }
  }
}

export function buildNodeSummary(data: WorkflowNodeData): string {
  switch (data.nodeType) {
    case 'trigger':
      return data.description || 'Starting point of workflow'
    case 'decision':
      if (!data.field) return 'Condition not configured'
      return `${data.field} ${data.operator.replace(/_/g, ' ')} ${data.value || '…'}`
    case 'delay':
      return `Wait ${data.duration} ${data.unit}`
    case 'action':
      return data.actionName || 'No action configured'
  }
}

export function createNode(
  type: NodeType,
  position: { x: number; y: number },
  existingNodes: WorkflowNode[],
): WorkflowNode {
  const count = existingNodes.filter((n) => n.type === type).length + 1
  const name = `${NODE_TYPE_LABELS[type]} ${count}`
  const data = getDefaultNodeData(type, name)
  data.summary = buildNodeSummary(data)

  return {
    id: uuidv4(),
    type,
    position,
    data,
  }
}

export function getNodeTypeFromNode(node: WorkflowNode): NodeType {
  return (node.type as NodeType) ?? node.data.nodeType
}

export function isValidConnection(sourceType: NodeType, targetType: NodeType): boolean {
  return VALID_CONNECTIONS[sourceType]?.includes(targetType) ?? false
}

export function getConnectionErrorMessage(
  sourceType: NodeType,
  targetType: NodeType,
): string {
  return `Invalid connection: ${NODE_TYPE_LABELS[sourceType]} cannot connect to ${NODE_TYPE_LABELS[targetType]}`
}

export function enrichEdge(edge: WorkflowEdge): WorkflowEdge {
  const label =
    edge.sourceHandle === 'true'
      ? 'TRUE'
      : edge.sourceHandle === 'false'
        ? 'FALSE'
        : undefined

  return {
    ...edge,
    type: 'custom',
    label,
    animated: false,
    style: { stroke: 'var(--edge-color)', strokeWidth: 2 },
  }
}
