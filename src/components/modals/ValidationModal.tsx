import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle2, XCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { setValidationModalOpen } from '@/store/slices/uiSlice'
import { selectUi, selectWorkflow } from '@/store/selectors'
import { Button } from '@/components/ui/button'

export default function ValidationModal() {
  const dispatch = useDispatch()
  const { validationModalOpen } = useSelector(selectUi)
  const { validationResult } = useSelector(selectWorkflow)

  if (!validationResult) return null

  const { valid, errors, passedChecks } = validationResult

  return (
    <Dialog
      open={validationModalOpen}
      onOpenChange={(open) => dispatch(setValidationModalOpen(open))}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Validation Results</DialogTitle>
          <DialogDescription>
            {valid
              ? 'Workflow is valid ✓'
              : `${errors.length} issue${errors.length === 1 ? '' : 's'} found`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {passedChecks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#94a3b8]">
                Passed
              </h4>
              <ul className="space-y-1.5">
                {passedChecks.map((check: string) => (
                  <li key={check} className="flex items-start gap-2 text-[13px] text-[#e2e8f0]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10b981]" />
                    {check}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#94a3b8]">
                Failed
              </h4>
              <ul className="space-y-1.5">
                {errors.map((error: string) => (
                  <li key={error} className="flex items-start gap-2 text-[13px] text-red-300">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button
          className="w-full"
          onClick={() => dispatch(setValidationModalOpen(false))}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}
