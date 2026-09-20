import { cn } from '@/lib/utils';

interface TreeviaLogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function TreeviaLogo({ className, size = 'md' }: TreeviaLogoProps) {
    const sizes = {
        sm: { icon: 'w-5 h-5', text: 'text-lg' },
        md: { icon: 'w-7 h-7', text: 'text-2xl' },
        lg: { icon: 'w-9 h-9', text: 'text-3xl' },
    };

    return (
        <div className={cn('flex items-center gap-2.5', className)}>
            <svg
                className={cn(sizes[size].icon, 'text-emerald-800')}
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
            </svg>
            <span className={cn('font-bold tracking-tight text-emerald-800', sizes[size].text)}>
                Treevia
            </span>
        </div>
    );
}
