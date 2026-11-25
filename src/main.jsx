import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './fonts.css'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = <StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>

// Public pages have build-time HTML. Keep client-only routes working too.
// /learn/dashboard is served the home page's static HTML, so hydrating would mismatch.
const clientOnly = window.location.pathname.replace(/\/+$/, '') === '/learn/dashboard'
if (root.hasChildNodes() && !clientOnly) {
  hydrateRoot(root, app)
} else {
  root.textContent = ''
  createRoot(root).render(app)
}
