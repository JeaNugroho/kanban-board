import { useCallback, useState } from 'react'
import { Button } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Navbar.css'
import { useAuth } from '../contexts/AuthProvider'
import axiosClient from '../axios-client'

// eslint-disable-next-line react/prop-types
export default function Navbar() {
    const { setToken } = useAuth()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const logout = useCallback((event) => {
        event.preventDefault()
        setIsLoggingOut(true)

        axiosClient.post('/logout').then(() => {
            setToken(null)
            setIsLoggingOut(false)
        }).catch(() => {
            setToken(null)
            setIsLoggingOut(false)
        })
    }, [setToken])

    return (
        <div className='navbar'>
            <Button loading={isLoggingOut} loaderPosition='center' variant='default' className='logout-button' onClick={logout}>
                {!isLoggingOut && <FontAwesomeIcon icon="fa-solid fa-power-off" size='lg' />}
            </Button>
        </div>
    )
}