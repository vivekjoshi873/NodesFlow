import { useDispatch } from 'react-redux'
import { updateNodeData } from '@/store/slices/workflowSlice'
import { buildNodeSummary } from '@/utils/nodeDefaults'
import type { TriggerNodeData } from '@/types/workflow'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface TriggerConfigProps {
  nodeId: string
  data: TriggerNodeData
}

export default function TriggerConfig({ nodeId, data }: TriggerConfigProps) {
  const dispatch = useDispatch()

  const update = (patch: Partial<TriggerNodeData>) => {
    const merged = { ...data, ...patch }
    dispatch(
      updateNodeData({
        id: nodeId,
        data: { ...patch, summary: buildNodeSummary(merged) },
      }),
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
        This is the starting point of your workflow
      </p>
      <div className="space-y-2">
        <Label htmlFor="trigger-name">Name</Label>
        <Input
          id="trigger-name"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="trigger-desc">Description</Label>
        <Textarea
          id="trigger-desc"
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  )
}
