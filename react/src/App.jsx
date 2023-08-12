import { RouterProvider } from 'react-router-dom'

import './App.css'
import router from './router.jsx'
import { AuthProvider } from './contexts/AuthProvider'
import { ToastProvider } from './contexts/ToastProvider'
import { DataProvider } from './contexts/DataProvider'

function App() {

  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <RouterProvider router={router} />
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </>
  )
}

export default App
