import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { DelayNodeData } from '@/types/workflow'

function DelayNode({ data, selected }: NodeProps<DelayNodeData>) {
  return (
    <div
      className={cn(
        'node-card border-t-[3px] border-t-[var(--color-delay)]',
        selected && 'ring-2 ring-[var(--color-delay)]/50',
        data.isCycleHighlighted && 'cycle-highlight',
        data.isSimulationActive && 'ring-2 ring-[var(--color-delay)]',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '50%' }}
        className="!h-3 !w-3 !-translate-y-1/2 !border-2 !border-[var(--color-delay)] !bg-[var(--bg-app)]"
      />
      <div className="p-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: 'var(--color-delay-bg)' }}
          >
            <Clock className="h-3.5 w-3.5" style={{ color: 'var(--color-delay)' }} />
          </div>
          <Badge variant="delay">Delay</Badge>
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
        className="!h-3 !w-3 !-translate-y-1/2 !border-2 !border-[var(--color-delay)] !bg-[var(--color-delay)]"
      />
    </div>
  )
}

export default memo(DelayNode)
