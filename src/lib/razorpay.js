// Razorpay checkout.js pulls about 1 MB of its own assets. Load it only when a payment screen is used,
// not on page open. warmRazorpay() starts the load on the first form interaction; loadRazorpay() is awaited at pay time.
let pending = null
export function loadRazorpay() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
  if (window.Razorpay) return Promise.resolve()
  if (pending) return pending
  pending = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => { pending = null; s.remove(); reject(new Error('Payment could not be loaded. Check your connection and try again.')) }
    document.head.appendChild(s)
  })
  return pending
}
export function warmRazorpay() {
  const go = () => { loadRazorpay().catch(() => {}) }
  document.addEventListener('focusin', go, { once: true })
  return () => document.removeEventListener('focusin', go)
}
