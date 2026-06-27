import { useDispatch, useSelector } from 'react-redux'
import { X, Zap, GitBranch, Clock, Play } from 'lucide-react'
import { closeRightPanel } from '@/store/slices/uiSlice'
import { selectSelectedNode } from '@/store/selectors'
import type {
  NodeType,
  ActionNodeData,
  DecisionNodeData,
  DelayNodeData,
  TriggerNodeData,
} from '@/types/workflow'
import { NODE_TYPE_LABELS } from '@/types/workflow'
import { useDeleteNode } from '@/hooks/useDeleteNode'
import { Button } from '@/components/ui/button'
import TriggerConfig from './config/TriggerConfig'
import DecisionConfig from './config/DecisionConfig'
import DelayConfig from './config/DelayConfig'
import ActionConfig from './config/ActionConfig'
import { cn } from '@/lib/utils'

const icons = {
  trigger: Zap,
  decision: GitBranch,
  delay: Clock,
  action: Play,
}

const accentClasses = {
  trigger: 'text-[#6366f1]',
  decision: 'text-[#f59e0b]',
  delay: 'text-[#06b6d4]',
  action: 'text-[#10b981]',
}

export default function NodeConfigPanel() {
  const dispatch = useDispatch()
  const node = useSelector(selectSelectedNode)
  const { requestDeleteNode } = useDeleteNode()

  if (!node) return null

  const nodeType = node.data.nodeType as NodeType
  const Icon = icons[nodeType]

  return (
    <aside
      className={cn(
        'flex h-full w-[320px] shrink-0 flex-col border-l border-[#2a2d3e] bg-[#1a1d2e]',
        'transition-transform duration-300 ease-out',
      )}
    >
      <div className="flex items-center gap-3 border-b border-[#2a2d3e] px-4 py-3">
        <Icon className={cn('h-5 w-5', accentClasses[nodeType])} />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#94a3b8]">
            {NODE_TYPE_LABELS[nodeType]}
          </div>
          <div className="truncate text-[13px] font-semibold text-[#e2e8f0]">
            {node.data.name}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => dispatch(closeRightPanel())}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {nodeType === 'trigger' && (
          <TriggerConfig nodeId={node.id} data={node.data as TriggerNodeData} />
        )}
        {nodeType === 'decision' && (
          <DecisionConfig nodeId={node.id} data={node.data as DecisionNodeData} />
        )}
        {nodeType === 'delay' && (
          <DelayConfig nodeId={node.id} data={node.data as DelayNodeData} />
        )}
        {nodeType === 'action' && (
          <ActionConfig nodeId={node.id} data={node.data as ActionNodeData} />
        )}
      </div>

      <div className="border-t border-[#2a2d3e] p-4">
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => requestDeleteNode(node.id, { alwaysConfirm: true })}
        >
          Delete Node
        </Button>
      </div>
    </aside>
  )
}
