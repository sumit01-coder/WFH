import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ActivityProvider } from './contexts/ActivityContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { FeaturesProvider } from './contexts/FeaturesContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <FeaturesProvider>
            <ActivityProvider>
              <App />
            </ActivityProvider>
          </FeaturesProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>,
)
