import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/store'
import App from '@/App'
import './index.css'

const savedTheme = localStorage.getItem('flowforge_theme')
document.documentElement.setAttribute(
  'data-theme',
  savedTheme === 'light' ? 'light' : 'dark',
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
