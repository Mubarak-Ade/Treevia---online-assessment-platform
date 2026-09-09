import * as React from 'react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    children?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    children,
    className = '',
}: EmptyStateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-slate-200 bg-white/50 ${className}`}
        >
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs"
                >
                    {actionLabel}
                </Button>
            )}
            {children && <div className="mt-4">{children}</div>}
        </div>
    );
}
