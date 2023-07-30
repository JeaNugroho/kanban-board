import { RouterProvider } from 'react-router-dom'

import './App.css'
import router from './router.jsx'
import { AuthProvider } from './contexts/AuthProvider'
import { ToastProvider } from './contexts/ToastProvider'

function App() {

  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </>
  )
}

export default App
