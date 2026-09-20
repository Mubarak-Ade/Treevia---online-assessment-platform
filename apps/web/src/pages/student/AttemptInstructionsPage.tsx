import * as React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { TreeviaLogo } from '@/components/shared/TreeviaLogo';
import { Button } from '@/components/ui/button';
import { assessmentApi, type AssessmentLookup } from '@/features/assessments/assessment.api';
import { Loader2, Clock, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export function AttemptInstructionsPage() {
    const { joinCode = '', attemptId: urlAttemptId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [acknowledged, setAcknowledged] = React.useState(false);

    const attemptId = urlAttemptId || (location.state as any)?.attemptId;

    const [assessment, setAssessment] = React.useState<AssessmentLookup | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!joinCode) {
            setError('No join code provided');
            setLoading(false);
            return;
        }

        assessmentApi.lookupByJoinCode(joinCode)
            .then((data) => {
                setAssessment(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load assessment details');
                setLoading(false);
            });
    }, [joinCode]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
                <div className="flex justify-center mb-8">
                    <TreeviaLogo size="lg" />
                </div>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (error || !assessment || !attemptId) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-lg space-y-6">
                    <div className="flex justify-center mb-4">
                        <TreeviaLogo size="lg" />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-2xl bg-red-100/70 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            Something went wrong
                        </h1>
                        <p className="text-sm text-slate-500">{error || 'Could not load assessment details.'}</p>
                        <Button variant="outline" onClick={() => navigate('/join')} className="w-full">
                            Back to Join
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-lg space-y-8">
                <div className="flex justify-center">
                    <TreeviaLogo size="lg" />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 text-center mb-1">
                        {assessment.title}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 text-center mb-6">Instructions</p>

                    <p className="text-sm text-slate-600 text-center mb-6">
                        Please read the following instructions carefully before starting.
                    </p>

                    <div className="space-y-3 mb-6">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                            <Clock className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-700">
                                You have <strong>{assessment.durationMinutes} minutes</strong> to complete this assessment.
                            </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                            <FileText className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-700">
                                There are <strong>{assessment.questionCount} questions</strong> worth <strong>{assessment.totalPoints} points</strong> total.
                            </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-700">
                                Your answers are saved automatically as you go.
                            </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-700">
                                Once the time expires, your attempt will be submitted automatically.
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={acknowledged}
                                onChange={(e) => setAcknowledged(e.target.checked)}
                                className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600"
                            />
                            <span>I have read and understand the instructions.</span>
                        </label>
                    </div>

                    <Button
                        disabled={!acknowledged}
                        onClick={() => navigate(`/attempt/${attemptId}`)}
                        className="w-full h-12 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs gap-2 transition-all"
                    >
                        <span>Start Assessment</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
