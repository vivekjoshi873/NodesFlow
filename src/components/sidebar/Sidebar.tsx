import { useState } from 'react'
import NodePalette from './NodePalette'
import SavedWorkflowsList from './SavedWorkflowsList'
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

export default function Sidebar() {
  const [discardOpen, setDiscardOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  const onDiscardConfirm = (action: () => void) => {
    setPendingAction(() => action)
    setDiscardOpen(true)
  }

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-[#2a2d3e] bg-[#1a1d2e]">
      <div className="border-b border-[#2a2d3e] p-4">
        <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.05em] text-[#94a3b8]">
          Add Nodes
        </h2>
        <NodePalette />
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.05em] text-[#94a3b8]">
          Saved Workflows
        </h2>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SavedWorkflowsList onDiscardConfirm={onDiscardConfirm} />
        </div>
      </div>

      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Discard them and continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                pendingAction?.()
                setPendingAction(null)
                setDiscardOpen(false)
              }}
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  )
}
