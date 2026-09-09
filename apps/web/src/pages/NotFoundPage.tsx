import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <span className="text-6xl font-extrabold text-emerald-800 tracking-tight">
                404
            </span>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Page Not Found</h1>
            <p className="mt-2 text-sm text-slate-500 max-w-sm">
                The assessment, workspace, or page you are looking for does not exist or has been relocated.
            </p>
            <div className="mt-6 flex items-center gap-3">
                <Link to="/">
                    <Button className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 shadow-xs text-xs">
                        <Home className="w-3.5 h-3.5" />
                        <span>Return Home</span>
                    </Button>
                </Link>
                <Link to="/dashboard">
                    <Button variant="outline" className="border-slate-300 text-slate-700 text-xs">
                        Educator Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}
