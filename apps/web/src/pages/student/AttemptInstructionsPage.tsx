import * as React from 'react';
import { useParams, useNavigate } from 'react-router';
import { Clock, AlertCircle, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AttemptInstructionsPage() {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const [acknowledged, setAcknowledged] = React.useState(false);

    return (
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 space-y-6">
            <div className="text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mx-auto">
                    <Shield className="w-5 h-5 text-emerald-700" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Exam Instructions & Readiness
                </h1>
                <p className="text-xs text-slate-500">
                    Please read the following guidelines carefully before starting your attempt.
                </p>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Clock className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                    <div>
                        <strong className="text-slate-900">Strict 45-Minute Timer:</strong> Once you click Start, the clock begins and cannot be paused.
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                    <div>
                        <strong className="text-slate-900">Continuous Auto-Save:</strong> Each answer you select is saved instantly to the Treevia server.
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                    <div>
                        <strong className="text-slate-900">Single Submission:</strong> You can review and change your answers anytime before final submission.
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600"
                    />
                    <span>I understand and agree to follow all academic integrity guidelines.</span>
                </label>
            </div>

            <Button
                disabled={!acknowledged}
                onClick={() => navigate(`/attempt/${attemptId}`)}
                className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs gap-2 transition-all"
            >
                <span>Start Assessment</span>
                <ArrowRight className="w-4 h-4" />
            </Button>
        </div>
    );
}
