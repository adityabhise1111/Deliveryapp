import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './context/UserContext.tsx'
import CaptainContextProvider from './context/CaptainContext.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CaptainContextProvider>
      <UserContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserContextProvider>
    </CaptainContextProvider>
  </StrictMode>,
)
