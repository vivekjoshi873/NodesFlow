import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import {
  Zap,
  CheckCircle2,
  Play,
  Save,
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react'
import { setWorkflowName, markSaved, loadWorkflow } from '@/store/slices/workflowSlice'
import { saveWorkflow } from '@/store/slices/savedWorkflowsSlice'
import {
  selectCanSimulate,
  selectTheme,
  selectWorkflow,
} from '@/store/selectors'
import { useWorkflowValidation } from '@/hooks/useWorkflowValidation'
import { useSimulation } from '@/hooks/useSimulation'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { exportWorkflowToJson, parseImportedWorkflow } from '@/utils/exportImport'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toggleTheme } from '@/store/slices/uiSlice'

export default function Toolbar() {
  const dispatch = useDispatch()
  const { name, id, nodes, edges, simulationState } = useSelector(selectWorkflow)
  const canSimulate = useSelector(selectCanSimulate)
  const theme = useSelector(selectTheme)
  const { hasUnsavedChanges } = useUnsavedChanges()
  const { validate } = useWorkflowValidation()
  const { runSimulation, resetSimulation } = useSimulation()
  const [editingName, setEditingName] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    const savedId = id ?? uuidv4()
    dispatch(
      saveWorkflow({
        id: savedId,
        name,
        nodes,
        edges,
      }),
    )
    dispatch(markSaved(savedId))
    toast({ title: 'Workflow saved', description: `"${name}" saved successfully` })
  }

  const handleExport = () => {
    exportWorkflowToJson({
      id: id ?? uuidv4(),
      name,
      savedAt: new Date().toISOString(),
      nodes,
      edges,
    })
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const workflow = parseImportedWorkflow(text)
      dispatch(
        loadWorkflow({
          id: workflow.id,
          name: workflow.name,
          nodes: workflow.nodes,
          edges: workflow.edges,
        }),
      )
      toast({ title: 'Import successful', description: `Workflow imported: ${workflow.name}` })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Import failed',
        description: 'The selected file is not a valid workflow JSON',
      })
    }
    e.target.value = ''
  }

  return (
    <header
      className="flex h-12 shrink-0 items-center border-b px-4"
      style={{
        background: 'var(--bg-app)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4" style={{ color: 'var(--color-trigger)' }} />
        <span className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          FlowForge
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center gap-2">
        {editingName ? (
          <Input
            autoFocus
            value={name}
            onChange={(e) => dispatch(setWorkflowName(e.target.value))}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
            className="h-8 max-w-[240px] text-center"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingName(true)}
            className="flex items-center gap-2 text-[13px] font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {hasUnsavedChanges && (
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: 'var(--color-decision)' }}
                title="Unsaved changes"
              />
            )}
            {name}
          </button>
        )}

        <button
          onClick={() => dispatch(toggleTheme())}
          style={{
            background: 'var(--bg-node)',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            padding: '6px 8px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      <div className="flex items-center gap-2">
        {simulationState.completed && (
          <Button variant="outline" size="sm" onClick={resetSimulation}>
            <RotateCcw className="h-4 w-4" />
            Reset Simulation
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={validate} className="cursor-pointer">
          <CheckCircle2 className="h-4 w-4" />
          Validate
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canSimulate}
          onClick={runSimulation}
          className={cn(!canSimulate && 'opacity-50')}
        >
          <Play className="h-4 w-4" />
          Simulate
        </Button>
        <Button size="sm" onClick={handleSave} className="cursor-pointer">
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport} className="cursor-pointer">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
          <Upload className="h-4 w-4" />
          Import
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />
      </div>
    </header>
  )
}
