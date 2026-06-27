import type { WorkflowEdge, WorkflowNode, ValidationResult } from '@/types/workflow'
import { NODE_TYPE_LABELS } from '@/types/workflow'
import { getNodeTypeFromNode } from './nodeDefaults'

function getAdjacency(nodes: WorkflowNode[], edges: WorkflowEdge[]): Map<string, string[]> {
  const adj = new Map<string, string[]>()
  for (const node of nodes) {
    adj.set(node.id, [])
  }
  for (const edge of edges) {
    adj.get(edge.source)?.push(edge.target)
  }
  return adj
}

function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] {
  const adj = getAdjacency(nodes, edges)
  const visited = new Set<string>()
  const stack = new Set<string>()
  let cycleNodes: string[] = []

  const dfs = (nodeId: string, path: string[]): boolean => {
    visited.add(nodeId)
    stack.add(nodeId)
    path.push(nodeId)

    for (const neighbor of adj.get(nodeId) ?? []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, path)) return true
      } else if (stack.has(neighbor)) {
        const cycleStart = path.indexOf(neighbor)
        cycleNodes = path.slice(cycleStart)
        return true
      }
    }

    stack.delete(nodeId)
    path.pop()
    return false
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id, [])) break
    }
  }

  return cycleNodes
}

function getReachableFromTrigger(
  triggerId: string,
  edges: WorkflowEdge[],
): Set<string> {
  const reachable = new Set<string>([triggerId])
  const queue = [triggerId]

  while (queue.length > 0) {
    const current = queue.shift()!
    for (const edge of edges) {
      if (edge.source === current && !reachable.has(edge.target)) {
        reachable.add(edge.target)
        queue.push(edge.target)
      }
    }
  }

  return reachable
}

function isNodeConfigComplete(node: WorkflowNode): boolean {
  const data = node.data
  switch (data.nodeType) {
    case 'trigger':
      return Boolean(data.name.trim())
    case 'decision':
      return Boolean(data.field.trim() && data.value.trim())
    case 'delay':
      return data.duration >= 1
    case 'action':
      return Boolean(data.actionName.trim())
    default:
      return true
  }
}

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const passedChecks: string[] = []
  let cycleNodeIds: string[] = []

  const triggerNodes = nodes.filter((n) => getNodeTypeFromNode(n) === 'trigger')

  if (triggerNodes.length === 1) {
    passedChecks.push('Exactly one Trigger node exists')
  } else if (triggerNodes.length === 0) {
    errors.push('Workflow must have exactly one Trigger node (found 0)')
  } else {
    errors.push(
      `Workflow must have exactly one Trigger node (found ${triggerNodes.length}: ${triggerNodes.map((n) => n.data.name).join(', ')})`,
    )
  }

  const trigger = triggerNodes[0]
  if (trigger) {
    const outgoing = edges.filter((e) => e.source === trigger.id)
    if (outgoing.length > 0) {
      passedChecks.push('Trigger node has at least one outgoing connection')
    } else {
      errors.push(`Trigger "${trigger.data.name}" has no outgoing connections`)
    }
  }

  if (trigger) {
    const reachable = getReachableFromTrigger(trigger.id, edges)
    const disconnected = nodes.filter(
      (n) => getNodeTypeFromNode(n) !== 'trigger' && !reachable.has(n.id),
    )
    if (disconnected.length === 0) {
      passedChecks.push('All nodes are reachable from Trigger')
    } else {
      errors.push(
        `Disconnected nodes: ${disconnected.map((n) => n.data.name).join(', ')}`,
      )
    }
  } else {
    errors.push('Cannot check reachability without a Trigger node')
  }

  cycleNodeIds = detectCycle(nodes, edges)
  if (cycleNodeIds.length === 0) {
    passedChecks.push('No circular dependencies detected')
  } else {
    const cycleNames = cycleNodeIds
      .map((id) => nodes.find((n) => n.id === id)?.data.name ?? id)
      .join(' → ')
    errors.push(`Circular dependency detected: ${cycleNames}`)
  }

  const decisionNodes = nodes.filter((n) => getNodeTypeFromNode(n) === 'decision')
  const decisionsWithBothHandles = decisionNodes.filter((node) => {
    const trueEdge = edges.some(
      (e) => e.source === node.id && e.sourceHandle === 'true',
    )
    const falseEdge = edges.some(
      (e) => e.source === node.id && e.sourceHandle === 'false',
    )
    return trueEdge && falseEdge
  })

  if (decisionNodes.length === 0) {
    passedChecks.push('No Decision nodes to validate')
  } else if (decisionsWithBothHandles.length === decisionNodes.length) {
    passedChecks.push('All Decision nodes have TRUE and FALSE connections')
  } else {
    const incomplete = decisionNodes.filter(
      (n) => !decisionsWithBothHandles.includes(n),
    )
    errors.push(
      `Decision nodes missing TRUE/FALSE connections: ${incomplete.map((n) => n.data.name).join(', ')}`,
    )
  }

  const actionDelayNodes = nodes.filter((n) => {
    const type = getNodeTypeFromNode(n)
    return type === 'action' || type === 'delay'
  })
  const incompleteConfig = actionDelayNodes.filter((n) => !isNodeConfigComplete(n))
  if (incompleteConfig.length === 0) {
    passedChecks.push('All Action and Delay nodes have required fields filled')
  } else {
    errors.push(
      `Incomplete configuration: ${incompleteConfig.map((n) => `${NODE_TYPE_LABELS[getNodeTypeFromNode(n)]} "${n.data.name}"`).join(', ')}`,
    )
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    passedChecks,
    cycleNodeIds,
  }
}
