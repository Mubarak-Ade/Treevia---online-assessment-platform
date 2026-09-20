import { useAuth } from "@/features/auth/auth.hook"
import { Navigate, Outlet } from "react-router"

export const PublicOnlyRoute = () => {
    const {status, user} = useAuth()

    if (status === "loading") return <div>Loading...</div>

    if (status === "authenticated" && user?.role && user.role !== 'STUDENT') {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}
