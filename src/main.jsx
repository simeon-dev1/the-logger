import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PromiseLogger from './promise-logger.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PromiseLogger />
  </StrictMode>,
)
