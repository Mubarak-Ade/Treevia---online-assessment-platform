import * as React from 'react';
import { useParams, useNavigate } from 'react-router';
import { TreeviaLogo } from '@/components/shared/TreeviaLogo';
import { Button } from '@/components/ui/button';
import { assessmentApi, type AssessmentLookup } from '@/features/assessments/assessment.api';
import { Loader2, AlertCircle, Clock, FileText, Hash } from 'lucide-react';

export function ConfirmAssessmentPage() {
    const { joinCode = '' } = useParams();
    const navigate = useNavigate();

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
            .catch((err) => {
                const message = err.response?.data?.error?.message || 'Assessment not found or not available';
                setError(message);
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

    if (error || !assessment) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex justify-center mb-4">
                        <TreeviaLogo size="lg" />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-2xl bg-red-100/70 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            Assessment Not Found
                        </h1>
                        <p className="text-sm text-slate-500">
                            {error || 'The assessment you are looking for does not exist or is no longer available.'}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/join')}
                            className="w-full"
                        >
                            Try Another Code
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex justify-center">
                    <TreeviaLogo size="lg" />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 text-center mb-2">
                        {assessment.title}
                    </h1>
                    {assessment.description && (
                        <p className="text-sm text-slate-500 text-center mb-6">{assessment.description}</p>
                    )}

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <FileText className="w-4.5 h-4.5 text-emerald-700" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Questions</p>
                                <p className="text-sm font-semibold text-slate-900">{assessment.questionCount}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <Clock className="w-4.5 h-4.5 text-emerald-700" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Duration</p>
                                <p className="text-sm font-semibold text-slate-900">{assessment.durationMinutes} minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <Hash className="w-4.5 h-4.5 text-emerald-700" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Total Points</p>
                                <p className="text-sm font-semibold text-slate-900">{assessment.totalPoints}</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={() => navigate(`/join/${joinCode}/details`)}
                        className="w-full h-12 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs transition-all"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}
