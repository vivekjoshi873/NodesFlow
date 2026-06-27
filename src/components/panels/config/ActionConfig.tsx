import { useDispatch } from 'react-redux'
import { Plus, Trash2 } from 'lucide-react'
import { updateNodeData } from '@/store/slices/workflowSlice'
import { buildNodeSummary } from '@/utils/nodeDefaults'
import type { ActionNodeData } from '@/types/workflow'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface ActionConfigProps {
  nodeId: string
  data: ActionNodeData
}

export default function ActionConfig({ nodeId, data }: ActionConfigProps) {
  const dispatch = useDispatch()

  const update = (patch: Partial<ActionNodeData>) => {
    const merged = { ...data, ...patch }
    dispatch(
      updateNodeData({
        id: nodeId,
        data: { ...patch, summary: buildNodeSummary(merged) },
      }),
    )
  }

  const addParameter = () => {
    update({
      parameters: [...data.parameters, { key: '', value: '' }],
    })
  }

  const updateParameter = (index: number, field: 'key' | 'value', value: string) => {
    const parameters = data.parameters.map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    )
    update({ parameters })
  }

  const removeParameter = (index: number) => {
    update({ parameters: data.parameters.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="action-name">Name</Label>
        <Input
          id="action-name"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="action-action-name">Action Name</Label>
        <Input
          id="action-action-name"
          value={data.actionName}
          onChange={(e) => update({ actionName: e.target.value })}
          placeholder="e.g. Send Email"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Parameters</Label>
          <Button type="button" variant="ghost" size="sm" onClick={addParameter}>
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {data.parameters.length === 0 && (
            <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>No parameters added</p>
          )}
          {data.parameters.map((param, index) => (
            <div key={`param-${index}`} className="flex gap-2">
              <Input
                value={param.key}
                onChange={(e) => updateParameter(index, 'key', e.target.value)}
                placeholder="Key"
                className="param-key flex-1"
                data-mono
              />
              <Input
                value={param.value}
                onChange={(e) => updateParameter(index, 'value', e.target.value)}
                placeholder="Value"
                className="param-value flex-1"
                data-mono
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-red-400 "
                onClick={() => removeParameter(index)}
              >
                <Trash2 className="h-3.5 w-3.5 cursor-pointer" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
