import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  resetSimulation,
  setEdgeSimulationStyle,
  setSimulationState,
  updateNodeSimulationFlags,
} from '@/store/slices/workflowSlice'
import { setSimulationRunning } from '@/store/slices/uiSlice'
import { selectWorkflow } from '@/store/selectors'
import { toast } from '@/hooks/use-toast'
import { evaluateDecision, getSimulationDelayMs } from '@/utils/exportImport'
import { getNodeTypeFromNode } from '@/utils/nodeDefaults'
import { NODE_ACCENT_COLORS } from '@/types/workflow'
import type { WorkflowEdge, WorkflowNode } from '@/types/workflow'

interface SimulationContextValue {
  submitDecision: (nodeId: string, value: string) => void
}

const SimulationContext = createContext<SimulationContextValue | null>(null)

export function useSimulationContext() {
  return useContext(SimulationContext)
}

const simulationActions: {
  run: (() => Promise<void>) | null
  reset: (() => void) | null
} = { run: null, reset: null }

function getNextEdge(
  nodeId: string,
  edges: WorkflowEdge[],
  sourceHandle?: string,
): WorkflowEdge | undefined {
  if (sourceHandle) {
    return edges.find((e) => e.source === nodeId && e.sourceHandle === sourceHandle)
  }
  return edges.find((e) => e.source === nodeId)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const { nodes, edges } = useSelector(selectWorkflow)
  const decisionResolverRef = useRef<((value: string) => void) | null>(null)
  const runningRef = useRef(false)

  const submitDecision = useCallback(
    (nodeId: string, value: string) => {
      dispatch(
        updateNodeSimulationFlags({
          nodeId,
          flags: { showDecisionPrompt: false },
        }),
      )
      decisionResolverRef.current?.(value)
      decisionResolverRef.current = null
    },
    [dispatch],
  )

  const waitForDecision = useCallback(
    (nodeId: string) =>
      new Promise<string>((resolve) => {
        decisionResolverRef.current = resolve
        dispatch(
          updateNodeSimulationFlags({
            nodeId,
            flags: { showDecisionPrompt: true },
          }),
        )
      }),
    [dispatch],
  )

  const runSimulation = useCallback(async () => {
    if (runningRef.current) return
    runningRef.current = true

    dispatch(resetSimulation())
    dispatch(setSimulationRunning(true))
    dispatch(
      setSimulationState({
        active: true,
        visitedNodes: [],
        visitedEdges: [],
        pathLabels: [],
        completed: false,
        currentNode: null,
        pendingDecisionNodeId: null,
      }),
    )

    const trigger = nodes.find((n: WorkflowNode) => getNodeTypeFromNode(n) === 'trigger')
    if (!trigger) {
      runningRef.current = false
      dispatch(setSimulationRunning(false))
      return
    }

    const pathLabels: string[] = [trigger.data.name]
    const visitedNodes: string[] = []
    const visitedEdges: string[] = []

    let current: WorkflowNode | undefined = trigger

    const highlight = async (node: WorkflowNode, status?: string, active = true) => {
      dispatch(
        updateNodeSimulationFlags({
          nodeId: node.id,
          flags: {
            isSimulationActive: active,
            isSimulationVisited: true,
            simulationStatus: status,
          },
        }),
      )
      dispatch(setSimulationState({ currentNode: node.id, visitedNodes: [...visitedNodes] }))
    }

    try {
      while (current) {
        visitedNodes.push(current.id)
        const type = getNodeTypeFromNode(current)

        if (type === 'trigger') {
          await highlight(current, undefined, true)
          await sleep(800)
          dispatch(
            updateNodeSimulationFlags({
              nodeId: current.id,
              flags: { isSimulationActive: false },
            }),
          )
        } else if (type === 'decision' && current.data.nodeType === 'decision') {
          await highlight(current, 'Awaiting test value…')
          const testValue = await waitForDecision(current.id)
          const result = evaluateDecision(
            testValue,
            current.data.operator,
            current.data.value,
          )
          const branch = result ? 'TRUE' : 'FALSE'
          dispatch(
            updateNodeSimulationFlags({
              nodeId: current.id,
              flags: {
                isSimulationActive: false,
                simulationStatus: `Result: ${branch}`,
              },
            }),
          )
          pathLabels.push(`${current.data.name} [${branch}]`)

          const nextEdge = getNextEdge(current.id, edges, result ? 'true' : 'false')
          if (!nextEdge) break

          visitedEdges.push(nextEdge.id)
          dispatch(setSimulationState({ visitedEdges: [...visitedEdges] }))
          dispatch(
            setEdgeSimulationStyle({
              edgeId: nextEdge.id,
              animated: true,
              color: NODE_ACCENT_COLORS.decision,
            }),
          )
          await sleep(800)
          current = nodes.find((n: WorkflowNode) => n.id === nextEdge.target)
          continue
        } else if (type === 'delay' && current.data.nodeType === 'delay') {
          const delayMs = getSimulationDelayMs(current.data.duration, current.data.unit)
          const secs = Math.ceil(delayMs / 1000)
          await highlight(current, `Waiting ${secs}s…`)
          await sleep(delayMs)
          dispatch(
            updateNodeSimulationFlags({
              nodeId: current.id,
              flags: { isSimulationActive: false, simulationStatus: 'Done' },
            }),
          )
          pathLabels.push(current.data.name)
        } else if (type === 'action') {
          await highlight(current, 'Executing…')
          await sleep(600)
          dispatch(
            updateNodeSimulationFlags({
              nodeId: current.id,
              flags: {
                isSimulationActive: false,
                isSimulationDone: true,
                simulationStatus: 'Done ✓',
              },
            }),
          )
          pathLabels.push(current.data.name)
        }

        const nextEdge = getNextEdge(current.id, edges)
        if (!nextEdge) break

        visitedEdges.push(nextEdge.id)
        dispatch(
          setSimulationState({
            visitedNodes: [...visitedNodes],
            visitedEdges: [...visitedEdges],
          }),
        )
        dispatch(
          setEdgeSimulationStyle({
            edgeId: nextEdge.id,
            animated: true,
            color: NODE_ACCENT_COLORS[type],
          }),
        )
        await sleep(800)
        current = nodes.find((n: WorkflowNode) => n.id === nextEdge.target)
      }

      dispatch(
        setSimulationState({
          active: false,
          completed: true,
          pathLabels,
          currentNode: null,
          visitedNodes,
          visitedEdges,
        }),
      )

      toast({
        title: 'Simulation Complete',
        description: pathLabels.join(' → '),
      })
    } finally {
      runningRef.current = false
      dispatch(setSimulationRunning(false))
    }
  }, [dispatch, edges, nodes, waitForDecision])

  const resetSimulationFn = useCallback(() => {
    dispatch(resetSimulation())
  }, [dispatch])

  simulationActions.run = runSimulation
  simulationActions.reset = resetSimulationFn

  return (
    <SimulationContext.Provider value={{ submitDecision }}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  const simulationState = useSelector(selectWorkflow).simulationState

  return {
    runSimulation: () => simulationActions.run?.(),
    resetSimulation: () => simulationActions.reset?.(),
    simulationState,
  }
}
