import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPowerOff, faTrash, faPlus, faArrowRight, faArrowLeft, faPencil } from '@fortawesome/free-solid-svg-icons'

library.add(faPowerOff, faTrash, faPlus, faArrowRight, faArrowLeft, faPencil)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
