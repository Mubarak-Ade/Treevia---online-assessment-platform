import * as React from 'react';
import { useParams } from 'react-router';
import {
    BarChart3,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Sliders,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AssessmentAnalyticsPage() {
    const { assessmentId } = useParams();

    // Score distribution buckets
    const distribution = [
        { range: '0–50%', count: 4, pct: 3.6 },
        { range: '51–65%', count: 12, pct: 10.9 },
        { range: '66–75%', count: 28, pct: 25.4 },
        { range: '76–85%', count: 42, pct: 38.2 },
        { range: '86–100%', count: 24, pct: 21.8 },
    ];

    const questionPerformance = [
        {
            qNum: 'Q1',
            type: 'MCQ',
            correctRate: 92,
            discriminationIndex: 0.44,
            flag: 'Optimal',
        },
        {
            qNum: 'Q2',
            type: 'True/False',
            correctRate: 88,
            discriminationIndex: 0.38,
            flag: 'Optimal',
        },
        {
            qNum: 'Q3',
            type: 'MCQ',
            correctRate: 41,
            discriminationIndex: 0.18,
            flag: 'Needs Review',
        },
        {
            qNum: 'Q4',
            type: 'MCQ',
            correctRate: 78,
            discriminationIndex: 0.52,
            flag: 'High Discrimination',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Score Distribution Chart Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-7 bg-white border-slate-200/80 shadow-2xs">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Score Distribution
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Distribution across 110 submitted student attempts
                                </p>
                            </div>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 text-xs">
                                Normal Bell Curve
                            </Badge>
                        </div>

                        {/* Bar Distribution Graphic */}
                        <div className="space-y-3 pt-2">
                            {distribution.map((bucket) => (
                                <div key={bucket.range} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                                        <span>{bucket.range}</span>
                                        <span>{bucket.count} students ({bucket.pct}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                        <div
                                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${bucket.pct * 2.2}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Question Diagnostics Callout */}
                <Card className="lg:col-span-5 bg-white border-slate-200/80 shadow-2xs">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-base font-bold text-slate-900">
                            Key Psychometric Insights
                        </h3>

                        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-xs font-bold text-amber-900">
                                    Question 3 Needs Revision
                                </h4>
                                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                                    Only 41% accuracy. Many high-scoring students selected distractor (C), indicating potential ambiguity.
                                </p>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-xs font-bold text-emerald-900">
                                    Question 4 Highly Discriminative
                                </h4>
                                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                                    Discrimination index of 0.52 clearly distinguishes top performers from cohort baseline.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Item Analysis Breakdown Table */}
            <Card className="bg-white border-slate-200/80 shadow-2xs">
                <CardContent className="p-6">
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                        Item Analysis & Question Difficulty
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                        Granular breakdown of cohort performance per question
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="py-2.5 px-3">Question</th>
                                    <th className="py-2.5 px-3">Type</th>
                                    <th className="py-2.5 px-3">Accuracy Rate</th>
                                    <th className="py-2.5 px-3">Discrimination Index</th>
                                    <th className="py-2.5 px-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {questionPerformance.map((q) => (
                                    <tr key={q.qNum} className="hover:bg-slate-50/50">
                                        <td className="py-3 px-3 font-bold text-slate-900">{q.qNum}</td>
                                        <td className="py-3 px-3">{q.type}</td>
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{q.correctRate}%</span>
                                                <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className={q.correctRate < 50 ? 'bg-amber-500 h-full' : 'bg-emerald-600 h-full'}
                                                        style={{ width: `${q.correctRate}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 font-mono">{q.discriminationIndex}</td>
                                        <td className="py-3 px-3">
                                            <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    q.flag === 'Needs Review'
                                                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                                }`}
                                            >
                                                {q.flag}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
