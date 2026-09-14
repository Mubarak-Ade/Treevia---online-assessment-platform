import * as React from 'react';
import { ChevronRight, Briefcase, Calendar } from 'lucide-react';
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
    contextLabel?: string;
    contextDescription?: string;
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    children,
    className = '',
    contextLabel,
    contextDescription,
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

            {(contextLabel || contextDescription) && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    {contextLabel && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                            <Calendar className="w-3 h-3" />
                            {contextLabel}
                        </span>
                    )}
                    {contextDescription && (
                        <>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                {contextDescription}
                            </span>
                        </>
                    )}
                </div>
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
