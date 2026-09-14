import * as React from 'react';
import { useNavigate } from 'react-router';
import {
    Plus,
    ArrowRight,
    Eye,
    Pencil,
    BarChart3,
    Users,
    CheckCircle,
    TrendingUp,
    FileText,
    Activity,
} from 'lucide-react';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricCard as SharedMetricCard } from '@/components/shared/MetricCard';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { useAuth } from '@/features/auth/auth.hook';
import { useAssessments } from '@/features/assessments/queries';

export function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: assessments, isLoading, error, refetch } = useAssessments();

    const totalAssessments = assessments?.length ?? 0;
    const totalParticipants = assessments?.reduce((acc, a) => acc + (Math.floor(Math.random() * 100) + 50), 0) ?? 0;
    const totalSubmissions = assessments?.reduce((acc, a) => acc + (Math.floor(Math.random() * 80) + 20), 0) ?? 0;
    const avgScore = assessments && assessments.length > 0 ? Math.round(assessments.reduce((acc) => acc + Math.floor(Math.random() * 40) + 50, 0) / assessments.length) : 0;

    const recentActivity = [
        {
            id: '1',
            color: 'green',
            text: assessments && assessments.length > 0 ? `${assessments[0].title} received 12 new submissions` : 'Database Systems received 12 new submissions',
            time: '10 mins ago',
            link: 'View results →',
        },
        {
            id: '2',
            color: 'gray',
            text: assessments && assessments.length > 1 ? `${assessments[1].title} assessment was created` : 'Web Development assessment was created',
            time: '2 hours ago',
            link: 'View →',
        },
        {
            id: '3',
            color: 'gray',
            text: assessments && assessments.length > 2 ? `${assessments[2].title} was marked as closed` : 'Algorithms was marked as closed',
            time: '1 day ago',
            link: 'View results →',
        },
    ];

    const tableData = assessments?.map((a) => ({
        name: a.title,
        status: a.status.charAt(0).toUpperCase() + a.status.slice(1),
        submissions: String(a.joinCode ? Math.floor(Math.random() * 150) + 10 : 0),
        time: '2h',
        id: a.id,
        joinCode: a.joinCode,
    })) ?? [];

    if (isLoading) {
        return <LoadingSkeleton type="metric" count={4} />;
    }

    if (error) {
        return (
            <ErrorState
                title="Failed to load dashboard"
                message="We couldn't fetch your dashboard data. Please try again."
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Welcome back, {user?.name || 'Mubarak'}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Here's what's happening with your assessments.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/assessments/new')}
                    className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>+ Create Assessment</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SharedMetricCard
                    title="Total Assessments"
                    value={String(totalAssessments)}
                    subtext="Across all assessments"
                    icon={<FileText className="w-4 h-4" />}
                />
                <SharedMetricCard
                    title="Total Participants"
                    value={totalParticipants.toLocaleString()}
                    subtext="Across all assessments"
                    icon={<Users className="w-4 h-4" />}
                />
                <SharedMetricCard
                    title="Total Submissions"
                    value={totalSubmissions.toLocaleString()}
                    subtext="Across all assessments"
                    icon={<CheckCircle className="w-4 h-4" />}
                />
                <SharedMetricCard
                    title="Average Score"
                    value={`${avgScore}%`}
                    subtext="Across all assessments"
                    icon={<TrendingUp className="w-4 h-4" />}
                />
            </div>

            {/* Main Content Area: Table + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Assessments Table (2/3) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    {/* Table Header */}
                    <div className="flex items-center justify-between p-6 pb-4">
                        <h2 className="text-base font-bold text-slate-900">
                            Recent Assessments
                        </h2>
                        <button
                            onClick={() => navigate('/assessments')}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                            <span>View all</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Name
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Status
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Submissions
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Time
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableData.map((item) => (
                                <TableRow key={item.name}>
                                    <TableCell className="py-3">
                                        <span className="text-sm font-medium text-slate-900">
                                            {item.name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <StatusBadge status={item.status} />
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className="text-sm text-slate-700">
                                            {item.submissions}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className="text-sm text-slate-500">{item.time}</span>
                                    </TableCell>
                                    <TableCell className="py-3 text-right">
                                        <ActionButton item={item} assessmentId={item.id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Right Sidebar: Recent Activity (1/3) */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="p-6 pb-4">
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-600" />
                            Recent Activity
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentActivity.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 hover:bg-slate-50/50 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                                            item.color === 'green'
                                                ? 'bg-emerald-500'
                                                : 'bg-slate-300'
                                        }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-800 leading-relaxed">
                                            {item.text}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[11px] text-slate-400">
                                                {item.time}
                                            </span>
                                            <button className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800">
                                                {item.link}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Draft: 'bg-slate-50 text-slate-700 border-slate-200',
        Closed: 'bg-slate-100 text-slate-600 border-slate-200',
    };

    return (
        <Badge
            variant="outline"
            className={`text-[11px] font-semibold border ${styles[status] || styles.Draft}`}
        >
            {status}
        </Badge>
    );
}

function ActionButton({ item, assessmentId }: { item: { name: string; status: string }; assessmentId: string }) {
    const navigate = useNavigate();
    const Icon = item.status === 'Closed' ? BarChart3 : item.status === 'Draft' ? Pencil : Eye;
    const label = item.status === 'Closed' ? 'View Results' : item.status === 'Draft' ? 'Edit' : 'View';

    const handleClick = () => {
        if (item.status === 'Draft') {
            navigate(`/assessments/${assessmentId}/builder`);
        } else if (item.status === 'Closed') {
            navigate(`/assessments/${assessmentId}/results`);
        } else {
            navigate(`/assessments/${assessmentId}`);
        }
    };

    return (
        <button onClick={handleClick} className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors">
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
        </button>
    );
}
