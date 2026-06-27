import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface DeleteNodeDialogState {
  open: boolean
  nodeId: string | null
  nodeName: string
  connectionCount: number
}

interface UiState {
  selectedNodeId: string | null
  rightPanelOpen: boolean
  simulationRunning: boolean
  validationModalOpen: boolean
  deleteNodeDialog: DeleteNodeDialogState
  theme: 'dark' | 'light'
}

const initialDeleteNodeDialog: DeleteNodeDialogState = {
  open: false,
  nodeId: null,
  nodeName: '',
  connectionCount: 0,
}

const initialState: UiState = {
  selectedNodeId: null,
  rightPanelOpen: false,
  simulationRunning: false,
  validationModalOpen: false,
  deleteNodeDialog: initialDeleteNodeDialog,
  theme: 'dark',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectNode(state, action: PayloadAction<string | null>) {
      state.selectedNodeId = action.payload
      state.rightPanelOpen = action.payload !== null
    },
    closeRightPanel(state) {
      state.selectedNodeId = null
      state.rightPanelOpen = false
    },
    setSimulationRunning(state, action: PayloadAction<boolean>) {
      state.simulationRunning = action.payload
    },
    setValidationModalOpen(state, action: PayloadAction<boolean>) {
      state.validationModalOpen = action.payload
    },
    openDeleteNodeDialog(
      state,
      action: PayloadAction<{
        nodeId: string
        nodeName: string
        connectionCount: number
      }>,
    ) {
      state.deleteNodeDialog = {
        open: true,
        ...action.payload,
      }
    },
    closeDeleteNodeDialog(state) {
      state.deleteNodeDialog = initialDeleteNodeDialog
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    setTheme(state, action: PayloadAction<'dark' | 'light'>) {
      state.theme = action.payload
    },
  },
})

export const {
  selectNode,
  closeRightPanel,
  setSimulationRunning,
  setValidationModalOpen,
  openDeleteNodeDialog,
  closeDeleteNodeDialog,
  toggleTheme,
  setTheme,
} = uiSlice.actions

export default uiSlice.reducer
