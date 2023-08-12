import { Alert } from "@mantine/core";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import './ToastProvider.css'

const ToastContext = createContext({
    toasts: [],
    addAlert: () => {}
})

// eslint-disable-next-line react/prop-types
export const ToastProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([])
    // const alertsRef = useRef([])

    useEffect(() => {
        if (alerts.length > 0) {
            const timer = setTimeout(() => setAlerts(alerts => alerts.slice(1)), 3000)
            return () => clearTimeout(timer)
        }
    }, [alerts])

    const addAlert = useCallback((message, color = 'blue') => {
        const id = message
        const newAlert = { id, message, color }

        setAlerts(prevAlerts => [...prevAlerts, newAlert])
    }, [setAlerts])

    return (
        <>
            
            <ToastContext.Provider value={{ addAlert }}>    
                { children }
                <div className="alerts-container">
                    {alerts.map((alert, index) => (
                        <Alert key={index} color={alert.color} className="toast" variant="filled">
                            <p className="message">{alert.message}</p>
                        </Alert>
                    ))}
                </div>
            </ToastContext.Provider>
        </>
    )
}

export const useToast = () => {
    return useContext(ToastContext)
}