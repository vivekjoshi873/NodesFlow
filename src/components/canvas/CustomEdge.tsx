import { memo, useState } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from 'reactflow'
import { X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { removeEdge } from '@/store/slices/workflowSlice'
import { NODE_ACCENT_COLORS } from '@/types/workflow'
import type { NodeType } from '@/types/workflow'

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  animated,
  selected,
  data,
}: EdgeProps) {
  const dispatch = useDispatch()
  const [hovered, setHovered] = useState(false)

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const accentColor =
    data?.accentColor ??
    (selected || animated ? NODE_ACCENT_COLORS[data?.sourceType as NodeType] : undefined)

  const strokeColor = hovered
    ? 'var(--text-primary)'
    : accentColor ?? (style.stroke as string) ?? 'var(--edge-color)'

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: 2,
        }}
        interactionWidth={20}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="react-flow__edge-interaction"
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex items-center gap-1"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {label && (
            <span
              className="rounded px-1.5 py-0.5 text-[9px] font-semibold"
              style={{ background: 'var(--bg-app)', color: 'var(--text-secondary)' }}
            >
              {label}
            </span>
          )}
          {hovered && (
            <button
              type="button"
              onClick={() => dispatch(removeEdge(id))}
              className="flex h-5 w-5 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-500"
              aria-label="Delete edge"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(CustomEdge)
