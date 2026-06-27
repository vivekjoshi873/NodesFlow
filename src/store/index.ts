import { configureStore } from '@reduxjs/toolkit'
import workflowReducer from './slices/workflowSlice'
import savedWorkflowsReducer from './slices/savedWorkflowsSlice'
import uiReducer from './slices/uiSlice'
import { localStorageMiddleware } from './middleware/localStorageMiddleware'

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    savedWorkflows: savedWorkflowsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
