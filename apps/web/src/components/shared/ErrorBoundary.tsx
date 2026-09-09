import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Send to error tracking (Sentry, etc.)
        console.error('Uncaught error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5 shadow-xs">
                        <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Something went wrong
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 max-w-md leading-relaxed">
                        An unexpected application error occurred. We have logged this diagnostic event.
                    </p>
                    {this.state.error?.message && (
                        <div className="mt-4 p-3 rounded-lg bg-slate-100 text-slate-600 text-xs font-mono max-w-md break-words">
                            {this.state.error.message}
                        </div>
                    )}
                    <div className="mt-6 flex items-center gap-3">
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 text-xs shadow-xs"
                        >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Reload Page</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => (window.location.href = '/')}
                            className="border-slate-300 text-slate-700 text-xs gap-1.5"
                        >
                            <Home className="w-3.5 h-3.5" />
                            <span>Back to Home</span>
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
