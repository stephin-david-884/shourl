import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../components/common/Spinner";
import UserLayout from "../layouts/UserLayout";

const UserProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-neutral-50">
                <Spinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <UserLayout>
            <Outlet />
        </UserLayout>
    );
};

export default UserProtectedRoute;