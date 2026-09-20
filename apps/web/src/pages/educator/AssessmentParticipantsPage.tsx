import * as React from 'react';
import { useParams } from 'react-router';
import { Download, Loader2, Users } from 'lucide-react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { useParticipants } from '@/features/assessments/queries';
import { Participant } from '@/features/assessments/assessment.api';

export function AssessmentParticipantsPage() {
    const { assessmentId } = useParams();
    const { data: participants, isLoading, error } = useParticipants(assessmentId || '');
    const [search, setSearch] = React.useState('');

    const filtered = (participants || []).filter(
        (p) =>
            p.studentName.toLowerCase().includes(search.toLowerCase()) ||
            p.studentId.toLowerCase().includes(search.toLowerCase()) ||
            p.studentEmail.toLowerCase().includes(search.toLowerCase())
    );

    const formatTimestamp = (dateStr: string | null) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;

        const today = new Date().toDateString();
        const dateDay = date.toDateString();
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        if (today === dateDay) return `Today, ${time}`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + time;
    };

    const columns: Column<Participant>[] = [
        {
            header: 'Student Name',
            cell: (p) => (
                <div>
                    <p className="font-semibold text-slate-900">{p.studentName}</p>
                    <p className="text-[11px] text-slate-400">{p.studentEmail}</p>
                </div>
            ),
        },
        {
            header: 'Student ID',
            cell: (p) => <span className="font-mono text-xs text-slate-600">{p.studentId}</span>,
        },
        {
            header: 'Status',
            cell: (p) => <StatusBadge status={p.status} />,
        },
        {
            header: 'Activity',
            cell: (p) => (
                <span className="text-xs text-slate-500">
                    {p.status === 'SUBMITTED'
                        ? `Submitted ${formatTimestamp(p.submittedAt)}`
                        : `Started ${formatTimestamp(p.startedAt)}`}
                </span>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 space-y-2">
                <p className="text-sm text-slate-500">Failed to load participants</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search participant by name or ID..."
                    className="w-full sm:w-80"
                />

                <Button variant="outline" size="sm" className="text-xs border-slate-200 text-slate-700 gap-1.5 self-start sm:self-auto" disabled>
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Roster CSV</span>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                keyExtractor={(p) => p.id}
                emptyTitle="No participants yet"
                emptyDescription={filtered.length === 0 && !search
                    ? "No students have started this assessment yet."
                    : "No students match your filter."}
            />
        </div>
    );
}
