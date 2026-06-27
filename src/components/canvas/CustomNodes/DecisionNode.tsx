import { memo, useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { GitBranch } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSimulationContext } from '@/hooks/useSimulation'
import { cn } from '@/lib/utils'
import type { DecisionNodeData } from '@/types/workflow'

/** Shared offset from node vertical center — labels and handles use the same value */
const BRANCH_OFFSET = 14

function DecisionNode({ id, data, selected }: NodeProps<DecisionNodeData>) {
  const simulationCtx = useSimulationContext()
  const [testValue, setTestValue] = useState('')

  return (
    <div
      className={cn(
        'relative w-[220px] overflow-visible rounded-xl border border-[#2a2d3e]/80 bg-[#1e2235]/90 shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
        'border-t-[3px] border-t-[#f59e0b]',
        selected && 'ring-2 ring-[#f59e0b]/50',
        data.isCycleHighlighted && 'cycle-highlight',
        data.isSimulationActive && 'ring-2 ring-[#f59e0b]',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '50%' }}
        className="!h-3 !w-3 !-translate-y-1/2 !border-2 !border-[#f59e0b] !bg-[#1a1d2e]"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: `calc(50% - ${BRANCH_OFFSET}px)` }}
        className="!h-2.5 !w-2.5 !-translate-y-1/2 !border-2 !border-emerald-500 !bg-emerald-500"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: `calc(50% + ${BRANCH_OFFSET}px)` }}
        className="!h-2.5 !w-2.5 !-translate-y-1/2 !border-2 !border-red-500 !bg-red-500"
      />

      <span
        className="pointer-events-none absolute right-3 -translate-y-1/2 select-none text-[9px] font-semibold leading-none text-emerald-400"
        style={{ top: `calc(50% - ${BRANCH_OFFSET}px)` }}
      >
        TRUE
      </span>

      <span
        className="pointer-events-none absolute right-3 -translate-y-1/2 select-none text-[9px] font-semibold leading-none text-red-400"
        style={{ top: `calc(50% + ${BRANCH_OFFSET}px)` }}
      >
        FALSE
      </span>

      <div className="p-3 pr-10">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f59e0b]/15">
            <GitBranch className="h-3.5 w-3.5 text-[#f59e0b]" />
          </div>
          <Badge variant="decision">Decision</Badge>
        </div>
        <div className="text-[13px] font-semibold text-[#e2e8f0]">{data.name}</div>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#94a3b8]">
          {data.simulationStatus ?? data.summary}
        </p>

        {data.showDecisionPrompt && simulationCtx && (
          <div className="mt-2 rounded-md border border-[#f59e0b]/30 bg-[#13151f] p-2">
            <p className="mb-1 text-[10px] text-[#fcd34d]">
              Test value for {data.field || 'field'}:
            </p>
            <div className="flex gap-1">
              <Input
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                className="h-7 text-[11px]"
                placeholder="Enter value"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') simulationCtx.submitDecision(id, testValue)
                }}
              />
              <Button
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => simulationCtx.submitDecision(id, testValue)}
              >
                Go
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(DecisionNode)
