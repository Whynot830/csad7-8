import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.postcss'
import { NextUIProvider } from '@nextui-org/react'
import AuthContextProvider from './components/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <NextUIProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </NextUIProvider>
)
