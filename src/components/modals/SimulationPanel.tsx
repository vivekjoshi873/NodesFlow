import { useSelector } from 'react-redux'
import { selectWorkflow } from '@/store/selectors'

export default function SimulationPanel() {
  const { simulationState } = useSelector(selectWorkflow)

  if (!simulationState.active && !simulationState.completed) return null

  return (
    <div
      className="absolute bottom-20 left-1/2 z-30 -translate-x-1/2 rounded-lg border px-4 py-2"
      style={{ background: 'var(--bg-app)', borderColor: 'var(--border-primary)' }}
    >
      <p
        className="text-[11px] font-medium uppercase tracking-[0.05em]"
        style={{ color: 'var(--text-secondary)' }}
      >
        Simulation
      </p>
      <p className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
        {simulationState.active
          ? 'Running workflow…'
          : simulationState.pathLabels.join(' → ')}
      </p>
    </div>
  )
}
