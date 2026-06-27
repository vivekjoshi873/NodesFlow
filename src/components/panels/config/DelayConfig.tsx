import { useDispatch } from 'react-redux'
import { updateNodeData } from '@/store/slices/workflowSlice'
import { buildNodeSummary } from '@/utils/nodeDefaults'
import type { DelayNodeData, DelayUnit } from '@/types/workflow'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DelayConfigProps {
  nodeId: string
  data: DelayNodeData
}

const units: { value: DelayUnit; label: string }[] = [
  { value: 'seconds', label: 'Seconds' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
]

export default function DelayConfig({ nodeId, data }: DelayConfigProps) {
  const dispatch = useDispatch()

  const update = (patch: Partial<DelayNodeData>) => {
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
      <div className="space-y-2">
        <Label htmlFor="delay-name">Name</Label>
        <Input
          id="delay-name"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="delay-duration">Duration</Label>
        <Input
          id="delay-duration"
          type="number"
          min={1}
          value={data.duration}
          onChange={(e) => update({ duration: Math.max(1, Number(e.target.value) || 1) })}
          data-mono
        />
      </div>
      <div className="space-y-2">
        <Label>Unit</Label>
        <Select
          value={data.unit}
          onValueChange={(value) => update({ unit: value as DelayUnit })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit.value} value={unit.value}>
                {unit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
