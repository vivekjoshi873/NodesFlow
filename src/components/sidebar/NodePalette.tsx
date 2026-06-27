import { useDispatch } from 'react-redux'
import { addNode } from '@/store/slices/workflowSlice'
import { selectNode } from '@/store/slices/uiSlice'
import { selectWorkflow } from '@/store/selectors'
import { useSelector } from 'react-redux'
import { createNode } from '@/utils/nodeDefaults'
import type { NodeType } from '@/types/workflow'
import { Zap, GitBranch, Clock, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

const paletteItems: {
  type: NodeType
  label: string
  description: string
  icon: typeof Zap
  color: string
  bg: string
}[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    description: 'Start your workflow',
    icon: Zap,
    color: 'text-[#6366f1]',
    bg: 'bg-[#6366f1]/15',
  },
  {
    type: 'decision',
    label: 'Decision',
    description: 'Branch on conditions',
    icon: GitBranch,
    color: 'text-[#f59e0b]',
    bg: 'bg-[#f59e0b]/15',
  },
  {
    type: 'delay',
    label: 'Delay',
    description: 'Wait before continuing',
    icon: Clock,
    color: 'text-[#06b6d4]',
    bg: 'bg-[#06b6d4]/15',
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Execute a task',
    icon: Play,
    color: 'text-[#10b981]',
    bg: 'bg-[#10b981]/15',
  },
]

export default function NodePalette() {
  const dispatch = useDispatch()
  const { nodes } = useSelector(selectWorkflow)

  const handleAdd = (type: NodeType) => {
    const centerX = 250 + Math.random() * 100
    const centerY = 180 + Math.random() * 80
    const node = createNode(type, { x: centerX, y: centerY }, nodes)
    dispatch(addNode(node))
    dispatch(selectNode(node.id))
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {paletteItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.type}
            type="button"
            onClick={() => handleAdd(item.type)}
            className={cn(
              'rounded-lg border border-[#2a2d3e] bg-[#13151f] p-3 text-left transition-colors hover:border-[#3a3d4e] hover:bg-[#1e2235] cursor-pointer',
            )}
          >
            <div
              className={cn(
                'mb-2 flex h-8 w-8 items-center justify-center rounded-full',
                item.bg,
              )}
            >
              <Icon className={cn('h-4 w-4', item.color)} />
            </div>
            <div className="text-[13px] font-semibold text-[#e2e8f0]">{item.label}</div>
            <div className="mt-0.5 text-[11px] text-[#94a3b8]">{item.description}</div>
          </button>
        )
      })}
    </div>
  )
}
