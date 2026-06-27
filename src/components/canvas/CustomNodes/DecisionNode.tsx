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
        'node-card overflow-visible border-t-[3px] border-t-[var(--color-decision)]',
        selected && 'ring-2 ring-[var(--color-decision)]/50',
        data.isCycleHighlighted && 'cycle-highlight',
        data.isSimulationActive && 'ring-2 ring-[var(--color-decision)]',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '50%' }}
        className="!h-3 !w-3 !-translate-y-1/2 !border-2 !border-[var(--color-decision)] !bg-[var(--bg-app)]"
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
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: 'var(--color-decision-bg)' }}
          >
            <GitBranch className="h-3.5 w-3.5" style={{ color: 'var(--color-decision)' }} />
          </div>
          <Badge variant="decision">Decision</Badge>
        </div>
        <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          {data.name}
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {data.simulationStatus ?? data.summary}
        </p>

        {data.showDecisionPrompt && simulationCtx && (
          <div
            className="mt-2 rounded-md border p-2"
            style={{
              borderColor: 'color-mix(in srgb, var(--color-decision) 30%, transparent)',
              background: 'var(--bg-node)',
            }}
          >
            <p className="mb-1 text-[10px]" style={{ color: 'var(--color-decision)' }}>
              Test value for {data.field || 'field'}:
            </p>
            <div className="flex gap-1">
              <Input
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                className="h-7 text-[11px]"
                placeholder="Enter value"
                data-mono
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
