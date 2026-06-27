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

const accentColorVars: Record<NodeType, string> = {
  trigger: '--color-trigger',
  decision: '--color-decision',
  delay: '--color-delay',
  action: '--color-action',
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
        'flex h-full w-[320px] shrink-0 flex-col border-l transition-transform duration-300 ease-out',
      )}
      style={{ background: 'var(--bg-panel)', borderColor: 'var(--border-primary)' }}
    >
      <div
        className="flex items-center gap-3 border-b px-4 py-3"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        <Icon className="h-5 w-5" style={{ color: `var(${accentColorVars[nodeType]})` }} />
        <div className="min-w-0 flex-1">
          <div
            className="text-[11px] font-medium uppercase tracking-[0.08em]"
            style={{ color: 'var(--text-label)' }}
          >
            {NODE_TYPE_LABELS[nodeType]}
          </div>
          <div className="truncate text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
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

      <div className="border-t p-4" style={{ borderColor: 'var(--border-primary)' }}>
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
