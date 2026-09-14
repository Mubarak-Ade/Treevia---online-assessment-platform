import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { tokenStore } from '@/lib/utils/token';
import { authApi } from './auth.api';
import { authKeys } from './queries';
import { User } from './types';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
    user: User | null;
    status: AuthStatus;
    setAuthenticatedUser: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const queryClient = useQueryClient();

    const [user, setUser] = useState<User | null>(null);

    const [status, setStatus] = useState<AuthStatus>('loading');

    useEffect(() => {
        let mounted = true;

        async function initializeAuth() {
            try {
                /**
                 * Browser reload means our access token
                 * disappeared from memory.
                 *
                 * Ask the backend for a new one.
                 *
                 * The refresh token is automatically
                 * sent as the HttpOnly cookie.
                 */
                const { accessToken } = await authApi.refresh();

                if (!mounted) return;

                tokenStore.set(accessToken);

                /**
                 * Now that we have an access token,
                 * retrieve the authenticated user.
                 */
                const currentUser = await authApi.me();

                if (!mounted) return;

                setUser({...currentUser});

                queryClient.setQueryData(authKeys.me(), currentUser);

                setStatus('authenticated');
            } catch {
                if (!mounted) return;

                tokenStore.clear();
                setUser(null);
                setStatus('unauthenticated');

                queryClient.removeQueries({
                    queryKey: authKeys.me(),
                });
            }
        }

        initializeAuth();

        return () => {
            mounted = false;
        };
    }, [queryClient]);

    const setAuthenticatedUser = (user: User) => {
        setUser(user);
        setStatus('authenticated');

        queryClient.setQueryData(authKeys.me(), user);
    };

    const logout = () => {
        tokenStore.clear();
        setUser(null);
        setStatus('unauthenticated');

        queryClient.removeQueries({
            queryKey: authKeys.all,
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                status,
                logout,
                setAuthenticatedUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be used inside AuthProvider');
    }

    return context;
}
