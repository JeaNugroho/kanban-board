import { RouterProvider } from 'react-router-dom'

import './App.css'
import router from './router.jsx'
import { AuthProvider } from './contexts/AuthProvider'

function App() {

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
