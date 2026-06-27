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
        'relative w-[220px] rounded-xl border border-[#2a2d3e]/80 bg-[#1e2235]/90 shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
        'border-t-[3px] border-t-[#06b6d4]',
        selected && 'ring-2 ring-[#06b6d4]/50',
        data.isCycleHighlighted && 'cycle-highlight',
        data.isSimulationActive && 'ring-2 ring-[#06b6d4]',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '50%' }}
        className="!h-3 !w-3 !-translate-y-1/2 !border-2 !border-[#06b6d4] !bg-[#1a1d2e]"
      />
      <div className="p-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#06b6d4]/15">
            <Clock className="h-3.5 w-3.5 text-[#06b6d4]" />
          </div>
          <Badge variant="delay">Delay</Badge>
        </div>
        <div className="text-[13px] font-semibold text-[#e2e8f0]">{data.name}</div>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#94a3b8]">
          {data.simulationStatus ?? data.summary}
        </p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="default"
        style={{ top: '50%' }}
        className="!h-3 !w-3 !-translate-y-1/2 !border-2 !border-[#06b6d4] !bg-[#06b6d4]"
      />
    </div>
  )
}

export default memo(DelayNode)
