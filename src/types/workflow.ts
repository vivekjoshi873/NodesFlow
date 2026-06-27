import type { Edge, Node } from 'reactflow'

export type NodeType = 'trigger' | 'decision' | 'delay' | 'action'

export type DecisionOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'contains'
  | 'not_contains'

export type DelayUnit = 'seconds' | 'minutes' | 'hours' | 'days'

export interface BaseNodeData {
  name: string
  nodeType: NodeType
  summary?: string
  simulationStatus?: string
  isCycleHighlighted?: boolean
  isSimulationActive?: boolean
  isSimulationVisited?: boolean
  isSimulationDone?: boolean
  showDecisionPrompt?: boolean
  [key: string]: unknown
}

export interface TriggerNodeData extends BaseNodeData {
  nodeType: 'trigger'
  description: string
}

export interface DecisionNodeData extends BaseNodeData {
  nodeType: 'decision'
  field: string
  operator: DecisionOperator
  value: string
}

export interface DelayNodeData extends BaseNodeData {
  nodeType: 'delay'
  duration: number
  unit: DelayUnit
}

export interface ActionNodeData extends BaseNodeData {
  nodeType: 'action'
  actionName: string
  parameters: { key: string; value: string }[]
}

export type WorkflowNodeData =
  | TriggerNodeData
  | DecisionNodeData
  | DelayNodeData
  | ActionNodeData

export type WorkflowNode = Node<WorkflowNodeData>
export type WorkflowEdge = Edge

export interface SavedWorkflow {
  id: string
  name: string
  savedAt: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  passedChecks: string[]
  cycleNodeIds: string[]
}

export interface SimulationState {
  active: boolean
  visitedNodes: string[]
  visitedEdges: string[]
  currentNode: string | null
  completed: boolean
  pathLabels: string[]
  pendingDecisionNodeId: string | null
}

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  trigger: 'Trigger',
  decision: 'Decision',
  delay: 'Delay',
  action: 'Action',
}

export const NODE_ACCENT_COLORS: Record<NodeType, string> = {
  trigger: '#6366f1',
  decision: '#f59e0b',
  delay: '#06b6d4',
  action: '#10b981',
}

export const VALID_CONNECTIONS: Record<NodeType, NodeType[]> = {
  trigger: ['decision', 'action'],
  decision: ['action', 'delay'],
  delay: ['action'],
  action: ['action'],
}

export const LOCAL_STORAGE_KEY = 'flowforge_workflows'
