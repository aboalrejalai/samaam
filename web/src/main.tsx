import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
// Sets <html lang> and <html dir> before the first paint, so an Arabic reload
// does not flash left-to-right on the way in.
import '@/lib/i18n'
import '@/index.css'

// White mode only: clean up any stale dark mode setting so <html> never gets .dark
try {
  localStorage.removeItem('samaam.theme')
} catch {
  // Storage access may fail in private windows; ignore
}
document.documentElement.classList.remove('dark')

const container = document.getElementById('root')
if (container === null) throw new Error('Missing #root in index.html')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
