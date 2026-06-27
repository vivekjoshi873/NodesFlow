import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FolderOpen, Trash2 } from 'lucide-react'
import { deleteSavedWorkflow } from '@/store/slices/savedWorkflowsSlice'
import { loadWorkflow, newWorkflow } from '@/store/slices/workflowSlice'
import { selectNode } from '@/store/slices/uiSlice'
import {
  selectCurrentWorkflowId,
  selectSavedWorkflows,
  selectWorkflow,
} from '@/store/selectors'
import { formatRelativeTime } from '@/utils/exportImport'
import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'
import type { SavedWorkflow } from '@/types/workflow'

interface SavedWorkflowsListProps {
  onDiscardConfirm: (action: () => void) => void
}

export default function SavedWorkflowsList({ onDiscardConfirm }: SavedWorkflowsListProps) {
  const dispatch = useDispatch()
  const workflows = useSelector(selectSavedWorkflows)
  const currentId = useSelector(selectCurrentWorkflowId)
  const { hasUnsavedChanges } = useSelector(selectWorkflow)
  const [deleteTarget, setDeleteTarget] = useState<SavedWorkflow | null>(null)

  const load = (workflow: SavedWorkflow) => {
    const doLoad = () => {
      dispatch(
        loadWorkflow({
          id: workflow.id,
          name: workflow.name,
          nodes: workflow.nodes,
          edges: workflow.edges,
        }),
      )
      dispatch(selectNode(null))
    }

    if (hasUnsavedChanges) {
      onDiscardConfirm(doLoad)
    } else {
      doLoad()
    }
  }

  const handleNewWorkflow = () => {
    const doNew = () => {
      dispatch(newWorkflow())
      dispatch(selectNode(null))
    }
    if (hasUnsavedChanges) {
      onDiscardConfirm(doNew)
    } else {
      doNew()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" size="sm" onClick={handleNewWorkflow} className="w-full cursor-pointer">
        New Workflow
      </Button>

      <div className="flex flex-col gap-1">
        {workflows.length === 0 && (
          <p className="py-4 text-center text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            No saved workflows yet
          </p>
        )}
        {workflows.map((workflow: SavedWorkflow) => (
          <div
            key={workflow.id}
            className={cn(
              'flex items-center gap-2 rounded-md border border-transparent px-2 py-2 transition-colors hover:bg-[var(--bg-node)]',
              currentId === workflow.id &&
                'border-l-2 border-l-[var(--color-trigger)] bg-[var(--bg-node)] border-[color-mix(in_srgb,var(--color-trigger)_30%,transparent)]',
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                {workflow.name}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {formatRelativeTime(workflow.savedAt)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 cursor-pointer"
              onClick={() => load(workflow)}
              aria-label="Load workflow"
            >
              <FolderOpen className="h-3.5 w-3.5 " />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-red-400 hover:text-red-300"
              onClick={() => setDeleteTarget(workflow)}
              aria-label="Delete workflow"
            >
              <Trash2 className="h-3.5 w-3.5 cursor-pointer" />
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete saved workflow?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleteTarget?.name}&quot; from your saved
              workflows.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500"
              onClick={() => {
                if (deleteTarget) dispatch(deleteSavedWorkflow(deleteTarget.id))
                setDeleteTarget(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
