import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { Inbox } from 'lucide-react';

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    keyExtractor: (item: T) => string;
    onRowClick?: (item: T) => void;
    className?: string;
}

export function DataTable<T>({
    columns,
    data,
    isLoading = false,
    emptyTitle = 'No records found',
    emptyDescription = 'There are no items to display right now.',
    keyExtractor,
    onRowClick,
    className = '',
}: DataTableProps<T>) {
    if (isLoading) {
        return <LoadingSkeleton type="table" count={5} />;
    }

    return (
        <div className={`rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs ${className}`}>
            <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                    <TableRow className="hover:bg-transparent">
                        {columns.map((col, idx) => (
                            <TableHead
                                key={idx}
                                className={`text-xs font-semibold text-slate-600 uppercase tracking-wider py-3 ${
                                    col.className || ''
                                }`}
                            >
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="p-0">
                                <EmptyState
                                    icon={<Inbox className="w-6 h-6 text-slate-400" />}
                                    title={emptyTitle}
                                    description={emptyDescription}
                                    className="border-0 rounded-none bg-transparent py-12"
                                />
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => {
                            const key = keyExtractor(item);
                            return (
                                <TableRow
                                    key={key}
                                    onClick={() => onRowClick?.(item)}
                                    className={`border-b border-slate-100 last:border-0 transition-colors ${
                                        onRowClick
                                            ? 'cursor-pointer hover:bg-slate-50/80 active:bg-slate-100/70'
                                            : 'hover:bg-slate-50/40'
                                    }`}
                                >
                                    {columns.map((col, colIdx) => (
                                        <TableCell
                                            key={colIdx}
                                            className={`py-3.5 text-sm text-slate-700 ${col.className || ''}`}
                                        >
                                            {col.cell
                                                ? col.cell(item)
                                                : col.accessorKey
                                                ? String(item[col.accessorKey] ?? '')
                                                : null}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
