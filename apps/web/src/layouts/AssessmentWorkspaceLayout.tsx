import * as React from 'react';
import { Outlet, useParams, NavLink, Link, useNavigate } from 'react-router';
import {
    LayoutDashboard,
    HelpCircle,
    Users,
    Award,
    BarChart2,
    Copy,
    Check,
    Edit3,
    Eye,
    ArrowLeft,
    Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function AssessmentWorkspaceLayout() {
    const { assessmentId = 'db-systems' } = useParams();
    const [copied, setCopied] = React.useState(false);
    const navigate = useNavigate();

    // Mock assessment context details
    const assessment = {
        id: assessmentId,
        title: 'Database Systems Midterm',
        code: 'CS301',
        joinCode: 'DBX-4821',
        status: 'PUBLISHED',
        questionsCount: 20,
        participantsCount: 120,
        durationMinutes: 45,
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(assessment.joinCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { label: 'Overview', href: `/assessments/${assessmentId}`, icon: LayoutDashboard, end: true },
        { label: `Questions (${assessment.questionsCount})`, href: `/assessments/${assessmentId}/questions`, icon: HelpCircle },
        { label: `Participants (${assessment.participantsCount})`, href: `/assessments/${assessmentId}/participants`, icon: Users },
        { label: 'Results', href: `/assessments/${assessmentId}/results`, icon: Award },
        { label: 'Analytics', href: `/assessments/${assessmentId}/analytics`, icon: BarChart2 },
    ];

    return (
        <div className="space-y-6">
            {/* Top Back Link & Context Bar */}
            <div className="flex items-center justify-between">
                <Link
                    to="/assessments"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Assessments</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/join/${assessment.joinCode}`, '_blank')}
                        className="text-xs border-slate-200 text-slate-700 gap-1.5"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview as Student</span>
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => navigate(`/assessments/${assessmentId}/builder`)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 shadow-xs"
                    >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Open Builder</span>
                    </Button>
                </div>
            </div>

            {/* Assessment Identity Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {assessment.code}
                            </span>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {assessment.title}
                            </h1>
                            <StatusBadge status={assessment.status} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Duration: <span className="font-semibold text-slate-700">{assessment.durationMinutes} mins</span> · Created August 31, 2026
                        </p>
                    </div>

                    {/* Join Code Capsule */}
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Access Code
                            </p>
                            <span className="font-mono text-sm font-bold text-emerald-700">
                                {assessment.joinCode}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={handleCopyCode}
                            className="text-slate-400 hover:text-slate-700 hover:bg-white"
                            title="Copy code"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                    </div>
                </div>

                {/* Workspace Tabs Navigation */}
                <div className="flex items-center gap-1 border-t border-slate-100 mt-6 pt-2 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <NavLink
                                key={tab.href}
                                to={tab.href}
                                end={tab.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        isActive
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-2xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`
                                }
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* Child Tab Views */}
            <div className="pt-1">
                <Outlet />
            </div>
        </div>
    );
}
