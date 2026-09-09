import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({
    title = 'Unable to load content',
    message = 'An unexpected error occurred while communicating with the server.',
    onRetry,
    className = '',
}: ErrorStateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-rose-100 bg-rose-50/30 ${className}`}
        >
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600 max-w-sm">{message}</p>
            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="mt-5 border-slate-300 text-slate-700 hover:bg-slate-50 gap-2"
                >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Try again</span>
                </Button>
            )}
        </div>
    );
}
