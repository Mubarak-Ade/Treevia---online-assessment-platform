import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function HomeHeroSection() {
    return (
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Heading, description, CTA */}
                    <div className="lg:col-span-6 space-y-6 text-left">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                            Assessment management, <br />
                            <span className="text-slate-900">without the complexity.</span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                            Create assessments, run them with confidence, and understand learner performance from one workspace.
                        </p>

                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                            <Link to="/assessments/new/builder" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto h-12 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-sm gap-2"
                                >
                                    <span>Create an Assessment</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link to="/dashboard" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto h-12 px-6 bg-white hover:bg-slate-50 text-slate-800 border-slate-300 font-medium rounded-lg shadow-xs"
                                >
                                    See How It Works
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Hero Laptop Mockup */}
                    <div className="lg:col-span-6 flex justify-center">
                        <div className="relative w-full max-w-xl">
                            {/* Sleek Laptop Device Shell Mockup */}
                            <div className="relative mx-auto border-slate-700 bg-slate-800 border-[8px] rounded-t-2xl h-[280px] sm:h-[340px] max-w-[500px] shadow-2xl overflow-hidden">
                                {/* Mock Screen Display */}
                                <div className="w-full h-full bg-slate-50 p-3 overflow-hidden text-left flex flex-col">
                                    {/* Mock App Header */}
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-4 rounded bg-emerald-700"></div>
                                            <span className="text-xs font-bold text-slate-900">Treevia</span>
                                            <span className="text-[10px] text-slate-400 ml-2">Assessment Overview</span>
                                        </div>
                                        <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                                    </div>

                                    {/* Metrics Row */}
                                    <div className="grid grid-cols-4 gap-2 my-2.5">
                                        <div className="bg-white p-2 rounded border border-slate-200">
                                            <p className="text-[8px] text-slate-400">Total Assessments</p>
                                            <p className="text-xs font-bold text-slate-900">89 <span className="text-[8px] text-emerald-600">+12%</span></p>
                                        </div>
                                        <div className="bg-white p-2 rounded border border-slate-200">
                                            <p className="text-[8px] text-slate-400">Active Participants</p>
                                            <p className="text-xs font-bold text-slate-900">15 <span className="text-[8px] text-emerald-600">+4%</span></p>
                                        </div>
                                        <div className="bg-white p-2 rounded border border-slate-200">
                                            <p className="text-[8px] text-slate-400">Completion Rate</p>
                                            <p className="text-xs font-bold text-slate-900">92% <span className="text-[8px] text-slate-500">0%</span></p>
                                        </div>
                                        <div className="bg-white p-2 rounded border border-slate-200">
                                            <p className="text-[8px] text-slate-400">Avg Score</p>
                                            <p className="text-xs font-bold text-emerald-700">8.6/10</p>
                                        </div>
                                    </div>

                                    {/* Charts Preview */}
                                    <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
                                        <div className="col-span-2 bg-white p-2 rounded border border-slate-200 flex flex-col justify-between">
                                            <p className="text-[9px] font-semibold text-slate-700">Assessment Performance (Last 30 Days)</p>
                                            <div className="h-16 flex items-end justify-between gap-1 pt-2">
                                                {[40, 55, 60, 80, 75, 90, 85, 95].map((h, i) => (
                                                    <div key={i} className="w-full bg-emerald-100 rounded-t flex flex-col justify-end" style={{ height: `${h}%` }}>
                                                        <div className="w-full bg-emerald-600 rounded-t" style={{ height: '50%' }}></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-white p-2 rounded border border-slate-200 flex flex-col justify-center items-center">
                                            <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-emerald-300"></div>
                                            <span className="text-[8px] text-slate-500 mt-1">Status Distribution</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Laptop Base */}
                            <div className="relative mx-auto bg-slate-700 rounded-b-xl h-[14px] max-w-[560px]">
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[4px] w-[50px] bg-slate-500 rounded-b"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
