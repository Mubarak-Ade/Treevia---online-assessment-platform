import { create } from 'zustand';

export interface EducatorUser {
    id: string;
    name: string;
    email: string;
    institution?: string;
}

interface AuthState {
    user: EducatorUser | null;
    isAuthenticated: boolean;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: (() => {
        try {
            return !!localStorage.getItem('treevia_educator');
        } catch {
            return false;
        }
    })(),
    logout: () => {
        localStorage.removeItem('treevia_educator');
        set({ user: null, isAuthenticated: false });
    },
}));
