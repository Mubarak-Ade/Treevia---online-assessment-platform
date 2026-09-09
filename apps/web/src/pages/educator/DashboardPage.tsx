import * as React from 'react';
import { Link } from 'react-router';
import {
    FileText,
    Users,
    CheckCircle,
    TrendingUp,
    Plus,
    ArrowRight,
    Search,
    Clock,
    MoreVertical,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function DashboardPage() {
    const recentAssessments = [
        {
            id: 'db-systems',
            title: 'Database Systems Midterm',
            code: 'CS301',
            status: 'PUBLISHED',
            questions: 20,
            participants: 120,
            avgScore: '74%',
            duration: '45 mins',
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
            date: 'Aug 15, 2026',
        },
    ];

    return (
        <div className="space-y-8">
            <PageHeader
                title="Educator Dashboard"
                description="Welcome back, Dr. Jane Doe. Monitor active assessments and learner performance at a glance."
                actions={
                    <Link to="/assessments/new/builder">
                        <Button className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 shadow-xs">
                            <Plus className="w-4 h-4" />
                            <span>Create Assessment</span>
                        </Button>
                    </Link>
                }
            />

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Assessments"
                    value="12"
                    subtext="3 active in current semester"
                    trend={{ value: "+2 this month", positive: true }}
                    icon={<FileText className="w-4 h-4" />}
                />
                <MetricCard
                    title="Active Participants"
                    value="299"
                    subtext="Enrolled across 4 courses"
                    trend={{ value: "+18% vs last term", positive: true }}
                    icon={<Users className="w-4 h-4" />}
                />
                <MetricCard
                    title="Completion Rate"
                    value="92%"
                    subtext="Average submission on time"
                    trend={{ value: "+2.4%", positive: true }}
                    icon={<CheckCircle className="w-4 h-4" />}
                />
                <MetricCard
                    title="Avg. Cohort Score"
                    value="76.5%"
                    subtext="Across graded assessments"
                    trend={{ value: "+4.1%", positive: true }}
                    icon={<TrendingUp className="w-4 h-4" />}
                />
            </div>

            {/* Recent Assessments Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                            Recent Assessments
                        </h2>
                        <p className="text-xs text-slate-500">
                            Quick access to your active and draft evaluations
                        </p>
                    </div>
                    <Link
                        to="/assessments"
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                        <span>View All Assessments</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentAssessments.map((item) => (
                        <Card
                            key={item.id}
                            className="bg-white border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all"
                        >
                            <CardContent className="p-5 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                {item.code}
                                            </span>
                                            <StatusBadge status={item.status} />
                                        </div>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            {item.date}
                                        </span>
                                    </div>

                                    <h3 className="mt-3 text-base font-bold text-slate-900">
                                        {item.title}
                                    </h3>

                                    <div className="mt-4 grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-slate-50 text-xs border border-slate-100">
                                        <div>
                                            <p className="text-[10px] text-slate-400">Questions</p>
                                            <p className="font-semibold text-slate-800">{item.questions}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400">Participants</p>
                                            <p className="font-semibold text-slate-800">{item.participants}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400">Avg. Score</p>
                                            <p className="font-semibold text-emerald-700">{item.avgScore}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{item.duration}</span>
                                    </span>
                                    <Link to={`/assessments/${item.id}`}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs font-semibold text-slate-700 hover:text-emerald-800 border-slate-200 gap-1"
                                        >
                                            <span>Manage Workspace</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
