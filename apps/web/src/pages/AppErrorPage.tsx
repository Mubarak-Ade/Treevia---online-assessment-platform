import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppErrorPage() {
    const error = useRouteError();

    let title = 'Something went wrong';
    let message = 'An unexpected application error occurred. Please try refreshing.';

    if (isRouteErrorResponse(error)) {
        title = `${error.status} ${error.statusText}`;
        message = error.data?.message || error.statusText;
    } else if (error instanceof Error) {
        message = error.message;
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5 shadow-xs">
                <AlertOctagon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {title}
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-md leading-relaxed">
                {message}
            </p>

            <div className="mt-8 flex items-center gap-3">
                <Button
                    onClick={() => window.location.reload()}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 text-xs shadow-xs"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refresh Page</span>
                </Button>
                <Link to="/">
                    <Button variant="outline" className="border-slate-300 text-slate-700 text-xs gap-1.5">
                        <Home className="w-3.5 h-3.5" />
                        <span>Return to Safety</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
