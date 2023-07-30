import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { Button } from "@mantine/core";

export default function AuthenticatedLayout() {
    const { user, token, setUser, setToken } = useAuth()

    // useEffect(() => {
    //     console.log("masuk")
    //     const onTokenRefresh = () => {
    //         console.log("masuk2")
    //         if (!token) {
    //             console.log("masuk3")
    //             return <Navigate to={'/login'} />
    //         }
    //     }

    //     onTokenRefresh()
    // }, [token]);

    if (!token) {
        return <Navigate to={'/login'} />
    }

    const onLogout = (event) => {
        event.preventDefault()

        axiosClient.post('/logout').then(() => {
            setUser({})
            setToken(null)
        })
    }

    useEffect(() => {
        axiosClient.get('/user').then(({data}) => setUser(data))
    }, [setUser, axiosClient.get])

    return (
        <>
            <p>{ user.name }</p>
            <Button onClick={onLogout}><h6>Logout</h6></Button>
            <Outlet />
        </>
    )
}