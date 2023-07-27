import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function AuthenticatedLayout() {
    const { user, token } = useAuth()

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
        console.log("MASUK")
        return <Navigate to={'/login'} />
    }

    return (
        <>
            <Outlet />
        </>
    )
}