import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ActionNodeData } from '@/types/workflow'

function ActionNode({ data, selected }: NodeProps<ActionNodeData>) {
  return (
    <div
      className={cn(
        'node-card border-t-[3px] border-t-[var(--color-action)]',
        selected && 'ring-2 ring-[var(--color-action)]/50',
        data.isCycleHighlighted && 'cycle-highlight',
        data.isSimulationActive && 'ring-2 ring-[var(--color-action)]',
        data.isSimulationDone && 'action-done-flash',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '50%' }}
        className="!h-3 !w-3 !-translate-y-1/2 !border-2 !border-[var(--color-action)] !bg-[var(--bg-app)]"
      />
      <div className="p-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: 'var(--color-action-bg)' }}
          >
            <Play className="h-3.5 w-3.5" style={{ color: 'var(--color-action)' }} />
          </div>
          <Badge variant="action">Action</Badge>
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
        className="!h-3 !w-3 !-translate-y-1/2 !border-2 !border-[var(--color-action)] !bg-[var(--color-action)]"
      />
    </div>
  )
}

export default memo(ActionNode)
