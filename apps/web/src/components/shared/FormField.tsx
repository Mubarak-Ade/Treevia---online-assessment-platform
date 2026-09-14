import * as React from 'react';
import { Label } from '@/components/ui/label';

export interface FormFieldProps {
    id?: string;
    label?: React.ReactNode;
    description?: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function FormField({
    id,
    label,
    description,
    error,
    required,
    children,
    className = '',
}: FormFieldProps) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <div className="flex items-center justify-between">
                    <Label htmlFor={id} className="text-xs font-semibold text-slate-700">
                        {label} {required && <span className="text-rose-500">*</span>}
                    </Label>
                </div>
            )}
            {children}
            {description && !error && (
                <p className="text-xs text-slate-500 leading-normal">{description}</p>
            )}
            {error && (
                <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}
