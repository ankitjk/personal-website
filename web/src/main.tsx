import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
// Fonts are bundled with the site rather than loaded from Google Fonts
import '@fontsource/young-serif'
import '@fontsource-variable/figtree'
import './index.css'
import App from './App.tsx'

// index.html has a general description for anything that reads the page
// without running JavaScript. Each page renders its own, and React adds that
// one rather than replacing this, so remove this one to avoid having two.
document.querySelector('meta[name="description"]')?.remove()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
