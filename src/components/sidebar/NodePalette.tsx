import { useDispatch } from 'react-redux'
import { addNode } from '@/store/slices/workflowSlice'
import { selectNode } from '@/store/slices/uiSlice'
import { selectWorkflow } from '@/store/selectors'
import { useSelector } from 'react-redux'
import { createNode } from '@/utils/nodeDefaults'
import type { NodeType } from '@/types/workflow'
import { Zap, GitBranch, Clock, Play } from 'lucide-react'

const paletteItems: {
  type: NodeType
  label: string
  description: string
  icon: typeof Zap
  colorVar: string
  bgVar: string
}[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    description: 'Start your workflow',
    icon: Zap,
    colorVar: '--color-trigger',
    bgVar: '--color-trigger-bg',
  },
  {
    type: 'decision',
    label: 'Decision',
    description: 'Branch on conditions',
    icon: GitBranch,
    colorVar: '--color-decision',
    bgVar: '--color-decision-bg',
  },
  {
    type: 'delay',
    label: 'Delay',
    description: 'Wait before continuing',
    icon: Clock,
    colorVar: '--color-delay',
    bgVar: '--color-delay-bg',
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Execute a task',
    icon: Play,
    colorVar: '--color-action',
    bgVar: '--color-action-bg',
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
            className="palette-item cursor-pointer rounded-lg p-3 text-left"
          >
            <div
              className="mb-2 flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: `var(${item.bgVar})` }}
            >
              <Icon className="h-4 w-4" style={{ color: `var(${item.colorVar})` }} />
            </div>
            <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              {item.label}
            </div>
            <div className="mt-0.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              {item.description}
            </div>
          </button>
        )
      })}
    </div>
  )
}
