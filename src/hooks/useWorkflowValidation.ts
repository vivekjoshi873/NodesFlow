import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearCycleHighlights,
  setCycleHighlights,
  setValidationResult,
} from '@/store/slices/workflowSlice'
import { setValidationModalOpen } from '@/store/slices/uiSlice'
import { selectWorkflow } from '@/store/selectors'
import { validateWorkflow } from '@/utils/validation'

export function useWorkflowValidation() {
  const dispatch = useDispatch()
  const { nodes, edges } = useSelector(selectWorkflow)

  const validate = useCallback(() => {
    try {
      dispatch(clearCycleHighlights())
      const result = validateWorkflow(nodes, edges)
      dispatch(setValidationResult(result))
      if (result.cycleNodeIds.length > 0) {
        dispatch(setCycleHighlights(result.cycleNodeIds))
      }
      dispatch(setValidationModalOpen(true))
      return result
    } catch (error) {
      console.error('Validation failed:', error)
      dispatch(
        setValidationResult({
          valid: false,
          errors: ['Validation failed unexpectedly. Check the browser console for details.'],
          warnings: [],
          passedChecks: [],
          cycleNodeIds: [],
        }),
      )
      dispatch(setValidationModalOpen(true))
      return null
    }
  }, [dispatch, edges, nodes])

  return { validate }
}
