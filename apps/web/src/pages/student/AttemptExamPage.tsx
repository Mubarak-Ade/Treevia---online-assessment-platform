import * as React from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Send,
    AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface QuestionItem {
    id: string;
    number: number;
    text: string;
    options: { id: string; text: string }[];
}

export function AttemptExamPage() {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const questions: QuestionItem[] = [
        {
            id: 'q1',
            number: 1,
            text: 'Which normal form eliminates partial dependencies on a composite candidate key?',
            options: [
                { id: 'o1', text: 'First Normal Form (1NF)' },
                { id: 'o2', text: 'Second Normal Form (2NF)' },
                { id: 'o3', text: 'Third Normal Form (3NF)' },
                { id: 'o4', text: 'Boyce-Codd Normal Form (BCNF)' },
            ],
        },
        {
            id: 'q2',
            number: 2,
            text: 'An index always speeds up INSERT and UPDATE operations in a relational database table.',
            options: [
                { id: 'o1', text: 'True' },
                { id: 'o2', text: 'False' },
            ],
        },
        {
            id: 'q3',
            number: 3,
            text: 'What does the ACID acronym stand for in relational database transactions?',
            options: [
                { id: 'o1', text: 'Atomicity, Consistency, Isolation, Durability' },
                { id: 'o2', text: 'Accuracy, Concurrency, Integrity, Durability' },
                { id: 'o3', text: 'Atomicity, Compatibility, Isolation, Distribution' },
                { id: 'o4', text: 'Availability, Consistency, Isolation, Durability' },
            ],
        },
    ];

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [answers, setAnswers] = React.useState<Record<string, string>>({});
    const [secondsLeft, setSecondsLeft] = React.useState(44 * 60 + 15);
    const [submitModalOpen, setSubmitModalOpen] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);

    // Countdown effect
    React.useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentIndex];

    const handleSelectOption = (optId: string) => {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optId }));
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 300);
    };

    const answeredCount = Object.keys(answers).length;

    const handleConfirmSubmit = () => {
        setSubmitModalOpen(false);
        navigate(`/attempt/${attemptId}/submitted`);
    };

    return (
        <div className="w-full max-w-3xl space-y-6">
            {/* Exam Header: Question Progress & Countdown Timer */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex items-center justify-between">
                <div>
                    <span className="text-xs font-semibold text-slate-500 block">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                        {answeredCount} of {questions.length} Answered
                    </span>
                </div>

                {/* Auto-Save & Timer Capsule */}
                <div className="flex items-center gap-4">
                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                        {isSaving ? 'Saving...' : 'Saved to Cloud'}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-sm font-bold">
                        <Clock className="w-4 h-4 text-emerald-700" />
                        <span>{formatTime(secondsLeft)}</span>
                    </div>
                </div>
            </div>

            {/* Question Interaction Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {currentQuestion.text}
                </h2>

                <div className="space-y-3">
                    {currentQuestion.options.map((opt) => {
                        const isSelected = answers[currentQuestion.id] === opt.id;
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleSelectOption(opt.id)}
                                className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center gap-3.5 ${
                                    isSelected
                                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold shadow-2xs'
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                                        isSelected
                                            ? 'border-emerald-700 bg-emerald-700 text-white'
                                            : 'border-slate-300'
                                    }`}
                                >
                                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <span>{opt.text}</span>
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
                    {currentIndex < questions.length - 1 ? (
                        <Button
                            onClick={() => setCurrentIndex((prev) => prev + 1)}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white gap-1 text-xs font-semibold shadow-xs"
                        >
                            <span>Next Question</span>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setSubmitModalOpen(true)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 text-xs font-semibold shadow-xs"
                        >
                            <span>Submit Assessment</span>
                            <Send className="w-3.5 h-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={submitModalOpen}
                onOpenChange={setSubmitModalOpen}
                title="Ready to submit your assessment?"
                description={`You have answered ${answeredCount} of ${questions.length} questions. Once submitted, you cannot change your answers.`}
                confirmLabel="Confirm Submission"
                onConfirm={handleConfirmSubmit}
            />
        </div>
    );
}
