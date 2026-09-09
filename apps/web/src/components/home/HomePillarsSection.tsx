import { Layers, ShieldCheck, BarChart3 } from 'lucide-react';

export function HomePillarsSection() {
    return (
        <section className="py-12 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pillar 1: Create */}
                    <div className="bg-white p-8 rounded-xl border border-slate-200/80 shadow-xs text-left">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Create
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            Build rich assessments with a powerful, intuitive editor. Support for multiple question types, rubrics, and media.
                        </p>
                    </div>

                    {/* Pillar 2: Run */}
                    <div className="bg-white p-8 rounded-xl border border-slate-200/80 shadow-xs text-left">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Run
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            Deploy assessments securely. Manage access, time limits, and invigilation options with ease.
                        </p>
                    </div>

                    {/* Pillar 3: Understand */}
                    <div className="bg-white p-8 rounded-xl border border-slate-200/80 shadow-xs text-left">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Understand
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            Gain actionable insights with real-time analytics. Identify knowledge gaps and track cohort performance.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
