import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function AuthenticatedLayout() {
    const { token } = useAuth()

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

    

    // useEffect(() => {
    //     axiosClient.get('/user').then(({data}) => setUser(data))
    // }, [setUser, axiosClient.get])

    return (
        <>
            <Outlet />
        </>
    )
}