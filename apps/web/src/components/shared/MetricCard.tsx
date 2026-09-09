import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface MetricCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    trend?: {
        value: string;
        positive?: boolean;
    };
    icon?: React.ReactNode;
    className?: string;
}

export function MetricCard({
    title,
    value,
    subtext,
    trend,
    icon,
    className = '',
}: MetricCardProps) {
    return (
        <Card className={`bg-white border-slate-200/80 shadow-xs hover:border-slate-300 transition-all ${className}`}>
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">{title}</span>
                    {icon && (
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            {icon}
                        </div>
                    )}
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </span>
                    {trend && (
                        <span
                            className={`inline-flex items-center text-xs font-semibold ${
                                trend.positive ? 'text-emerald-700' : 'text-slate-500'
                            }`}
                        >
                            {trend.positive ? (
                                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                            )}
                            {trend.value}
                        </span>
                    )}
                </div>
                {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
            </CardContent>
        </Card>
    );
}
