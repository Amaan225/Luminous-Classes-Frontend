import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './fonts.css'
import './index.css'
import App from './App.jsx'

// Razorpay is only needed on the tutor payment screens. Load it after the page is idle, not on every page.
if (import.meta.env.VITE_TUTOR_PREVIEW !== 'true' && /^\/(tutor|register|tutor-legacy)\/?$/.test(window.location.pathname)) {
  const loadCheckout = () => { if (document.getElementById('t49-razorpay-idle')) return; const s = document.createElement('script'); s.id = 't49-razorpay-idle'; s.src = 'https://checkout.razorpay.com/v1/checkout.js'; s.async = true; document.head.appendChild(s) }
  const when = () => ('requestIdleCallback' in window ? requestIdleCallback(loadCheckout, { timeout: 3000 }) : setTimeout(loadCheckout, 1500))
  if (document.readyState === 'complete') when(); else window.addEventListener('load', when, { once: true })
}

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
