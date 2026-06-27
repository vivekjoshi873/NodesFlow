import { useSelector } from 'react-redux'
import { selectWorkflow } from '@/store/selectors'

export default function SimulationPanel() {
  const { simulationState } = useSelector(selectWorkflow)

  if (!simulationState.active && !simulationState.completed) return null

  return (
    <div className="absolute bottom-20 left-1/2 z-30 -translate-x-1/2 rounded-lg border border-[#2a2d3e] bg-[#1a1d2e]/95 px-4 py-2 shadow-lg backdrop-blur-sm">
      <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#94a3b8]">
        Simulation
      </p>
      <p className="text-[13px] text-[#e2e8f0]">
        {simulationState.active
          ? 'Running workflow…'
          : simulationState.pathLabels.join(' → ')}
      </p>
    </div>
  )
}
