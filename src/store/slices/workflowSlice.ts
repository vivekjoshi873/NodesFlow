import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { EdgeChange, NodeChange } from 'reactflow'
import { applyNodeChanges, applyEdgeChanges } from 'reactflow'
import type {
  SimulationState,
  ValidationResult,
  WorkflowEdge,
  WorkflowNode,
} from '@/types/workflow'

interface WorkflowState {
  id: string | null
  name: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  hasUnsavedChanges: boolean
  validationResult: ValidationResult | null
  simulationState: SimulationState
}

const initialSimulationState: SimulationState = {
  active: false,
  visitedNodes: [],
  visitedEdges: [],
  currentNode: null,
  completed: false,
  pathLabels: [],
  pendingDecisionNodeId: null,
}

const initialState: WorkflowState = {
  id: null,
  name: 'Untitled Workflow',
  nodes: [],
  edges: [],
  hasUnsavedChanges: false,
  validationResult: null,
  simulationState: initialSimulationState,
}

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setWorkflowName(state, action: PayloadAction<string>) {
      state.name = action.payload
      state.hasUnsavedChanges = true
    },
    setNodes(state, action: PayloadAction<WorkflowNode[]>) {
      state.nodes = action.payload
      state.hasUnsavedChanges = true
    },
    setEdges(state, action: PayloadAction<WorkflowEdge[]>) {
      state.edges = action.payload
      state.hasUnsavedChanges = true
    },
    onNodesChange(state, action: PayloadAction<NodeChange[]>) {
      state.nodes = applyNodeChanges(action.payload, state.nodes) as WorkflowNode[]
      state.hasUnsavedChanges = true
    },
    onEdgesChange(state, action: PayloadAction<EdgeChange[]>) {
      state.edges = applyEdgeChanges(action.payload, state.edges)
      state.hasUnsavedChanges = true
    },
    addNode(state, action: PayloadAction<WorkflowNode>) {
      state.nodes.push(action.payload)
      state.hasUnsavedChanges = true
    },
    updateNodeData(
      state,
      action: PayloadAction<{ id: string; data: Record<string, unknown> }>,
    ) {
      const node = state.nodes.find((n) => n.id === action.payload.id)
      if (node) {
        Object.assign(node.data, action.payload.data)
        state.hasUnsavedChanges = true
      }
    },
    deleteNode(state, action: PayloadAction<string>) {
      const nodeId = action.payload
      state.nodes = state.nodes.filter((n) => n.id !== nodeId)
      state.edges = state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId,
      )
      state.hasUnsavedChanges = true
    },
    addEdge(state, action: PayloadAction<WorkflowEdge>) {
      state.edges.push(action.payload)
      state.hasUnsavedChanges = true
    },
    removeEdge(state, action: PayloadAction<string>) {
      state.edges = state.edges.filter((e) => e.id !== action.payload)
      state.hasUnsavedChanges = true
    },
    loadWorkflow(
      state,
      action: PayloadAction<{
        id: string | null
        name: string
        nodes: WorkflowNode[]
        edges: WorkflowEdge[]
      }>,
    ) {
      state.id = action.payload.id
      state.name = action.payload.name
      state.nodes = action.payload.nodes
      state.edges = action.payload.edges
      state.hasUnsavedChanges = false
      state.validationResult = null
      state.simulationState = { ...initialSimulationState }
    },
    newWorkflow(state) {
      state.id = null
      state.name = 'Untitled Workflow'
      state.nodes = []
      state.edges = []
      state.hasUnsavedChanges = false
      state.validationResult = null
      state.simulationState = { ...initialSimulationState }
    },
    markSaved(state, action: PayloadAction<string>) {
      state.id = action.payload
      state.hasUnsavedChanges = false
    },
    setValidationResult(state, action: PayloadAction<ValidationResult | null>) {
      state.validationResult = action.payload
    },
    setCycleHighlights(state, action: PayloadAction<string[]>) {
      state.nodes = state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isCycleHighlighted: action.payload.includes(node.id),
        },
      }))
    },
    clearCycleHighlights(state) {
      state.nodes = state.nodes.map((node) => ({
        ...node,
        data: { ...node.data, isCycleHighlighted: false },
      }))
    },
    setSimulationState(state, action: PayloadAction<Partial<SimulationState>>) {
      state.simulationState = { ...state.simulationState, ...action.payload }
    },
    resetSimulation(state) {
      state.simulationState = { ...initialSimulationState }
      state.nodes = state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          simulationStatus: undefined,
          isSimulationActive: false,
          isSimulationVisited: false,
          isSimulationDone: false,
        },
      }))
      state.edges = state.edges.map((edge) => ({
        ...edge,
        animated: false,
        style: { stroke: 'var(--edge-color)', strokeWidth: 2 },
      }))
    },
    updateNodeSimulationFlags(
      state,
      action: PayloadAction<{
        nodeId: string
        flags: Record<string, unknown>
      }>,
    ) {
      const node = state.nodes.find((n) => n.id === action.payload.nodeId)
      if (node) {
        Object.assign(node.data, action.payload.flags)
      }
    },
    setEdgeSimulationStyle(
      state,
      action: PayloadAction<{ edgeId: string; animated: boolean; color?: string }>,
    ) {
      const edge = state.edges.find((e) => e.id === action.payload.edgeId)
      if (edge) {
        edge.animated = action.payload.animated
        edge.style = {
          stroke: action.payload.color ?? 'var(--edge-color)',
          strokeWidth: 2,
          strokeDasharray: action.payload.animated ? '5 5' : undefined,
        }
      }
    },
    applyAutoLayoutNodes(state, action: PayloadAction<WorkflowNode[]>) {
      state.nodes = action.payload
      state.hasUnsavedChanges = true
    },
  },
})

export const {
  setWorkflowName,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  addNode,
  updateNodeData,
  deleteNode,
  addEdge,
  removeEdge,
  loadWorkflow,
  newWorkflow,
  markSaved,
  setValidationResult,
  setCycleHighlights,
  clearCycleHighlights,
  setSimulationState,
  resetSimulation,
  updateNodeSimulationFlags,
  setEdgeSimulationStyle,
  applyAutoLayoutNodes,
} = workflowSlice.actions

export default workflowSlice.reducer
