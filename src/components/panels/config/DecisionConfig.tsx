import { useDispatch } from 'react-redux'
import { updateNodeData } from '@/store/slices/workflowSlice'
import { buildNodeSummary } from '@/utils/nodeDefaults'
import type { DecisionNodeData, DecisionOperator } from '@/types/workflow'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DecisionConfigProps {
  nodeId: string
  data: DecisionNodeData
}

const operators: { value: DecisionOperator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not equals' },
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Not contains' },
]

export default function DecisionConfig({ nodeId, data }: DecisionConfigProps) {
  const dispatch = useDispatch()

  const update = (patch: Partial<DecisionNodeData>) => {
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
        <Label htmlFor="decision-name">Name</Label>
        <Input
          id="decision-name"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="decision-field">Field</Label>
        <Input
          id="decision-field"
          value={data.field}
          onChange={(e) => update({ field: e.target.value })}
          placeholder="e.g. user.age"
        />
      </div>
      <div className="space-y-2">
        <Label>Operator</Label>
        <Select
          value={data.operator}
          onValueChange={(value) => update({ operator: value as DecisionOperator })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="decision-value">Value</Label>
        <Input
          id="decision-value"
          value={data.value}
          onChange={(e) => update({ value: e.target.value })}
        />
      </div>
      <p className="rounded-md bg-[#13151f] p-3 text-[12px] text-[#94a3b8]">
        Connect the TRUE and FALSE output handles to different paths
      </p>
    </div>
  )
}
