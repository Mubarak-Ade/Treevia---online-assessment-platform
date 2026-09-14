import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, CheckCircle, Info, BarChart3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    trend?: {
        value: string;
        positive?: boolean;
    };
    icon?: React.ReactNode;
    iconColor?: string;
    iconBg?: string;
    progressValue?: number;
    progressColor?: string;
    className?: string;
}

export function MetricCard({
    title,
    value,
    subtext,
    trend,
    icon,
    iconColor = 'text-emerald-700',
    iconBg = 'bg-emerald-50',
    progressValue,
    progressColor = 'bg-emerald-500',
    className = '',
}: MetricCardProps) {
    return (
        <Card className={`bg-white border-slate-200/80 shadow-xs hover:border-slate-300 transition-all ${className}`}>
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">{title}</span>
                    {icon && (
                        <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center`}>
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
                    {progressValue !== undefined && (
                    <div className="mt-3">
                        <Progress
                            value={progressValue}
                            className={cn('h-1.5 [&_[data-slot=progress-indicator]]:', progressColor)}
                        />
                        <div className="flex justify-between mt-1">
                            <span className={cn('text-[10px] font-medium', progressColor)}>
                                {progressValue}%
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}