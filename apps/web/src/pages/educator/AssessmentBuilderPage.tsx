import * as React from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft,
    Plus,
    Save,
    Trash2,
    Eye,
    Check,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/shared/FormField';
import {
    useQuestions,
    useCreateQuestion,
    useUpdateQuestion,
    useDeleteQuestion,
    useReorderQuestions,
} from '@/features/questions';
import type { Question, QuestionInput, QuestionUpdateInput } from '@/features/questions';

interface LocalOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface LocalQuestion {
    id: string;
    type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    prompt: string;
    points: number;
    options: LocalOption[];
}

export function AssessmentBuilderPage() {
    const { assessmentId } = useParams();
    const navigate = useNavigate();

    const { data: apiQuestions, isLoading, error } = useQuestions(assessmentId || '');
    const createQuestion = useCreateQuestion();
    const updateQuestion = useUpdateQuestion();
    const deleteQuestion = useDeleteQuestion();
    const reorderQuestions = useReorderQuestions();

    const [localQuestions, setLocalQuestions] = React.useState<LocalQuestion[]>([]);
    const [activeQuestionId, setActiveQuestionId] = React.useState<string>('');
    const [savedStatus, setSavedStatus] = React.useState<'saved' | 'saving' | 'error'>('saved');
    const [pendingChanges, setPendingChanges] = React.useState<Map<string, QuestionUpdateInput>>(new Map());
    const [pendingCreates, setPendingCreates] = React.useState<Map<string, QuestionInput>>(new Map());

    React.useEffect(() => {
        if (apiQuestions) {
            const mapped: LocalQuestion[] = apiQuestions.map((q) => ({
                id: q.id,
                type: q.questionType,
                prompt: q.questionText,
                points: q.points,
                options: [],
            }));
            setLocalQuestions(mapped);
            if (mapped.length > 0 && !activeQuestionId) {
                setActiveQuestionId(mapped[0].id);
            }
        }
    }, [apiQuestions]);

    const activeQuestion = localQuestions.find((q) => q.id === activeQuestionId) || localQuestions[0];

    const handlePromptChange = (val: string) => {
        if (!activeQuestion) return;
        setLocalQuestions((prev) =>
            prev.map((q) => (q.id === activeQuestionId ? { ...q, prompt: val } : q))
        );
        setPendingChanges((prev) => {
            const next = new Map(prev);
            const existing = next.get(activeQuestionId) || {};
            next.set(activeQuestionId, { ...existing, questionText: val });
            return next;
        });
        triggerAutoSave();
    };

    const handlePointsChange = (val: number) => {
        if (!activeQuestion) return;
        setLocalQuestions((prev) =>
            prev.map((q) => (q.id === activeQuestionId ? { ...q, points: val } : q))
        );
        setPendingChanges((prev) => {
            const next = new Map(prev);
            const existing = next.get(activeQuestionId) || {};
            next.set(activeQuestionId, { ...existing, points: val });
            return next;
        });
        triggerAutoSave();
    };

    const handleOptionTextChange = (optionId: string, val: string) => {
        if (!activeQuestion) return;
        setLocalQuestions((prev) =>
            prev.map((q) =>
                q.id === activeQuestionId
                    ? {
                          ...q,
                          options: q.options.map((opt) =>
                              opt.id === optionId ? { ...opt, text: val } : opt
                          ),
                      }
                    : q
            )
        );
        triggerAutoSave();
    };

    const handleCorrectOptionSelect = (optionId: string) => {
        if (!activeQuestion) return;
        setLocalQuestions((prev) =>
            prev.map((q) =>
                q.id === activeQuestionId
                    ? {
                          ...q,
                          options: q.options.map((opt) => ({
                              ...opt,
                              isCorrect: opt.id === optionId,
                          })),
                      }
                    : q
            )
        );
        triggerAutoSave();
    };

    const triggerAutoSave = () => {
        setSavedStatus('saving');
        setTimeout(() => {
            setSavedStatus('saved');
        }, 400);
    };

    const addNewQuestion = () => {
        const newId = `local-${Date.now()}`;
        const newQ: LocalQuestion = {
            id: newId,
            type: 'MULTIPLE_CHOICE',
            prompt: '',
            points: 2,
            options: [
                { id: `opt-${Date.now()}-1`, text: 'Option A', isCorrect: true },
                { id: `opt-${Date.now()}-2`, text: 'Option B', isCorrect: false },
                { id: `opt-${Date.now()}-3`, text: 'Option C', isCorrect: false },
                { id: `opt-${Date.now()}-4`, text: 'Option D', isCorrect: false },
            ],
        };
        setLocalQuestions((prev) => [...prev, newQ]);
        setActiveQuestionId(newId);

        if (assessmentId) {
            setPendingCreates((prev) => {
                const next = new Map(prev);
                next.set(newId, {
                    questionType: 'MULTIPLE_CHOICE',
                    questionText: '',
                    points: 2,
                    position: localQuestions.length,
                    options: [
                        { optionText: 'Option A', isCorrect: 1, position: 0 },
                        { optionText: 'Option B', isCorrect: 0, position: 1 },
                        { optionText: 'Option C', isCorrect: 0, position: 2 },
                        { optionText: 'Option D', isCorrect: 0, position: 3 },
                    ],
                });
                return next;
            });
        }
    };

    const deleteQuestionHandler = (questionId: string) => {
        if (!assessmentId) return;
        setLocalQuestions((prev) => prev.filter((q) => q.id !== questionId));
        if (!questionId.startsWith('local-')) {
            deleteQuestion.mutate({ assessmentId, questionId });
        }
        setPendingCreates((prev) => {
            const next = new Map(prev);
            next.delete(questionId);
            return next;
        });
        setPendingChanges((prev) => {
            const next = new Map(prev);
            next.delete(questionId);
            return next;
        });
    };

    const saveAllChanges = async () => {
        if (!assessmentId) return;
        setSavedStatus('saving');

        try {
            for (const [questionId, data] of pendingCreates) {
                await createQuestion.mutateAsync({ assessmentId, data });
            }
            setPendingCreates(new Map());

            for (const [questionId, data] of pendingChanges) {
                if (!questionId.startsWith('local-')) {
                    await updateQuestion.mutateAsync({ assessmentId, questionId, data });
                }
            }
            setPendingChanges(new Map());
            setSavedStatus('saved');
        } catch (err) {
            setSavedStatus('error');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-sm text-slate-600">Failed to load questions</p>
                <Button onClick={() => navigate('/assessments')} variant="outline" size="sm">
                    Back to Assessments
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] -m-4 sm:-m-8 flex flex-col">
            {/* Builder Top Bar */}
            <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(`/assessments/${assessmentId || ''}`)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <span className="text-xs font-semibold text-slate-900">
                            Assessment Builder Studio
                        </span>
                        <span className="text-[11px] text-slate-400 ml-2">
                            {savedStatus === 'saving'
                                ? 'Saving changes...'
                                : savedStatus === 'error'
                                ? 'Save failed'
                                : 'All changes saved'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/join/${assessmentId}`, '_blank')}
                        className="text-xs border-slate-200 text-slate-700 gap-1.5"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Student Preview</span>
                    </Button>
                    <Button
                        size="sm"
                        onClick={saveAllChanges}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 shadow-xs"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>Finish & Save</span>
                    </Button>
                </div>
            </header>

            {/* 3-Column Studio Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Column 1: Questions List Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Questions ({localQuestions.length})
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">
                                {localQuestions.reduce((acc, q) => acc + q.points, 0)} pts
                            </span>
                        </div>

                        <div className="space-y-2 mt-3">
                            {localQuestions.map((q, idx) => (
                                <div key={q.id} className="relative group">
                                    <button
                                        onClick={() => setActiveQuestionId(q.id)}
                                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                                            q.id === activeQuestionId
                                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold shadow-2xs'
                                                : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>Question {idx + 1}</span>
                                            <span className="font-mono text-[10px] text-slate-400">
                                                {q.points} pt{q.points > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[11px] text-slate-500 truncate font-normal">
                                            {q.prompt || 'Untitled question prompt...'}
                                        </p>
                                    </button>
                                    <button
                                        onClick={() => deleteQuestionHandler(q.id)}
                                        className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={addNewQuestion}
                        variant="outline"
                        className="w-full mt-4 border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 text-xs gap-1.5"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Question</span>
                    </Button>
                </aside>

                {/* Column 2: Central Question Editor */}
                <main className="flex-1 bg-[#F8FAFC] p-6 sm:p-8 overflow-y-auto">
                    {activeQuestion ? (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <span className="text-sm font-bold text-slate-900">
                                        Question Prompt
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">
                                        Type: {activeQuestion.type.replace('_', ' ')}
                                    </span>
                                </div>

                                <FormField label="Question Statement" required>
                                    <Textarea
                                        value={activeQuestion.prompt}
                                        onChange={(e) => handlePromptChange(e.target.value)}
                                        placeholder="Type your question prompt clearly here..."
                                        rows={3}
                                        className="text-sm bg-white border-slate-200 focus-visible:border-emerald-700"
                                    />
                                </FormField>

                                {/* Options List */}
                                <div className="space-y-3 pt-2">
                                    <span className="text-xs font-semibold text-slate-800 block">
                                        Answer Options (select the correct radio)
                                    </span>

                                    {activeQuestion.options.map((opt, i) => (
                                        <div
                                            key={opt.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                                opt.isCorrect
                                                    ? 'bg-emerald-50/50 border-emerald-300'
                                                    : 'bg-white border-slate-200'
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleCorrectOptionSelect(opt.id)}
                                                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                                    opt.isCorrect
                                                        ? 'border-emerald-600 bg-emerald-600 text-white'
                                                        : 'border-slate-300 hover:border-slate-400'
                                                }`}
                                            >
                                                {opt.isCorrect && <Check className="w-3 h-3 stroke-[3]" />}
                                            </button>

                                            <Input
                                                type="text"
                                                value={opt.text}
                                                onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                                                placeholder={`Option ${i + 1}`}
                                                className="h-9 text-xs bg-transparent border-0 focus-visible:ring-0 px-1 font-medium text-slate-800"
                                            />

                                            {opt.isCorrect && (
                                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider pr-2">
                                                    Correct Answer
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <p className="text-sm text-slate-500">No questions yet. Click "Add New Question" to get started.</p>
                        </div>
                    )}
                </main>

                {/* Column 3: Question Settings Panel */}
                <aside className="w-72 bg-white border-l border-slate-200 p-5 space-y-6 overflow-y-auto">
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                            Question Settings
                        </h4>

                        <div className="space-y-4">
                            <FormField label="Assigned Points">
                                <Input
                                    type="number"
                                    min={0}
                                    max={50}
                                    value={activeQuestion?.points || 0}
                                    onChange={(e) => handlePointsChange(parseInt(e.target.value) || 0)}
                                    className="h-9 text-xs border-slate-200"
                                />
                            </FormField>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                <span className="text-[11px] font-bold text-slate-700 block">
                                    Grading Behavior
                                </span>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Objective questions are automatically evaluated on submission against the selected key.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
