import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    onClear?: () => void;
}

export function SearchInput({
    value,
    onChange,
    placeholder = 'Search...',
    className = '',
    onClear,
}: SearchInputProps) {
    return (
        <div className={`relative flex items-center ${className}`}>
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-8 h-9 text-sm bg-white border-slate-200 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/20"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => {
                        onChange('');
                        onClear?.();
                    }}
                    className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                    <X className="w-3.5 h-3.5" />
                    <span className="sr-only">Clear search</span>
                </button>
            )}
        </div>
    );
}
