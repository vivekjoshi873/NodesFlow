import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectWorkflow } from '@/store/selectors'

export function useUnsavedChanges() {
  const { hasUnsavedChanges } = useSelector(selectWorkflow)

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasUnsavedChanges])

  return { hasUnsavedChanges }
}
