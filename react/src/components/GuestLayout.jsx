import { Navigate, Outlet } from "react-router-dom"
import { Container } from '@mantine/core'

import { useAuth } from "../contexts/AuthProvider"
import './GuestLayout.css'

export default function GuestLayout() {
    const { token } = useAuth()

    if (token) {
        return <Navigate to={'/'} />
    }

    return (
        <Container size="xs">
            <div className="guest-container">
                <Outlet />
            </div>
        </Container>
    )
}