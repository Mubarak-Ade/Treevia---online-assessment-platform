import { useParams, Link } from 'react-router';
import { CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AttemptSubmittedPage() {
    const { attemptId } = useParams();

    return (
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Assessment Submitted!
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Your responses have been securely transmitted and recorded in the Treevia evaluation ledger.
                </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                    <span className="text-slate-400">Attempt ID:</span>
                    <span className="font-mono font-semibold text-slate-800">{attemptId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Submission Timestamp:</span>
                    <span className="font-semibold text-slate-800">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Grading Status:</span>
                    <span className="font-semibold text-emerald-700">Completed Automatically</span>
                </div>
            </div>

            <div className="pt-2">
                <Link to={`/attempt/${attemptId}/result`}>
                    <Button className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs gap-2 transition-all">
                        <span>View Result Breakdown</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
