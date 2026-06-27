import type { Middleware } from '@reduxjs/toolkit'
import { LOCAL_STORAGE_KEY } from '@/types/workflow'

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)
  if (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof action.type === 'string' &&
    action.type.startsWith('savedWorkflows/')
  ) {
    const state = store.getState() as {
      savedWorkflows: { workflows: unknown[] }
    }
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(state.savedWorkflows.workflows),
    )
  }
  return result
}
