import { useCallback, useEffect, useMemo, useRef } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Connection,
  type ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import {
  addEdge,
  applyAutoLayoutNodes,
  onEdgesChange,
  onNodesChange,
} from '@/store/slices/workflowSlice'
import { selectNode } from '@/store/slices/uiSlice'
import {
  selectHasNodes,
  selectUi,
  selectWorkflow,
} from '@/store/selectors'
import { useDeleteNode } from '@/hooks/useDeleteNode'
import { toast } from '@/hooks/use-toast'
import { applyAutoLayout } from '@/utils/layout'
import {
  enrichEdge,
  getConnectionErrorMessage,
  getNodeTypeFromNode,
  isValidConnection,
} from '@/utils/nodeDefaults'
import { NODE_ACCENT_COLORS } from '@/types/workflow'
import type { WorkflowEdge, WorkflowNode } from '@/types/workflow'
import TriggerNode from './CustomNodes/TriggerNode'
import DecisionNode from './CustomNodes/DecisionNode'
import DelayNode from './CustomNodes/DelayNode'
import ActionNode from './CustomNodes/ActionNode'
import CustomEdge from './CustomEdge'
import { Button } from '@/components/ui/button'
import { LayoutGrid } from 'lucide-react'

const nodeTypes = {
  trigger: TriggerNode,
  decision: DecisionNode,
  delay: DelayNode,
  action: ActionNode,
}

const edgeTypes = {
  custom: CustomEdge,
}

export default function WorkflowCanvas() {
  const dispatch = useDispatch()
  const { nodes, edges, simulationState } = useSelector(selectWorkflow)
  const { selectedNodeId } = useSelector(selectUi)
  const hasNodes = useSelector(selectHasNodes)
  const { requestDeleteNode } = useDeleteNode()
  const reactFlowRef = useRef<ReactFlowInstance | null>(null)

  const styledEdges = useMemo(
    () =>
      edges.map((edge: WorkflowEdge) => {
        const isActive =
          simulationState.visitedEdges.includes(edge.id) ||
          simulationState.active
        const sourceNode = nodes.find((n: WorkflowNode) => n.id === edge.source)
        const sourceType = sourceNode ? getNodeTypeFromNode(sourceNode) : undefined
        return {
          ...edge,
          type: 'custom',
          animated: edge.animated ?? isActive,
          data: {
            ...edge.data,
            sourceType,
            accentColor: edge.animated
              ? sourceType
                ? NODE_ACCENT_COLORS[sourceType]
                : undefined
              : undefined,
          },
        }
      }),
    [edges, nodes, simulationState.active, simulationState.visitedEdges],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((n: WorkflowNode) => n.id === connection.source)
      const targetNode = nodes.find((n: WorkflowNode) => n.id === connection.target)
      if (!sourceNode || !targetNode) return

      const sourceType = getNodeTypeFromNode(sourceNode)
      const targetType = getNodeTypeFromNode(targetNode)

      if (!isValidConnection(sourceType, targetType)) {
        toast({
          variant: 'destructive',
          title: 'Invalid connection',
          description: getConnectionErrorMessage(sourceType, targetType),
        })
        return
      }

      const newEdge = enrichEdge({
        id: uuidv4(),
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle ?? undefined,
        targetHandle: connection.targetHandle ?? undefined,
      })

      dispatch(addEdge(newEdge))
    },
    [dispatch, nodes],
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      dispatch(selectNode(node.id))
    },
    [dispatch],
  )

  const onPaneClick = useCallback(() => {
    dispatch(selectNode(null))
  }, [dispatch])

  const handleAutoLayout = useCallback(() => {
    const layouted = applyAutoLayout(nodes, edges)
    dispatch(applyAutoLayoutNodes(layouted))
    setTimeout(() => reactFlowRef.current?.fitView({ padding: 0.2 }), 50)
  }, [dispatch, edges, nodes])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }
      if (!selectedNodeId) return

      requestDeleteNode(selectedNodeId)
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [requestDeleteNode, selectedNodeId])

  return (
    <div className="relative h-full w-full">
      {!hasNodes && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="rounded-xl border border-dashed border-[#2a2d3e] px-8 py-6 text-center">
            <p className="text-[13px] text-[#94a3b8]">
              ← Add a node from the sidebar to get started
            </p>
          </div>
        </div>
      )}

      <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAutoLayout}
          className="shadow-lg"
        >
          <LayoutGrid className="h-4 w-4" />
          Auto Layout
        </Button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={(changes) => dispatch(onNodesChange(changes))}
        onEdgesChange={(changes) => dispatch(onEdgesChange(changes))}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={(instance) => {
          reactFlowRef.current = instance
        }}
        fitView
        deleteKeyCode={null}
        className="dot-grid"
        defaultEdgeOptions={{ type: 'custom' }}
      >
        <Background color="#2a2d3e" gap={20} size={1} />
        <Controls showInteractive={false} position="bottom-left" />
        <MiniMap
          position="bottom-right"
          nodeColor={(node) =>
            NODE_ACCENT_COLORS[getNodeTypeFromNode(node as (typeof nodes)[0])]
          }
          maskColor="rgba(15, 17, 23, 0.8)"
        />
      </ReactFlow>
    </div>
  )
}
