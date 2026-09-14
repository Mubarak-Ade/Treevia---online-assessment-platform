import { tokenStore } from '@/lib/utils/token';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from './auth.api';
import { LoginInput, RegisterInput } from './types';
import { authKeys } from './queries';
import { useAuth } from './auth.hook';

export function useLogin() {
    const queryClient = useQueryClient();
    const { setAuthenticatedUser } = useAuth();

    return useMutation({
        mutationFn: (input: LoginInput) => authApi.login(input),

        onSuccess: (data) => {
            tokenStore.set(data.accessToken);

            setAuthenticatedUser(data.user);

            queryClient.setQueryData(authKeys.me(), data.user);
        },
    });
}

export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: RegisterInput) => authApi.register(input),

        onSuccess: (data) => {
            /**
             * Store access token ONLY in memory.
             */
            tokenStore.set(data.accessToken);

            /**
             * Put the authenticated user into
             * TanStack Query immediately.
             */
            queryClient.setQueryData(authKeys.me(), data.user);
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,

        onSuccess: () => {
            /**
             * Remove access token from memory.
             */
            tokenStore.clear();

            /**
             * Remove private server state.
             */
            queryClient.removeQueries({
                queryKey: authKeys.all,
            });

            /**
             * Remove other user-specific queries.
             *
             * If you later have:
             *
             * ['courses']
             * ['attempts']
             * ['analytics']
             *
             * you should clear those too.
             */
            queryClient.clear();
            window.location.href = '/login';
        },
    });
}
