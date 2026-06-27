import { useDispatch, useSelector } from 'react-redux'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteNode } from '@/store/slices/workflowSlice'
import {
  closeDeleteNodeDialog,
  closeRightPanel,
  selectNode,
} from '@/store/slices/uiSlice'
import { selectUi } from '@/store/selectors'

export default function DeleteNodeDialog() {
  const dispatch = useDispatch()
  const { deleteNodeDialog } = useSelector(selectUi)
  const { open, nodeId, nodeName, connectionCount } = deleteNodeDialog

  const handleConfirm = () => {
    if (nodeId) {
      dispatch(deleteNode(nodeId))
      dispatch(selectNode(null))
      dispatch(closeRightPanel())
    }
    dispatch(closeDeleteNodeDialog())
  }

  const description =
    connectionCount > 0
      ? `"${nodeName}" has ${connectionCount} connection${connectionCount === 1 ? '' : 's'}. Deleting it will remove the node and all connected edges. This cannot be undone.`
      : `Are you sure you want to delete "${nodeName}"? This cannot be undone.`

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) dispatch(closeDeleteNodeDialog())
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete node?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-500 cursor-pointer"
            onClick={handleConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
