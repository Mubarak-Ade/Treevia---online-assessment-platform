import * as React from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Send,
    BookOpen,
    Loader2,
    AlertCircle,
    CloudOff,
    Cloud,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { TreeviaLogo } from '@/components/shared/TreeviaLogo';
import {
    useAttemptDetail,
    useAttemptQuestions,
    useAttemptAnswers,
    useSaveAnswer,
    useSubmitAttempt,
} from '@/features/attempts/queries';
import { attemptApi } from '@/features/attempts/attempt.api';
import type { AttemptQuestion } from '@/features/attempts/types';

type SaveStatus = 'saved' | 'saving' | 'error' | 'offline';

export function AttemptExamPage() {
    const { attemptId = '' } = useParams();
    const navigate = useNavigate();

    const { data: detail, isLoading: detailLoading, error: detailError } = useAttemptDetail(attemptId);
    const { data: questions = [], isLoading: questionsLoading } = useAttemptQuestions(attemptId);
    const { data: serverAnswers = {}, isLoading: answersLoading } = useAttemptAnswers(attemptId);

    const saveAnswerMutation = useSaveAnswer();
    const submitMutation = useSubmitAttempt();

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [answers, setAnswers] = React.useState<Record<string, string>>({});
    const [saveStatus, setSaveStatus] = React.useState<SaveStatus>('saved');
    const [secondsLeft, setSecondsLeft] = React.useState<number | null>(null);
    const [submitModalOpen, setSubmitModalOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const pendingSaveRef = React.useRef<Record<string, string>>({});
    const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const answersInFlightRef = React.useRef(false);

    const isLoading = detailLoading || questionsLoading || answersLoading;
    const hasError = detailError || (!detailLoading && !detail);

    React.useEffect(() => {
        if (detail && detail.status !== 'IN_PROGRESS') {
            navigate(`/attempt/${attemptId}/submitted`, { replace: true });
        }
    }, [detail, attemptId, navigate]);

    React.useEffect(() => {
        if (!answersLoading && Object.keys(serverAnswers).length > 0) {
            setAnswers((prev) => {
                const merged = { ...serverAnswers };
                for (const [qId, optId] of Object.entries(prev)) {
                    if (optId) merged[qId] = optId;
                }
                return merged;
            });
        }
    }, [serverAnswers, answersLoading]);

    React.useEffect(() => {
        if (detail && secondsLeft === null) {
            setSecondsLeft(Math.max(0, Math.floor(detail.timeRemainingMs / 1000)));
        }
    }, [detail, secondsLeft]);

    React.useEffect(() => {
        if (secondsLeft === null || secondsLeft <= 0) return;
        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev === null) return prev;
                const next = prev - 1;
                if (next <= 0) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return next;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [secondsLeft !== null]);

    const handleAutoSubmit = React.useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await attemptApi.submit(attemptId);
            localStorage.removeItem(`attempt_token_${attemptId}`);
            navigate(`/attempt/${attemptId}/submitted`, { replace: true });
        } catch {
            setIsSubmitting(false);
        }
    }, [attemptId, navigate, isSubmitting]);

    React.useEffect(() => {
        if (secondsLeft === 0 && detail?.status === 'IN_PROGRESS') {
            handleAutoSubmit();
        }
    }, [secondsLeft, detail?.status, handleAutoSubmit]);

    const flushSave = React.useCallback(() => {
        const pending = pendingSaveRef.current;
        const entries = Object.entries(pending);
        if (entries.length === 0) return;

        pendingSaveRef.current = {};
        answersInFlightRef.current = true;
        setSaveStatus('saving');

        const payloads = entries.map(([questionId, selectedOptionId]) => ({
            questionId,
            selectedOptionId,
        }));

        attemptApi
            .bulkSaveAnswers(attemptId, payloads)
            .then(() => {
                setSaveStatus('saved');
                answersInFlightRef.current = false;
            })
            .catch(() => {
                for (const [qId, optId] of entries) {
                    pendingSaveRef.current[qId] = optId;
                }
                setSaveStatus('error');
                answersInFlightRef.current = false;
            });
    }, [attemptId]);

    React.useEffect(() => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        const hasPending = Object.keys(pendingSaveRef.current).length > 0;
        if (hasPending) {
            debounceTimerRef.current = setTimeout(flushSave, 800);
        }
        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, [answers, flushSave]);

    React.useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (detail?.status !== 'IN_PROGRESS') return;
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [detail?.status]);

    React.useEffect(() => {
        return () => {
            flushSave();
        };
    }, [flushSave]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentIndex];
    const answeredCount = Object.keys(answers).filter((k) => answers[k]).length;
    const totalQuestions = questions.length;
    const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
    const isLastQuestion = currentIndex === totalQuestions - 1;

    const handleSelectOption = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
        pendingSaveRef.current[questionId] = optionId;
        setSaveStatus('saving');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            flushSave();
            await new Promise((r) => setTimeout(r, 300));
            await attemptApi.submit(attemptId);
            localStorage.removeItem(`attempt_token_${attemptId}`);
            setSubmitModalOpen(false);
            navigate(`/attempt/${attemptId}/submitted`, { replace: true });
        } catch {
            setIsSubmitting(false);
        }
    };

    const unansweredCount = totalQuestions - answeredCount;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
                <div className="flex justify-center mb-8">
                    <TreeviaLogo size="lg" />
                </div>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <p className="mt-4 text-sm text-slate-500">Loading assessment...</p>
            </div>
        );
    }

    if (hasError) {
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
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">Unable to Load Assessment</h1>
                        <p className="text-sm text-slate-500">
                            {detailError?.message || 'This assessment could not be loaded. It may have expired or the link is invalid.'}
                        </p>
                        <Button variant="outline" onClick={() => navigate('/join')} className="w-full">
                            Return to Join Page
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return null;

    const timerColor =
        secondsLeft !== null && secondsLeft <= 300
            ? 'bg-red-50 text-red-700 border-red-200'
            : secondsLeft !== null && secondsLeft <= 600
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200';

    const timerIconColor =
        secondsLeft !== null && secondsLeft <= 300
            ? 'text-red-600'
            : secondsLeft !== null && secondsLeft <= 600
            ? 'text-amber-600'
            : 'text-emerald-700';

    const saveStatusConfig: Record<SaveStatus, { icon: React.ReactNode; text: string; color: string }> = {
        saved: { icon: <Cloud className="w-3.5 h-3.5" />, text: 'Saved just now', color: 'text-slate-400' },
        saving: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, text: 'Saving...', color: 'text-amber-600' },
        error: { icon: <CloudOff className="w-3.5 h-3.5" />, text: 'Save failed', color: 'text-red-500' },
        offline: { icon: <CloudOff className="w-3.5 h-3.5" />, text: 'Offline', color: 'text-red-500' },
    };

    const currentSave = saveStatusConfig[saveStatus];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <BookOpen className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                        <span className="text-sm font-semibold text-slate-800 truncate">
                            {detail?.assessmentId ? 'Assessment' : 'Assessment'}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${currentSave.color}`}>
                            {currentSave.icon}
                            <span className="hidden sm:inline">{currentSave.text}</span>
                        </span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold ${timerColor}`}>
                        <Clock className={`w-4 h-4 ${timerIconColor}`} />
                        <span>{secondsLeft !== null ? formatTime(secondsLeft) : '--:--'}</span>
                    </div>
                </div>
                <Progress value={progressPercent} className="bg-emerald-100 [&>div]:bg-emerald-600" />
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {/* Question Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                            Question {currentQuestion.number}
                        </h2>
                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                            {currentIndex + 1} of {totalQuestions}
                        </span>
                    </div>

                    <p className="text-[15px] text-slate-800 font-medium leading-relaxed">
                        {currentQuestion.text}
                    </p>

                    <div className="space-y-3">
                        {currentQuestion.options.map((opt, optIdx) => {
                            const isSelected = answers[currentQuestion.id] === opt.id;
                            const letter = String.fromCharCode(65 + optIdx);
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                                    className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center gap-4 ${
                                        isSelected
                                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                                            isSelected
                                                ? 'bg-emerald-700 text-white'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}
                                    >
                                        {letter}
                                    </div>
                                    <span className="font-medium">{opt.text}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation Footer */}
                <div className="flex items-center justify-between pt-2">
                    <Button
                        variant="outline"
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                        className="border-slate-300 text-slate-700 gap-1 text-xs"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        {isLastQuestion ? (
                            <Button
                                onClick={() => setSubmitModalOpen(true)}
                                className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 text-xs font-semibold shadow-xs"
                            >
                                <span>Submit Assessment</span>
                                <Send className="w-3.5 h-3.5" />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setCurrentIndex((prev) => prev + 1)}
                                className="bg-emerald-800 hover:bg-emerald-900 text-white gap-1 text-xs font-semibold shadow-xs"
                            >
                                <span>Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Confirmation Dialog */}
            <ConfirmDialog
                open={submitModalOpen}
                onOpenChange={setSubmitModalOpen}
                title="Ready to submit your assessment?"
                description={
                    unansweredCount > 0
                        ? `You have ${answeredCount} of ${totalQuestions} questions answered. ${unansweredCount} question${unansweredCount > 1 ? 's' : ''} will be left blank. Once submitted, you cannot change your answers.`
                        : `You have answered all ${totalQuestions} questions. Once submitted, you cannot change your answers.`
                }
                confirmLabel={isSubmitting ? 'Submitting...' : 'Confirm Submission'}
                onConfirm={handleSubmit}
                isLoading={isSubmitting}
            />
        </div>
    );
}
