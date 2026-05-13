import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Toaster } from "sonner";

import { AppProvider } from './app/providers/app-provider'
import App from './app'

import './styles/index.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <Toaster richColors position="top-right" />

      <App />
    </AppProvider>
  </StrictMode>,
)
