import { Outlet, Link } from 'react-router';
import { ShieldCheck, GraduationCap } from 'lucide-react';

export function StudentLayout() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
            {/* Minimal Distraction-Free Header */}
            <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
                <Link to="/join" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
                        <GraduationCap className="w-4 h-4" />
                    </div>
                    <span className="font-bold tracking-tight text-slate-900 text-base">
                        Treevia
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 border-l border-slate-200 pl-2 ml-1">
                        Student Assessment
                    </span>
                </Link>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="hidden sm:inline">Encrypted Exam Environment</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                <Outlet />
            </main>

            <footer className="py-4 text-center text-xs text-slate-400">
                Treevia Academic Exam Engine · Session secured
            </footer>
        </div>
    );
}
