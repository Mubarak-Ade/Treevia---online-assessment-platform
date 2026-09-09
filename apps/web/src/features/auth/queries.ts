import { useQuery } from '@tanstack/react-query';

import { authApi } from './auth.api';

export const authKeys = {
    all: ['auth'] as const,

    me: () => [...authKeys.all, 'me'] as const,
};

export function useCurrentUser() {
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: authApi.me,

        /**
         * We don't want React Query to repeatedly
         * call /auth/me after the user is known.
         */
        staleTime: 5 * 60 * 1000,

        /**
         * Authentication is initialized separately.
         */
        retry: false,
    });
}
