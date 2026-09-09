import * as React from 'react';
import { useParams } from 'react-router';
import { Download, Search, Filter } from 'lucide-react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

interface Participant {
    id: string;
    name: string;
    studentId: string;
    email: string;
    status: 'SUBMITTED' | 'IN_PROGRESS';
    score: string;
    submittedAt: string;
}

export function AssessmentParticipantsPage() {
    const { assessmentId } = useParams();
    const [search, setSearch] = React.useState('');

    const participants: Participant[] = [
        {
            id: 'p1',
            name: 'Alex Rivera',
            studentId: 'ST-9021',
            email: 'arivera@student.edu',
            status: 'SUBMITTED',
            score: '28 / 30 (93%)',
            submittedAt: 'Today, 10:42 AM',
        },
        {
            id: 'p2',
            name: 'Fatima Al-Mansoor',
            studentId: 'ST-9044',
            email: 'falmansoor@student.edu',
            status: 'SUBMITTED',
            score: '30 / 30 (100%)',
            submittedAt: 'Today, 11:05 AM',
        },
        {
            id: 'p3',
            name: 'Chen Wei',
            studentId: 'ST-8871',
            email: 'cwei@student.edu',
            status: 'IN_PROGRESS',
            score: '—',
            submittedAt: 'Started 22 mins ago',
        },
        {
            id: 'p4',
            name: 'Elena Rostova',
            studentId: 'ST-9102',
            email: 'erostova@student.edu',
            status: 'SUBMITTED',
            score: '24 / 30 (80%)',
            submittedAt: 'Today, 11:15 AM',
        },
        {
            id: 'p5',
            name: 'Kwame Mensah',
            studentId: 'ST-8993',
            email: 'kmensah@student.edu',
            status: 'SUBMITTED',
            score: '21 / 30 (70%)',
            submittedAt: 'Today, 11:20 AM',
        },
    ];

    const filtered = participants.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.studentId.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase())
    );

    const columns: Column<Participant>[] = [
        {
            header: 'Student Name',
            cell: (p) => (
                <div>
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-400">{p.email}</p>
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
            header: 'Score',
            cell: (p) => (
                <span className={p.status === 'SUBMITTED' ? 'font-bold text-emerald-800' : 'text-slate-400'}>
                    {p.score}
                </span>
            ),
        },
        {
            header: 'Activity / Timestamp',
            cell: (p) => <span className="text-xs text-slate-500">{p.submittedAt}</span>,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search participant by name or ID..."
                    className="w-full sm:w-80"
                />

                <Button variant="outline" size="sm" className="text-xs border-slate-200 text-slate-700 gap-1.5 self-start sm:self-auto">
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Roster CSV</span>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                keyExtractor={(p) => p.id}
                emptyTitle="No participants found"
                emptyDescription="No student matches your filter or no attempts have begun yet."
            />
        </div>
    );
}
