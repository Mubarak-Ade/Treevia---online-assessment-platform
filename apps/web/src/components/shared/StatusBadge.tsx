import { Badge } from '@/components/ui/badge';

export type StatusType =
    | 'DRAFT'
    | 'PUBLISHED'
    | 'CLOSED'
    | 'IN_PROGRESS'
    | 'SUBMITTED'
    | 'GRADED'
    | 'ACTIVE'
    | 'EXPIRED';

interface StatusBadgeProps {
    status: StatusType | string;
    className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const normalized = (status || '').toUpperCase();

    switch (normalized) {
        case 'PUBLISHED':
        case 'ACTIVE':
        case 'GRADED':
            return (
                <Badge
                    variant="outline"
                    className={`bg-emerald-50 text-emerald-700 border-emerald-200 font-medium ${className}`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                    {normalized === 'PUBLISHED' ? 'Published' : normalized === 'ACTIVE' ? 'Active' : 'Graded'}
                </Badge>
            );

        case 'DRAFT':
            return (
                <Badge
                    variant="outline"
                    className={`bg-slate-50 text-slate-700 border-slate-200 font-medium ${className}`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
                    Draft
                </Badge>
            );

        case 'IN_PROGRESS':
            return (
                <Badge
                    variant="outline"
                    className={`bg-amber-50 text-amber-700 border-amber-200 font-medium ${className}`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                    In Progress
                </Badge>
            );

        case 'SUBMITTED':
            return (
                <Badge
                    variant="outline"
                    className={`bg-blue-50 text-blue-700 border-blue-200 font-medium ${className}`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
                    Submitted
                </Badge>
            );

        case 'CLOSED':
        case 'EXPIRED':
            return (
                <Badge
                    variant="outline"
                    className={`bg-rose-50 text-rose-700 border-rose-200 font-medium ${className}`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
                    {normalized === 'CLOSED' ? 'Closed' : 'Expired'}
                </Badge>
            );

        default:
            return (
                <Badge variant="outline" className={`font-medium ${className}`}>
                    {status}
                </Badge>
            );
    }
}
