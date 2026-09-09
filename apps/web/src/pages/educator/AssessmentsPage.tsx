import * as React from 'react';
import { Link } from 'react-router';
import {
    Plus,
    Filter,
    Clock,
    Users,
    ChevronRight,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AssessmentsPage() {
    const [search, setSearch] = React.useState('');
    const [selectedStatus, setSelectedStatus] = React.useState('ALL');

    const allAssessments = [
        {
            id: 'db-systems',
            title: 'Database Systems Midterm',
            code: 'CS301',
            status: 'PUBLISHED',
            questions: 20,
            participants: 120,
            avgScore: '74%',
            duration: '45 mins',
            joinCode: 'DBX-4821',
            date: 'Aug 31, 2026',
        },
        {
            id: 'web-arch',
            title: 'Modern Web Architectures Quiz',
            code: 'CS415',
            status: 'PUBLISHED',
            questions: 15,
            participants: 84,
            avgScore: '82%',
            duration: '30 mins',
            joinCode: 'WEB-9912',
            date: 'Sep 2, 2026',
        },
        {
            id: 'alg-structures',
            title: 'Algorithms & Data Structures Final',
            code: 'CS202',
            status: 'DRAFT',
            questions: 25,
            participants: 0,
            avgScore: '—',
            duration: '60 mins',
            joinCode: 'ALG-1029',
            date: 'Draft',
        },
        {
            id: 'os-concurrency',
            title: 'Operating Systems & Concurrency',
            code: 'CS320',
            status: 'CLOSED',
            questions: 18,
            participants: 95,
            avgScore: '68%',
            duration: '50 mins',
            joinCode: 'OSC-7741',
            date: 'Aug 15, 2026',
        },
        {
            id: 'comp-networks',
            title: 'Computer Networking Basics',
            code: 'CS210',
            status: 'PUBLISHED',
            questions: 12,
            participants: 60,
            avgScore: '88%',
            duration: '25 mins',
            joinCode: 'NET-4401',
            date: 'Sep 5, 2026',
        },
    ];

    const filtered = allAssessments.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.code.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            selectedStatus === 'ALL' || item.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const statusOptions = [
        { label: 'All', value: 'ALL' },
        { label: 'Published', value: 'PUBLISHED' },
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Closed', value: 'CLOSED' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Assessments"
                description="Manage, author, and deploy quizzes and tests for your university cohorts."
                actions={
                    <Link to="/assessments/new/builder">
                        <Button className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 shadow-xs">
                            <Plus className="w-4 h-4" />
                            <span>Create Assessment</span>
                        </Button>
                    </Link>
                }
            />

            {/* Controls Row: Search & Status Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by title or course code..."
                    className="w-full sm:w-80"
                />

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {statusOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setSelectedStatus(opt.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                selectedStatus === opt.value
                                    ? 'bg-emerald-800 text-white shadow-xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Assessments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => (
                    <Card
                        key={item.id}
                        className="bg-white border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                        <CardContent className="p-5 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        {item.code}
                                    </span>
                                    <StatusBadge status={item.status} />
                                </div>

                                <h3 className="mt-3 text-base font-bold text-slate-900 line-clamp-1">
                                    {item.title}
                                </h3>

                                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 py-2 border-y border-slate-100">
                                    <span>{item.questions} questions</span>
                                    <span>{item.participants} participants</span>
                                    <span className="font-semibold text-emerald-700">{item.avgScore}</span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between pt-2">
                                <div className="text-[11px] font-mono text-slate-500">
                                    CODE: <span className="font-bold text-slate-800">{item.joinCode}</span>
                                </div>
                                <Link to={`/assessments/${item.id}`}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs font-semibold border-slate-200 text-slate-700 hover:text-emerald-800 gap-1"
                                    >
                                        <span>Open</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
