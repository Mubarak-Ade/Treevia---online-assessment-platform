import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './app/styles.css';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryProvider } from './app/providers/QueryProvider';
import { AuthProvider } from './features/auth/auth.context';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryProvider>
            <AuthProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AuthProvider>
        </QueryProvider>
    </StrictMode>,
);
