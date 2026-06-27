import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './index'
import type { WorkflowNode } from '@/types/workflow'

export const selectWorkflow = (state: RootState) => state.workflow
export const selectUi = (state: RootState) => state.ui
export const selectTheme = (state: RootState) => state.ui.theme
export const selectSavedWorkflows = (state: RootState) => state.savedWorkflows.workflows

export const selectSelectedNode = createSelector(
  [selectWorkflow, selectUi],
    (workflow, ui) =>
    workflow.nodes.find((n: WorkflowNode) => n.id === ui.selectedNodeId) ?? null,
)

export const selectIsWorkflowValid = createSelector(
  [selectWorkflow],
  (workflow) => workflow.validationResult?.valid ?? false,
)

export const selectCanSimulate = createSelector(
  [selectIsWorkflowValid, selectUi],
  (isValid, ui) => isValid && !ui.simulationRunning,
)

export const selectHasNodes = createSelector(
  [selectWorkflow],
  (workflow) => workflow.nodes.length > 0,
)

export const selectCurrentWorkflowId = createSelector(
  [selectWorkflow],
  (workflow) => workflow.id,
)
