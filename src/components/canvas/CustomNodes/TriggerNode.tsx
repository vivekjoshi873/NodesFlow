import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TriggerNodeData } from '@/types/workflow'

function TriggerNode({ data, selected }: NodeProps<TriggerNodeData>) {
  return (
    <div
      className={cn(
        'node-card border-t-[3px] border-t-[var(--color-trigger)]',
        selected && 'ring-2 ring-[var(--color-trigger)]/50',
        data.isCycleHighlighted && 'cycle-highlight',
        data.isSimulationActive && 'simulation-active',
        data.isSimulationDone && 'action-done-flash',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '50%' }}
        className="!h-3 !w-3 !-translate-y-1/2 !border-2 !border-[var(--color-trigger)] !bg-[var(--bg-app)]"
        isConnectable={false}
      />
      <div className="p-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: 'var(--color-trigger-bg)' }}
            >
              <Zap className="h-3.5 w-3.5" style={{ color: 'var(--color-trigger)' }} />
            </div>
          </div>
          <Badge variant="trigger">Trigger</Badge>
        </div>
        <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          {data.name}
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {data.simulationStatus ?? data.summary}
        </p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="default"
        style={{ top: '50%' }}
        className="!h-3 !w-3 !-translate-y-1/2 !border-2 !border-[var(--color-trigger)] !bg-[var(--color-trigger)]"
      />
    </div>
  )
}

export default memo(TriggerNode)
