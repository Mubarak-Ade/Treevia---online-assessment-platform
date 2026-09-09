import * as React from 'react';
import { useParams } from 'react-router';
import { Download, Search, CheckCircle2, TrendingUp } from 'lucide-react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ResultRecord {
    id: string;
    studentName: string;
    studentId: string;
    rawScore: number;
    maxScore: number;
    percentage: number;
    timeTaken: string;
    grade: string;
}

export function AssessmentResultsPage() {
    const { assessmentId } = useParams();
    const [search, setSearch] = React.useState('');

    const results: ResultRecord[] = [
        {
            id: 'r1',
            studentName: 'Fatima Al-Mansoor',
            studentId: 'ST-9044',
            rawScore: 30,
            maxScore: 30,
            percentage: 100,
            timeTaken: '28 mins',
            grade: 'A+',
        },
        {
            id: 'r2',
            studentName: 'Alex Rivera',
            studentId: 'ST-9021',
            rawScore: 28,
            maxScore: 30,
            percentage: 93,
            timeTaken: '34 mins',
            grade: 'A',
        },
        {
            id: 'r3',
            studentName: 'Elena Rostova',
            studentId: 'ST-9102',
            rawScore: 24,
            maxScore: 30,
            percentage: 80,
            timeTaken: '41 mins',
            grade: 'B',
        },
        {
            id: 'r4',
            studentName: 'Kwame Mensah',
            studentId: 'ST-8993',
            rawScore: 21,
            maxScore: 30,
            percentage: 70,
            timeTaken: '44 mins',
            grade: 'C+',
        },
    ];

    const filtered = results.filter((r) =>
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.studentId.toLowerCase().includes(search.toLowerCase())
    );

    const columns: Column<ResultRecord>[] = [
        {
            header: 'Student',
            cell: (r) => (
                <div>
                    <p className="font-semibold text-slate-900">{r.studentName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{r.studentId}</p>
                </div>
            ),
        },
        {
            header: 'Points',
            cell: (r) => (
                <span className="font-medium text-slate-800">
                    {r.rawScore} / {r.maxScore}
                </span>
            ),
        },
        {
            header: 'Percentage',
            cell: (r) => (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-700">{r.percentage}%</span>
                    <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${r.percentage}%` }}
                        />
                    </div>
                </div>
            ),
        },
        {
            header: 'Duration',
            accessorKey: 'timeTaken',
        },
        {
            header: 'Letter Grade',
            cell: (r) => (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
                    {r.grade}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Quick Result Summary Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-white border-slate-200/80 shadow-2xs">
                    <CardContent className="p-4">
                        <span className="text-xs text-slate-500 font-medium">Class Median</span>
                        <p className="text-2xl font-bold text-slate-900 mt-1">82%</p>
                        <span className="text-[11px] text-slate-400">25 / 30 points</span>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200/80 shadow-2xs">
                    <CardContent className="p-4">
                        <span className="text-xs text-slate-500 font-medium">Highest Score</span>
                        <p className="text-2xl font-bold text-emerald-700 mt-1">100%</p>
                        <span className="text-[11px] text-slate-400">30 / 30 points</span>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200/80 shadow-2xs">
                    <CardContent className="p-4">
                        <span className="text-xs text-slate-500 font-medium">Pass Rate</span>
                        <p className="text-2xl font-bold text-slate-900 mt-1">94.5%</p>
                        <span className="text-[11px] text-emerald-600 font-medium">Above benchmark</span>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search results by student..."
                    className="w-full sm:w-80"
                />

                <Button variant="outline" size="sm" className="text-xs border-slate-200 text-slate-700 gap-1.5 self-start sm:self-auto">
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Gradebook CSV</span>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                keyExtractor={(r) => r.id}
                emptyTitle="No graded submissions"
                emptyDescription="No student has submitted this assessment yet."
            />
        </div>
    );
}
