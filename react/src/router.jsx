import { Navigate, createBrowserRouter } from "react-router-dom"

import Login from "./views/Login"
import SignUp from "./views/SignUp"
import Board from "./views/Board"
import NotFound from "./views/NotFound"
import AuthenticatedLayout from "./components/AuthenticatedLayout"
import GuestLayout from "./components/GuestLayout"

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthenticatedLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to={'/board'} />
            },
            {
                path: '/board',
                element: <Board />
            },
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <SignUp />
            },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default router