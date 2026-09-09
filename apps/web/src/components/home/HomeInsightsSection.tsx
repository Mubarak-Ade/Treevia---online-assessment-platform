import { CheckCircle2 } from 'lucide-react';

export function HomeInsightsSection() {
    return (
        <section className="py-16 md:py-24 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Analytics Preview Card */}
                    <div className="lg:col-span-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            {/* Two stats cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs text-slate-500 font-medium">Average Score</span>
                                    <div className="mt-1 flex items-baseline gap-2">
                                        <span className="text-2xl sm:text-3xl font-bold text-slate-900">74%</span>
                                        <span className="text-xs font-semibold text-emerald-600">+2.4%</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs text-slate-500 font-medium">Completion Rate</span>
                                    <div className="mt-1 flex items-baseline gap-2">
                                        <span className="text-2xl sm:text-3xl font-bold text-slate-900">92%</span>
                                        <span className="text-xs font-semibold text-slate-400">0%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Graph graphic mockup */}
                            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                                <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                                    <span className="font-semibold text-slate-700">Assessment Performance (Last 6 Months)</span>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 text-[11px]"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> My Performance</span>
                                        <span className="flex items-center gap-1 text-[11px]"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Peer Average</span>
                                    </div>
                                </div>
                                <div className="h-36 relative flex items-end">
                                    {/* Wave SVG */}
                                    <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M0 80 Q 80 50, 160 65 T 320 30 T 400 35 L 400 120 L 0 120 Z" fill="url(#chartGrad)" />
                                        <path d="M0 80 Q 80 50, 160 65 T 320 30 T 400 35" fill="none" stroke="#10b981" strokeWidth="2.5" />
                                    </svg>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                                    <span>Oct</span>
                                    <span>Nov</span>
                                    <span>Dec</span>
                                    <span>Jan</span>
                                    <span>Feb</span>
                                    <span>Mar</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-6 space-y-6 text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                            Clear insights at a glance
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Stop wrestling with spreadsheets. Treevia automatically analyzes assessment data to give you a clear picture of learner performance. Spot trends, identify at-risk students, and validate question effectiveness instantly.
                        </p>

                        <ul className="space-y-3 text-sm text-slate-700 font-medium">
                            <li className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>Item analysis and discrimination index</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>Cohort comparison tools</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>Automated grading for objective questions</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
