import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/Footer/Modo_Nocturno'
import { FontSizeProvider } from './components/Footer/Modificador_Letras.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter >
      <ThemeProvider>
        <FontSizeProvider>
        <App />
        </FontSizeProvider>
      </ThemeProvider>

    </BrowserRouter>
  </React.StrictMode>,
)
