import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteNode } from '@/store/slices/workflowSlice'
import {
  closeRightPanel,
  openDeleteNodeDialog,
  selectNode,
} from '@/store/slices/uiSlice'
import { selectWorkflow } from '@/store/selectors'

export function useDeleteNode() {
  const dispatch = useDispatch()
  const { nodes, edges } = useSelector(selectWorkflow)

  const requestDeleteNode = useCallback(
    (nodeId: string, options?: { alwaysConfirm?: boolean }) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return

      const connectionCount = edges.filter(
        (e) => e.source === nodeId || e.target === nodeId,
      ).length

      if (options?.alwaysConfirm || connectionCount > 0) {
        dispatch(
          openDeleteNodeDialog({
            nodeId,
            nodeName: node.data.name,
            connectionCount,
          }),
        )
        return
      }

      dispatch(deleteNode(nodeId))
      dispatch(selectNode(null))
      dispatch(closeRightPanel())
    },
    [dispatch, edges, nodes],
  )

  return { requestDeleteNode }
}
