import * as React from 'react';
import { useParams, Link } from 'react-router';
import {
    Clock,
    Award,
    Users,
    HelpCircle,
    CheckCircle2,
    Calendar,
    Share2,
    Shield,
    ExternalLink,
} from 'lucide-react';
import { MetricCard } from '@/components/shared/MetricCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AssessmentOverviewPage() {
    const { assessmentId } = useParams();

    return (
        <div className="space-y-6">
            {/* 4 Metric Bento Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard
                    title="Questions"
                    value="20"
                    subtext="Total points: 30"
                    icon={<HelpCircle className="w-4 h-4" />}
                />
                <MetricCard
                    title="Participants"
                    value="120"
                    subtext="+5 joined today"
                    trend={{ value: "+4%", positive: true }}
                    icon={<Users className="w-4 h-4" />}
                />
                <MetricCard
                    title="Submissions"
                    value="110 / 120"
                    subtext="91% completion rate"
                    icon={<CheckCircle2 className="w-4 h-4" />}
                />
                <MetricCard
                    title="Avg. Score"
                    value="74%"
                    subtext="Highest: 96%"
                    trend={{ value: "+2.4%", positive: true }}
                    icon={<Award className="w-4 h-4" />}
                />
            </div>

            {/* Quick Assessment Details & Share Box */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <Card className="bg-white border-slate-200/80 shadow-2xs">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-base font-bold text-slate-900">
                                Assessment Configuration
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                    <Clock className="w-4 h-4 text-emerald-700 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-slate-800">Time Limit</p>
                                        <p className="text-slate-500 mt-0.5">45 minutes strict countdown</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                    <Shield className="w-4 h-4 text-emerald-700 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-slate-800">Security & Integrity</p>
                                        <p className="text-slate-500 mt-0.5">Attempt-scoped tokens & IP log</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                    <Calendar className="w-4 h-4 text-emerald-700 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-slate-800">Availability Window</p>
                                        <p className="text-slate-500 mt-0.5">Aug 31, 2026 — Sep 14, 2026</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                    <Award className="w-4 h-4 text-emerald-700 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-slate-800">Grading Policy</p>
                                        <p className="text-slate-500 mt-0.5">Auto-graded objective points</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Share Link Card */}
                <div className="space-y-4">
                    <Card className="bg-white border-slate-200/80 shadow-2xs">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Share2 className="w-4 h-4 text-emerald-700" />
                                <h3 className="text-sm font-bold text-slate-900">Student Access</h3>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Share the 6-character code or send students directly to the exam portal.
                            </p>

                            <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-center">
                                <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                                    Student Join Code
                                </p>
                                <p className="text-xl font-mono font-bold text-emerald-900 mt-0.5">
                                    DBX-4821
                                </p>
                            </div>

                            <Button
                                onClick={() => window.open('/join/DBX-4821', '_blank')}
                                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold gap-1.5 shadow-xs"
                            >
                                <span>Open Student View</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
