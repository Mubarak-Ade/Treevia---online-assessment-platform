import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton({
    type = 'card',
    count = 3,
}: {
    type?: 'card' | 'table' | 'row' | 'metric';
    count?: number;
}) {
    if (type === 'metric') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'table') {
        return (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden p-4 space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-24" />
                </div>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'row') {
        return (
            <div className="space-y-2.5">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="p-4 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
                    <div className="flex justify-between items-start">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="pt-3 border-t border-slate-100 flex justify-between">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            ))}
        </div>
    );
}
