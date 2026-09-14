import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { QueryProvider } from './app/providers';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './features/auth/auth.context';
import { routes } from './app/router/routes';

export default function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <QueryProvider>
                    <AuthProvider>
                        <BrowserRouter>
                            {routes}
                        </BrowserRouter>
                    </AuthProvider>
                </QueryProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}