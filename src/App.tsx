import { useSelector } from 'react-redux'
import Sidebar from '@/components/sidebar/Sidebar'
import WorkflowCanvas from '@/components/canvas/WorkflowCanvas'
import NodeConfigPanel from '@/components/panels/NodeConfigPanel'
import Toolbar from '@/components/toolbar/Toolbar'
import ValidationModal from '@/components/modals/ValidationModal'
import DeleteNodeDialog from '@/components/modals/DeleteNodeDialog'
import SimulationPanel from '@/components/modals/SimulationPanel'
import { Toaster } from '@/components/ui/toaster'
import { SimulationProvider } from '@/hooks/useSimulation'
import { selectUi } from '@/store/selectors'
import { cn } from '@/lib/utils'

function AppContent() {
  const { rightPanelOpen } = useSelector(selectUi)

  return (
    <div className="flex h-full flex-col bg-[#0f1117]">
      <Toolbar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="relative min-w-0 flex-1">
          <WorkflowCanvas />
          <SimulationPanel />
        </main>
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-out',
            rightPanelOpen ? 'w-[320px]' : 'w-0',
          )}
        >
          {rightPanelOpen && <NodeConfigPanel />}
        </div>
      </div>
      <ValidationModal />
      <DeleteNodeDialog />
      <Toaster />
    </div>
  )
}

export default function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  )
}
