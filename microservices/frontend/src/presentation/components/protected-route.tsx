import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../application/store/auth-store";

export function ProtectedRoute() {
    const { token } = useAuthStore();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
