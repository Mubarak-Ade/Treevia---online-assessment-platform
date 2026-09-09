import { useAuth } from '@/features/auth/auth.hook';
import { useLocation, Navigate, Outlet } from 'react-router';

export function ProtectedRoute() {
    const { status, user } = useAuth();

    const location = useLocation();


    /**
     * Authentication is still being restored.
     */
    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
        </div>
        );
    }

    /**
     * User is not authenticated.
     */
    if (status === 'unauthenticated') {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }
    

    /**
     * User is authenticated.
     */
    return <Outlet />;
}
