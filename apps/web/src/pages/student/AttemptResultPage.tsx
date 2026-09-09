import { useParams, Link } from 'react-router';
import { Award, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AttemptResultPage() {
    const { attemptId } = useParams();

    return (
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 space-y-6">
            <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                    <Award className="w-6 h-6 text-emerald-700" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Your Results
                </h1>
                <p className="text-xs text-slate-500">
                    Database Systems Midterm (CS301)
                </p>
            </div>

            {/* Score Big Display */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-50 to-emerald-100/40 border border-emerald-200 text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Final Grade
                </span>
                <div className="text-5xl font-extrabold text-emerald-900">
                    93%
                </div>
                <p className="text-xs font-semibold text-emerald-700">
                    28 out of 30 Points Awarded
                </p>
            </div>

            {/* Breakdown checklist */}
            <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">Correct Answers</span>
                    <span className="font-bold text-emerald-700">19 / 20</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">Time Expended</span>
                    <span className="text-slate-600 font-medium">32 minutes 15 seconds</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">Percentile Rank</span>
                    <span className="font-bold text-emerald-700">Top 10% of Cohort</span>
                </div>
            </div>

            <div className="pt-2">
                <Link to="/join">
                    <Button variant="outline" className="w-full border-slate-300 text-slate-700 text-xs">
                        Return to Portal
                    </Button>
                </Link>
            </div>
        </div>
    );
}
