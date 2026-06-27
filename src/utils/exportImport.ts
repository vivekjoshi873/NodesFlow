import type { DecisionOperator, SavedWorkflow } from '@/types/workflow'

export function exportWorkflowToJson(workflow: SavedWorkflow): void {
  const blob = new Blob([JSON.stringify(workflow, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${workflow.name.replace(/[^a-z0-9-_ ]/gi, '_')}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function parseImportedWorkflow(content: string): SavedWorkflow {
  const parsed: unknown = JSON.parse(content)

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid workflow file')
  }

  const workflow = parsed as Record<string, unknown>

  if (
    typeof workflow.id !== 'string' ||
    typeof workflow.name !== 'string' ||
    typeof workflow.savedAt !== 'string' ||
    !Array.isArray(workflow.nodes) ||
    !Array.isArray(workflow.edges)
  ) {
    throw new Error('Workflow file is missing required fields')
  }

  return workflow as unknown as SavedWorkflow
}

export function evaluateDecision(
  fieldValue: string,
  operator: DecisionOperator,
  configuredValue: string,
): boolean {
  const numField = Number(fieldValue)
  const numConfig = Number(configuredValue)
  const bothNumeric =
    fieldValue.trim() !== '' &&
    configuredValue.trim() !== '' &&
    !Number.isNaN(numField) &&
    !Number.isNaN(numConfig)

  switch (operator) {
    case 'equals':
      return bothNumeric ? numField === numConfig : fieldValue === configuredValue
    case 'not_equals':
      return bothNumeric ? numField !== numConfig : fieldValue !== configuredValue
    case 'greater_than':
      return bothNumeric ? numField > numConfig : fieldValue > configuredValue
    case 'less_than':
      return bothNumeric ? numField < numConfig : fieldValue < configuredValue
    case 'contains':
      return fieldValue.includes(configuredValue)
    case 'not_contains':
      return !fieldValue.includes(configuredValue)
    default:
      return false
  }
}

export function getSimulationDelayMs(duration: number, unit: string): number {
  let ms = duration * 1000
  switch (unit) {
    case 'minutes':
      ms = duration * 60 * 1000
      break
    case 'hours':
      ms = duration * 60 * 60 * 1000
      break
    case 'days':
      ms = duration * 24 * 60 * 60 * 1000
      break
  }
  return Math.min(ms, 3000)
}

export function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Saved just now'
  if (minutes < 60) return `Saved ${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Saved ${hours}h ago`
  const days = Math.floor(hours / 24)
  return `Saved ${days}d ago`
}
