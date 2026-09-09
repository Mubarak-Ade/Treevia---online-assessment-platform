import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    children,
    className = '',
}: PageHeaderProps) {
    return (
        <div className={`space-y-4 pb-6 border-b border-slate-200 ${className}`}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
                    {breadcrumbs.map((crumb, idx) => {
                        const isLast = idx === breadcrumbs.length - 1;
                        return (
                            <React.Fragment key={idx}>
                                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                                {crumb.href && !isLast ? (
                                    <Link
                                        to={crumb.href}
                                        className="hover:text-slate-800 transition-colors font-medium"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className={isLast ? 'font-semibold text-slate-800' : ''}>
                                        {crumb.label}
                                    </span>
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-1 text-sm text-slate-500 leading-relaxed max-w-3xl">
                            {description}
                        </p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-2.5 flex-shrink-0">{actions}</div>}
            </div>

            {children}
        </div>
    );
}
