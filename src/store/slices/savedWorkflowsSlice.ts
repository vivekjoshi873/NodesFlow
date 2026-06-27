import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { SavedWorkflow } from '@/types/workflow'
import { LOCAL_STORAGE_KEY } from '@/types/workflow'

function loadFromStorage(): SavedWorkflow[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedWorkflow[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

interface SavedWorkflowsState {
  workflows: SavedWorkflow[]
}

const initialState: SavedWorkflowsState = {
  workflows: loadFromStorage(),
}

const savedWorkflowsSlice = createSlice({
  name: 'savedWorkflows',
  initialState,
  reducers: {
    saveWorkflow(
      state,
      action: PayloadAction<{
        id: string | null
        name: string
        nodes: SavedWorkflow['nodes']
        edges: SavedWorkflow['edges']
      }>,
    ) {
      const { id, name, nodes, edges } = action.payload
      const savedAt = new Date().toISOString()
      const workflowId = id ?? uuidv4()
      const existingIndex = state.workflows.findIndex((w) => w.id === workflowId)

      const workflow: SavedWorkflow = {
        id: workflowId,
        name,
        savedAt,
        nodes,
        edges,
      }

      if (existingIndex >= 0) {
        state.workflows[existingIndex] = workflow
      } else {
        state.workflows.unshift(workflow)
      }
    },
    deleteSavedWorkflow(state, action: PayloadAction<string>) {
      state.workflows = state.workflows.filter((w) => w.id !== action.payload)
    },
  },
})

export const { saveWorkflow, deleteSavedWorkflow } = savedWorkflowsSlice.actions
export default savedWorkflowsSlice.reducer
