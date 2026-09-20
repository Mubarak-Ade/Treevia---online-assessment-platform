import * as React from 'react';
import { useParams, useNavigate } from 'react-router';
import { TreeviaLogo } from '@/components/shared/TreeviaLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { attemptApi } from '@/features/attempts/attempt.api';
import { assessmentApi, type AssessmentLookup } from '@/features/assessments/assessment.api';
import { Loader2, AlertCircle, ArrowRight, BookOpen, Clock, CheckCircle2 } from 'lucide-react';

export function ParticipantDetailsPage() {
    const { joinCode = '' } = useParams();
    const navigate = useNavigate();

    const [assessment, setAssessment] = React.useState<AssessmentLookup | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [name, setName] = React.useState('');
    const [studentId, setStudentId] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assessment || !name.trim() || !studentId.trim()) return;

        setSubmitting(true);
        setSubmitError(null);

        try {
            const attempt = await attemptApi.create({
                assessmentId: assessment.id,
                studentName: name.trim(),
                studentId: studentId.trim(),
                studentEmail: `${studentId.trim()}@student.local`,
            });
            localStorage.setItem(`attempt_token_${attempt.id}`, attempt.token);
            navigate(`/join/${joinCode}/instructions`, { state: { attemptId: attempt.id } });
        } catch (err: any) {
            const message = err.response?.data?.error?.message || 'Failed to start assessment. Please try again.';
            setSubmitError(message);
            setSubmitting(false);
        }
    };

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
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">Assessment Not Found</h1>
                        <p className="text-sm text-slate-500">{error}</p>
                        <Button variant="outline" onClick={() => navigate('/join')} className="w-full">
                            Try Another Code
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-5">
                {/* Assessment Info Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-base font-bold text-slate-900 leading-tight">
                                {assessment.title}
                            </h2>
                            {assessment.description && (
                                <p className="text-xs text-slate-500 mt-0.5 truncate">
                                    {assessment.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{assessment.questionCount} Questions</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{assessment.durationMinutes} Minutes</span>
                        </div>
                    </div>
                </div>

                {/* Student Info Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h1 className="text-lg font-bold text-slate-900 mb-1">
                        Student Information
                    </h1>
                    <p className="text-xs text-slate-500 mb-5">
                        Please enter your details exactly as they appear on your student ID card.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 block">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Jane Doe"
                                autoFocus
                                className="h-11 text-sm bg-white border-slate-200 focus-visible:border-emerald-700"
                                disabled={submitting}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 block">
                                Student ID
                            </label>
                            <Input
                                type="text"
                                required
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="e.g., 12345678"
                                className="h-11 text-sm bg-white border-slate-200 focus-visible:border-emerald-700"
                                disabled={submitting}
                            />
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Used to record your final grade.</span>
                        </div>

                        {submitError && (
                            <p className="text-sm text-red-600">{submitError}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={!name.trim() || !studentId.trim() || submitting}
                            className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs gap-2 transition-all"
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Continue to Instructions
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-[11px] text-slate-400">
                    Powered by Treevia Assessment
                </p>
            </div>
        </div>
    );
}
