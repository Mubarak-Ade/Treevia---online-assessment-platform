import * as React from 'react';
import { useParams, useNavigate } from 'react-router';
import { Reorder, useDragControls } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    Trash2,
    GripVertical,
    Check,
    Clock,
    Loader2,
    AlertCircle,
    TriangleAlert,
    Save,
    List,
    PenTool,
    Settings2,
    AlertTriangle,
    Copy,
    ExternalLink,
    PartyPopper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    useQuestions,
    useCreateQuestion,
    useUpdateQuestion,
    useDeleteQuestion,
    useReorderQuestions,
} from '@/features/questions';
import { useAssessmentById, useUpdateAssessment, usePublishAssessment, useUnpublishAssessment, useCloseAssessment } from '@/features/assessments/queries';
import type { QuestionInput, QuestionUpdateInput } from '@/features/questions';

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

interface QuestionValidation {
    hasEmptyPrompt: boolean;
    hasLessThanTwoOptions: boolean;
    hasNoCorrectAnswer: boolean;
    hasEmptyOptionText: boolean;
    hasNegativePoints: boolean;
    isValid: boolean;
}

function validateQuestion(q: LocalQuestion): QuestionValidation {
    const hasEmptyPrompt = q.prompt.trim() === '';
    const hasLessThanTwoOptions = q.type === 'MULTIPLE_CHOICE' && q.options.length < 2;
    const hasNoCorrectAnswer = !q.options.some((o) => o.isCorrect);
    const hasEmptyOptionText = q.options.some((o) => o.text.trim() === '');
    const hasNegativePoints = q.points < 0;
    const isValid = !hasEmptyPrompt && !hasLessThanTwoOptions && !hasNoCorrectAnswer && !hasEmptyOptionText && !hasNegativePoints;
    return { hasEmptyPrompt, hasLessThanTwoOptions, hasNoCorrectAnswer, hasEmptyOptionText, hasNegativePoints, isValid };
}

const QUESTION_TYPES = [
    { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
    { value: 'TRUE_FALSE', label: 'True/False' },
] as const;

const TIME_OPTIONS = [
    '15 minutes',
    '30 minutes',
    '45 minutes',
    '60 minutes',
    '90 minutes',
    '120 minutes',
];

interface DragQuestionItemProps {
    question: LocalQuestion;
    index: number;
    isActive: boolean;
    isPublished: boolean;
    onSelect: () => void;
}

function DragQuestionItem({ question, index, isActive, isPublished, onSelect }: DragQuestionItemProps) {
    const controls = useDragControls();
    const validation = validateQuestion(question);

    return (
        <Reorder.Item
            value={question}
            dragListener={!isPublished}
            dragControls={controls}
            onDragEnd={() => controls.stop()}
            whileDrag={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10 }}
            className={`w-full text-left p-3 rounded-xl border text-xs transition-colors ${
                isPublished
                    ? 'cursor-default'
                    : 'cursor-pointer'
            } ${
                isActive
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
            }`}
        >
            <div className="flex items-center gap-2" onClick={onSelect}>
                {!isPublished && (
                    <button
                        onPointerDown={(e) => controls.start(e)}
                        className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical className="w-3 h-3" />
                    </button>
                )}
                <span className="font-semibold text-slate-900 truncate">
                    {index + 1}. {question.prompt || 'Untitled'}
                </span>
                {validation.isValid ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-auto" />
                ) : (
                    <TriangleAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-auto" />
                )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 ml-5">
                {question.type === 'MULTIPLE_CHOICE' ? 'Multiple Choice' : 'True/False'}
            </p>
        </Reorder.Item>
    );
}

export function AssessmentBuilderPage() {
    const { assessmentId } = useParams();
    const navigate = useNavigate();

    const { data: assessment, isLoading: assessmentLoading } = useAssessmentById(assessmentId!);
    const updateAssessment = useUpdateAssessment();
    const publishAssessment = usePublishAssessment();
    const unpublishAssessment = useUnpublishAssessment();
    const closeAssessment = useCloseAssessment();
    const { data: apiQuestions, isLoading, error } = useQuestions(assessmentId || '');
    const createQuestion = useCreateQuestion();
    const updateQuestion = useUpdateQuestion();
    const deleteQuestion = useDeleteQuestion();
    const reorderQuestions = useReorderQuestions();

    const [localQuestions, setLocalQuestions] = React.useState<LocalQuestion[]>([]);
    const [activeQuestionId, setActiveQuestionId] = React.useState<string>('');
    const [savedStatus, setSavedStatus] = React.useState<'saved' | 'unsaved' | 'saving' | 'error'>('saved');
    const [pendingChanges, setPendingChanges] = React.useState<Map<string, QuestionUpdateInput>>(new Map());
    const [pendingCreates, setPendingCreates] = React.useState<Map<string, QuestionInput>>(new Map());
    const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
    const [typeChangeValue, setTypeChangeValue] = React.useState<string | null>(null);
    const [publishConfirmOpen, setPublishConfirmOpen] = React.useState(false);
    const [unpublishConfirmOpen, setUnpublishConfirmOpen] = React.useState(false);
    const [closeConfirmOpen, setCloseConfirmOpen] = React.useState(false);
    const [shareOpen, setShareOpen] = React.useState(false);
    const [copiedField, setCopiedField] = React.useState<string | null>(null);
    const [publishErrors, setPublishErrors] = React.useState<string[]>([]);
    const [mobilePanel, setMobilePanel] = React.useState<'questions' | 'editor' | 'settings'>('editor');

    const isPublished = assessment?.status === 'published';
    const hasUnsavedChanges = savedStatus === 'unsaved' || pendingChanges.size > 0 || pendingCreates.size > 0;
    const totalPoints = localQuestions.reduce((sum, q) => sum + q.points, 0);
    const joinCode = assessment?.joinCode || '';
    const publicLink = `${window.location.origin}/join/${joinCode}`;

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch {
            // fallback
        }
    };

    React.useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    React.useEffect(() => {
        if (apiQuestions) {
            const mapped: LocalQuestion[] = apiQuestions.map((q) => ({
                id: q.id,
                type: q.questionType,
                prompt: q.questionText,
                points: q.points,
                options: (q.options || []).map((opt) => ({
                    id: opt.id,
                    text: opt.optionText,
                    isCorrect: opt.isCorrect,
                })),
            }));
            setLocalQuestions(mapped);
            if (mapped.length > 0 && !activeQuestionId) {
                setActiveQuestionId(mapped[0].id);
            }
        }
    }, [apiQuestions]);

    React.useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
            }
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [hasUnsavedChanges]);

    const activeQuestion = localQuestions.find((q) => q.id === activeQuestionId) || localQuestions[0];
    const activeQuestionIndex = localQuestions.findIndex((q) => q.id === activeQuestionId);

    const markUnsaved = () => {
        if (savedStatus !== 'unsaved') {
            setSavedStatus('unsaved');
        }
    };

    const handlePromptChange = (val: string) => {
        if (!activeQuestion || isPublished) return;
        setLocalQuestions((prev) =>
            prev.map((q) => (q.id === activeQuestionId ? { ...q, prompt: val } : q))
        );
        setPendingChanges((prev) => {
            const next = new Map(prev);
            const existing = next.get(activeQuestionId) || {};
            next.set(activeQuestionId, { ...existing, questionText: val });
            return next;
        });
        markUnsaved();
    };

    const handlePointsChange = (val: number) => {
        if (!activeQuestion || isPublished) return;
        setLocalQuestions((prev) =>
            prev.map((q) => (q.id === activeQuestionId ? { ...q, points: val } : q))
        );
        setPendingChanges((prev) => {
            const next = new Map(prev);
            const existing = next.get(activeQuestionId) || {};
            next.set(activeQuestionId, { ...existing, points: val });
            return next;
        });
        markUnsaved();
    };

    const applyTypeChange = (type: string) => {
        if (!activeQuestion || isPublished) return;
        const newType = type as 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

        let newOptions: LocalOption[];
        if (newType === 'TRUE_FALSE') {
            newOptions = [
                { id: `opt-${Date.now()}-true`, text: 'True', isCorrect: false },
                { id: `opt-${Date.now()}-false`, text: 'False', isCorrect: false },
            ];
        } else {
            newOptions = [
                { id: `opt-${Date.now()}-1`, text: '', isCorrect: false },
                { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
            ];
        }

        setLocalQuestions((prev) =>
            prev.map((q) =>
                q.id === activeQuestionId ? { ...q, type: newType, options: newOptions } : q
            )
        );
        setPendingChanges((prev) => {
            const next = new Map(prev);
            const existing = next.get(activeQuestionId) || {};
            next.set(activeQuestionId, {
                ...existing,
                questionType: newType,
                options: newOptions.map((o, i) => ({
                    optionText: o.text,
                    isCorrect: o.isCorrect,
                    position: i,
                })),
            });
            return next;
        });
        markUnsaved();
    };

    const handleTypeChange = (type: string) => {
        if (!activeQuestion) return;
        if (activeQuestion.type !== type) {
            setTypeChangeValue(type);
            return;
        }
        applyTypeChange(type);
    };

    const handleOptionTextChange = (optionId: string, val: string) => {
        if (!activeQuestion || isPublished) return;
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
        markUnsaved();
    };

    const handleCorrectOptionSelect = (optionId: string) => {
        if (!activeQuestion || isPublished) return;
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
        markUnsaved();
    };

    const addOption = () => {
        if (!activeQuestion || isPublished) return;
        const newOpt: LocalOption = {
            id: `opt-${Date.now()}`,
            text: '',
            isCorrect: false,
        };
        setLocalQuestions((prev) =>
            prev.map((q) =>
                q.id === activeQuestionId
                    ? { ...q, options: [...q.options, newOpt] }
                    : q
            )
        );
        markUnsaved();
    };

    const removeOption = (optionId: string) => {
        if (!activeQuestion || isPublished) return;
        if (activeQuestion.options.length <= 2) return;
        setLocalQuestions((prev) =>
            prev.map((q) =>
                q.id === activeQuestionId
                    ? { ...q, options: q.options.filter((o) => o.id !== optionId) }
                    : q
            )
        );
        markUnsaved();
    };

    const handleReorder = (newOrder: LocalQuestion[]) => {
        if (isPublished) return;
        setLocalQuestions(newOrder);
        if (assessmentId && !newOrder.some((q) => q.id.startsWith('local-'))) {
            reorderQuestions.mutate({
                assessmentId,
                data: {
                    questions: newOrder.map((q, i) => ({ id: q.id, position: i })),
                },
            });
        }
        markUnsaved();
    };

    const addNewQuestion = () => {
        if (isPublished) return;
        const newId = `local-${Date.now()}`;
        const newQ: LocalQuestion = {
            id: newId,
            type: 'MULTIPLE_CHOICE',
            prompt: '',
            points: 1,
            options: [
                { id: `opt-${Date.now()}-1`, text: '', isCorrect: false },
                { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
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
                    points: 1,
                    position: localQuestions.length,
                    options: [
                        { optionText: '', isCorrect: false, position: 0 },
                        { optionText: '', isCorrect: false, position: 1 },
                    ],
                });
                return next;
            });
        }
        markUnsaved();
    };

    const deleteQuestionHandler = (questionId: string) => {
        if (!assessmentId || isPublished) return;
        const idx = localQuestions.findIndex((q) => q.id === questionId);
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

        if (activeQuestionId === questionId) {
            const remaining = localQuestions.filter((q) => q.id !== questionId);
            setActiveQuestionId(remaining.length > 0 ? remaining[Math.min(idx, remaining.length - 1)].id : '');
        }
        markUnsaved();
    };

    const saveAllChanges = async () => {
        if (!assessmentId) return;
        setSavedStatus('saving');

        try {
            for (const [, data] of pendingCreates) {
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
        } catch {
            setSavedStatus('error');
        }
    };

    const handleTimeLimitChange = (value: string) => {
        if (!assessmentId || !assessment) return;
        const minutes = parseInt(value);
        updateAssessment.mutate({
            id: assessmentId,
            data: { title: assessment.title, durationMinutes: minutes },
        });
    };

    const validateAllQuestionsForPublish = (): string[] => {
        const errors: string[] = [];
        if (localQuestions.length === 0) {
            errors.push('Assessment must have at least one question.');
        }
        localQuestions.forEach((q, i) => {
            const v = validateQuestion(q);
            if (v.hasEmptyPrompt) errors.push(`Question ${i + 1}: Question prompt is required.`);
            if (v.hasLessThanTwoOptions) errors.push(`Question ${i + 1}: Multiple choice requires at least 2 options.`);
            if (v.hasNoCorrectAnswer) errors.push(`Question ${i + 1}: Must have exactly 1 correct answer.`);
            if (v.hasEmptyOptionText) errors.push(`Question ${i + 1}: All options must have text.`);
            if (v.hasNegativePoints) errors.push(`Question ${i + 1}: Points must be zero or greater.`);
        });
        return errors;
    };

    const handlePublish = () => {
        const errors = validateAllQuestionsForPublish();
        if (errors.length > 0) {
            setPublishErrors(errors);
            return;
        }
        setPublishErrors([]);
        setPublishConfirmOpen(true);
    };

    const confirmPublish = async () => {
        if (!assessmentId) return;
        try {
            await saveAllChanges();
            await publishAssessment.mutateAsync(assessmentId);
            setPublishConfirmOpen(false);
            setShareOpen(true);
        } catch {
            setSavedStatus('error');
        }
    };

    const confirmUnpublish = async () => {
        if (!assessmentId) return;
        try {
            await unpublishAssessment.mutateAsync(assessmentId);
            setUnpublishConfirmOpen(false);
        } catch {
            // error handled by hook
        }
    };

    const confirmClose = async () => {
        if (!assessmentId) return;
        try {
            await closeAssessment.mutateAsync(assessmentId);
            setCloseConfirmOpen(false);
        } catch {
            // error handled by hook
        }
    };

    if (isLoading || assessmentLoading) {
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

    const timeLimitLabel = assessment
        ? `${assessment.durationMinutes} minutes`
        : '30 minutes';

    const savedStatusIndicator = () => {
        switch (savedStatus) {
            case 'saved':
                return (
                    <div className="flex items-center gap-1 text-emerald-600">
                        <Check className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Saved</span>
                    </div>
                );
            case 'unsaved':
                return (
                    <div className="flex items-center gap-1 text-amber-600">
                        <TriangleAlert className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Unsaved changes</span>
                    </div>
                );
            case 'saving':
                return (
                    <div className="flex items-center gap-1 text-slate-500">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-xs font-medium">Saving...</span>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Save failed</span>
                    </div>
                );
        }
    };

    const activeValidation = activeQuestion ? validateQuestion(activeQuestion) : null;

    return (
        <>
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
                {/* Header */}
                <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) return;
                                navigate(`/assessments/${assessmentId || ''}`);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">
                                {assessment?.title || 'Assessment'}
                            </span>
                            {savedStatusIndicator()}
                        </div>
                    </div>
                    <div className="text-center hidden sm:block">
                        <p className="text-xs text-slate-500">{assessment?.title || 'Assessment'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isPublished && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={saveAllChanges}
                                disabled={savedStatus === 'saving'}
                                className="text-xs border-slate-200 text-slate-700"
                            >
                                <Save className="w-3.5 h-3.5 mr-1" />
                                Save Draft
                            </Button>
                        )}
                        {isPublished ? (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setUnpublishConfirmOpen(true)}
                                    disabled={unpublishAssessment.isPending}
                                    className="text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                                >
                                    Unpublish
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCloseConfirmOpen(true)}
                                    disabled={closeAssessment.isPending}
                                    className="text-xs border-red-200 text-red-700 hover:bg-red-50"
                                >
                                    Close
                                </Button>
                            </>
                        ) : (
                            <Button
                                size="sm"
                                onClick={handlePublish}
                                className="text-xs shadow-xs bg-emerald-700 hover:bg-emerald-800 text-white"
                            >
                                Publish
                            </Button>
                        )}
                    </div>
                </header>

                {/* Published Banner */}
                {isPublished && (
                    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 shrink-0">
                        <TriangleAlert className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-800">
                            This assessment is published. Editing is disabled.
                        </span>
                    </div>
                )}

                {/* Publish Errors Banner */}
                {publishErrors.length > 0 && (
                    <div className="bg-red-50 border-b border-red-200 px-4 py-3 shrink-0">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-bold text-red-800">Cannot publish — fix the following errors:</span>
                        </div>
                        <ul className="list-disc list-inside ml-6">
                            {publishErrors.map((err, i) => (
                                <li key={i} className="text-[11px] text-red-700">{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 3-Column Layout */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Sidebar - Questions List */}
                    <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col overflow-hidden">
                        <div className="p-4 flex items-center justify-between border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Questions
                            </span>
                            {!isPublished && (
                                <button
                                    onClick={addNewQuestion}
                                    className="text-emerald-700 hover:text-emerald-800"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-3">
                            <Reorder.Group
                                axis="y"
                                values={localQuestions}
                                onReorder={handleReorder}
                                className="space-y-1.5"
                            >
                                {localQuestions.map((q, idx) => (
                                    <DragQuestionItem
                                        key={q.id}
                                        question={q}
                                        index={idx}
                                        isActive={q.id === activeQuestionId}
                                        isPublished={isPublished}
                                        onSelect={() => {
                                            setActiveQuestionId(q.id);
                                            setMobilePanel('editor');
                                        }}
                                    />
                                ))}
                            </Reorder.Group>
                        </div>

                        {!isPublished && (
                            <div className="p-3 border-t border-slate-100">
                                <Button
                                    onClick={addNewQuestion}
                                    variant="outline"
                                    className="w-full border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 text-xs gap-1.5"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Question</span>
                                </Button>
                            </div>
                        )}
                    </aside>

                    {/* Center - Question Editor */}
                    <main className={`flex-1 bg-[#F8FAFC] p-6 sm:p-8 overflow-y-auto ${
                        mobilePanel !== 'editor' ? 'hidden md:block' : ''
                    }`}>
                        {activeQuestion ? (
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                                    {/* Question Header */}
                                    <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                                        <span className="text-sm font-bold text-slate-900">
                                            Question {activeQuestionIndex + 1}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-500">Type:</span>
                                                <Select
                                                    value={activeQuestion.type}
                                                    onValueChange={handleTypeChange}
                                                    disabled={isPublished}
                                                >
                                                    <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {QUESTION_TYPES.map((t) => (
                                                            <SelectItem key={t.value} value={t.value}>
                                                                {t.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {!isPublished && (
                                                <AlertDialog open={deleteConfirmId === activeQuestion.id} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                                                    <AlertDialogTrigger asChild>
                                                        <button
                                                            onClick={() => setDeleteConfirmId(activeQuestion.id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Question</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this question? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    deleteQuestionHandler(activeQuestion.id);
                                                                    setDeleteConfirmId(null);
                                                                }}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    </div>

                                    {/* Question Prompt */}
                                    <div className="mt-5 space-y-2">
                                        <label className="text-xs font-semibold text-slate-700">
                                            Question Prompt
                                        </label>
                                        <Textarea
                                            value={activeQuestion.prompt}
                                            onChange={(e) => handlePromptChange(e.target.value)}
                                            placeholder="Type your question prompt here..."
                                            rows={4}
                                            disabled={isPublished}
                                            className="text-sm bg-white border-slate-200 focus-visible:border-emerald-700 resize-none"
                                        />
                                        {activeValidation?.hasEmptyPrompt && (
                                            <p className="text-[11px] text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Question prompt is required.
                                            </p>
                                        )}
                                    </div>

                                    {/* Answer Options */}
                                    <div className="mt-6 space-y-3">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700">
                                                {activeQuestion.type === 'TRUE_FALSE' ? 'Answer' : 'Answer Options'}
                                            </label>
                                            {activeQuestion.type === 'MULTIPLE_CHOICE' && (
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    Select the correct answer by checking the radio button.
                                                </p>
                                            )}
                                        </div>

                                        {activeQuestion.type === 'TRUE_FALSE' ? (
                                            <div className="space-y-2">
                                                {activeQuestion.options.map((opt) => (
                                                    <div
                                                        key={opt.id}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                                            opt.isCorrect
                                                                ? 'bg-emerald-50/50 border-emerald-300'
                                                                : 'bg-white border-slate-200'
                                                        } ${isPublished ? 'opacity-70' : ''}`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCorrectOptionSelect(opt.id)}
                                                            disabled={isPublished}
                                                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                                                                opt.isCorrect
                                                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                                                    : 'border-slate-300 hover:border-slate-400'
                                                            }`}
                                                        >
                                                            {opt.isCorrect && <Check className="w-3 h-3 stroke-[3]" />}
                                                        </button>
                                                        <span className="text-sm font-medium text-slate-800">
                                                            {opt.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {activeQuestion.options.map((opt) => (
                                                    <div
                                                        key={opt.id}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                                            opt.isCorrect
                                                                ? 'bg-emerald-50/50 border-emerald-300'
                                                                : 'bg-white border-slate-200'
                                                        } ${isPublished ? 'opacity-70' : ''}`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCorrectOptionSelect(opt.id)}
                                                            disabled={isPublished}
                                                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
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
                                                            placeholder="Option text"
                                                            disabled={isPublished}
                                                            className="h-9 text-sm bg-transparent border-0 focus-visible:ring-0 px-1 font-medium text-slate-800"
                                                        />

                                                        {!isPublished && activeQuestion.options.length > 2 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(opt.id)}
                                                                className="p-1 text-slate-300 hover:text-red-500 transition-colors shrink-0"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeValidation?.hasLessThanTwoOptions && (
                                            <p className="text-[11px] text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Multiple choice requires at least 2 options.
                                            </p>
                                        )}
                                        {activeValidation?.hasNoCorrectAnswer && (
                                            <p className="text-[11px] text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Must have exactly 1 correct answer.
                                            </p>
                                        )}
                                        {activeValidation?.hasEmptyOptionText && (
                                            <p className="text-[11px] text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                All options must have text.
                                            </p>
                                        )}

                                        {!isPublished && activeQuestion.type === 'MULTIPLE_CHOICE' && (
                                            <button
                                                onClick={addOption}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mt-2"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>Add Option</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Points Awarded */}
                                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700">
                                                Points Awarded
                                            </label>
                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                Value for a correct answer.
                                            </p>
                                        </div>
                                        <Input
                                            type="number"
                                            min={0}
                                            max={50}
                                            value={activeQuestion.points}
                                            onChange={(e) => handlePointsChange(parseInt(e.target.value) || 0)}
                                            disabled={isPublished}
                                            className="w-20 h-9 text-sm text-center border-slate-200"
                                        />
                                    </div>
                                    {activeValidation?.hasNegativePoints && (
                                        <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Points must be zero or greater.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <p className="text-sm text-slate-500">
                                    No questions yet. Click "Add Question" to get started.
                                </p>
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar - Settings */}
                    <aside className={`hidden md:flex w-72 bg-white border-l border-slate-200 p-5 overflow-y-auto flex-col ${
                        mobilePanel !== 'settings' ? 'hidden md:flex' : ''
                    }`}>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-5">
                            Settings
                        </h4>

                        {/* Assessment Summary */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6">
                            <h5 className="text-xs font-bold text-slate-900 mb-3">Assessment Summary</h5>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Total Questions</span>
                                    <span className="text-sm font-bold text-slate-900">{localQuestions.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Total Points</span>
                                    <span className="text-sm font-bold text-slate-900">{totalPoints}</span>
                                </div>
                            </div>
                        </div>

                        {/* Time Limit */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-xs font-semibold text-slate-700">Time Limit</span>
                            </div>
                            <Select
                                value={timeLimitLabel}
                                onValueChange={handleTimeLimitChange}
                                disabled={isPublished}
                            >
                                <SelectTrigger className="w-full h-9 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIME_OPTIONS.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Randomize Questions */}
                        <div className="mb-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-700 block">
                                        Randomize Questions
                                    </span>
                                    <span className="text-[11px] text-slate-500">Order varies per student</span>
                                </div>
                                <button
                                    className={`w-10 rounded-full relative transition-colors ${isPublished ? 'bg-slate-200 cursor-not-allowed' : 'bg-emerald-600'}`}
                                >
                                    <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-xs transition-transform ${isPublished ? 'left-0.5' : 'right-0.5'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Allow Late Submissions */}
                        <div className="mb-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-700 block">
                                        Allow Late Submissions
                                    </span>
                                    <span className="text-[11px] text-slate-500">Accept after deadline</span>
                                </div>
                                <button
                                    className={`w-10 rounded-full relative transition-colors ${isPublished ? 'bg-slate-200 cursor-not-allowed' : 'bg-slate-200'}`}
                                >
                                    <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-xs transition-transform ${isPublished ? 'right-0.5' : 'left-0.5'}`} />
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Mobile Navigation Bar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-20">
                    <div className="flex items-center justify-around py-2">
                        <button
                            onClick={() => setMobilePanel('questions')}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                                mobilePanel === 'questions'
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : 'text-slate-500'
                            }`}
                        >
                            <List className="w-5 h-5" />
                            <span className="text-[10px] font-medium">Questions</span>
                        </button>
                        <button
                            onClick={() => setMobilePanel('editor')}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                                mobilePanel === 'editor'
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : 'text-slate-500'
                            }`}
                        >
                            <PenTool className="w-5 h-5" />
                            <span className="text-[10px] font-medium">Editor</span>
                        </button>
                        <button
                            onClick={() => setMobilePanel('settings')}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                                mobilePanel === 'settings'
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : 'text-slate-500'
                            }`}
                        >
                            <Settings2 className="w-5 h-5" />
                            <span className="text-[10px] font-medium">Settings</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Questions Panel */}
                {mobilePanel === 'questions' && (
                    <div className="md:hidden fixed inset-0 top-14 bottom-14 bg-white z-10 overflow-y-auto">
                        <div className="p-4 flex items-center justify-between border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Questions
                            </span>
                            {!isPublished && (
                                <button
                                    onClick={addNewQuestion}
                                    className="text-emerald-700 hover:text-emerald-800"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="p-3">
                            <Reorder.Group
                                axis="y"
                                values={localQuestions}
                                onReorder={handleReorder}
                                className="space-y-1.5"
                            >
                                {localQuestions.map((q, idx) => (
                                    <DragQuestionItem
                                        key={q.id}
                                        question={q}
                                        index={idx}
                                        isActive={q.id === activeQuestionId}
                                        isPublished={isPublished}
                                        onSelect={() => {
                                            setActiveQuestionId(q.id);
                                            setMobilePanel('editor');
                                        }}
                                    />
                                ))}
                            </Reorder.Group>
                        </div>
                        {!isPublished && (
                            <div className="p-3 border-t border-slate-100">
                                <Button
                                    onClick={addNewQuestion}
                                    variant="outline"
                                    className="w-full border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 text-xs gap-1.5"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Question</span>
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Mobile Settings Panel */}
                {mobilePanel === 'settings' && (
                    <div className="md:hidden fixed inset-0 top-14 bottom-14 bg-white z-10 overflow-y-auto p-5">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-5">
                            Settings
                        </h4>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6">
                            <h5 className="text-xs font-bold text-slate-900 mb-3">Assessment Summary</h5>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Total Questions</span>
                                    <span className="text-sm font-bold text-slate-900">{localQuestions.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Total Points</span>
                                    <span className="text-sm font-bold text-slate-900">{totalPoints}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-xs font-semibold text-slate-700">Time Limit</span>
                            </div>
                            <Select
                                value={timeLimitLabel}
                                onValueChange={handleTimeLimitChange}
                                disabled={isPublished}
                            >
                                <SelectTrigger className="w-full h-9 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIME_OPTIONS.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-700 block">
                                        Randomize Questions
                                    </span>
                                    <span className="text-[11px] text-slate-500">Order varies per student</span>
                                </div>
                                <button
                                    className={`w-10 rounded-full relative transition-colors ${isPublished ? 'bg-slate-200 cursor-not-allowed' : 'bg-emerald-600'}`}
                                >
                                    <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-xs transition-transform ${isPublished ? 'left-0.5' : 'right-0.5'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-700 block">
                                        Allow Late Submissions
                                    </span>
                                    <span className="text-[11px] text-slate-500">Accept after deadline</span>
                                </div>
                                <button
                                    className={`w-10 rounded-full relative transition-colors ${isPublished ? 'bg-slate-200 cursor-not-allowed' : 'bg-slate-200'}`}
                                >
                                    <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-xs transition-transform ${isPublished ? 'right-0.5' : 'left-0.5'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Type Change Confirmation Dialog */}
            <AlertDialog open={typeChangeValue !== null} onOpenChange={(open) => !open && setTypeChangeValue(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change Question Type</AlertDialogTitle>
                        <AlertDialogDescription>
                            Changing the question type will reset the answer options. Are you sure you want to continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setTypeChangeValue(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (typeChangeValue) {
                                    applyTypeChange(typeChangeValue);
                                    setTypeChangeValue(null);
                                }
                            }}
                        >
                            Change Type
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Publish Confirmation Dialog */}
            <AlertDialog open={publishConfirmOpen} onOpenChange={setPublishConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Publish Assessment</AlertDialogTitle>
                        <AlertDialogDescription>
                            You're about to make this assessment available to participants.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-3 py-2">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Assessment</span>
                                <span className="font-medium text-slate-900">{assessment?.title || 'Untitled'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Questions</span>
                                <span className="font-medium text-slate-900">{localQuestions.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Total points</span>
                                <span className="font-medium text-slate-900">{totalPoints}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Duration</span>
                                <span className="font-medium text-slate-900">{assessment?.durationMinutes} min</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Join code</span>
                                <span className="font-mono font-bold text-slate-900 tracking-wider">{joinCode}</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">
                            Once published, students can join using the code or public link. You won't be able to edit questions.
                        </p>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmPublish}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white"
                        >
                            Publish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Unpublish Confirmation Dialog */}
            <AlertDialog open={unpublishConfirmOpen} onOpenChange={setUnpublishConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unpublish Assessment</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will move the assessment back to draft status. Students will no longer be able to access it. Are you sure?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmUnpublish}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            Unpublish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Close Confirmation Dialog */}
            <AlertDialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Close Assessment</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently close the assessment. Students will no longer be able to submit responses. Are you sure?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmClose}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Close Assessment
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Share Assessment Dialog */}
            <AlertDialog open={shareOpen} onOpenChange={setShareOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <PartyPopper className="w-5 h-5 text-emerald-600" />
                            Assessment Published
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Your assessment is now ready for students.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="text-center space-y-1">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Join Code</p>
                            <p className="text-4xl font-mono font-bold text-slate-900 tracking-[0.3em]">{joinCode}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(joinCode, 'code')}
                                className="flex-1 gap-2"
                            >
                                {copiedField === 'code' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                {copiedField === 'code' ? 'Copied' : 'Copy Code'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(publicLink, 'link')}
                                className="flex-1 gap-2"
                            >
                                {copiedField === 'link' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                {copiedField === 'link' ? 'Copied' : 'Copy Link'}
                            </Button>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                            <p className="text-xs text-slate-500 truncate">{publicLink}</p>
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => window.open(publicLink, '_blank')}
                            variant="outline"
                            className="gap-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Open Join Page
                        </AlertDialogAction>
                        <AlertDialogAction
                            onClick={() => setShareOpen(false)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white"
                        >
                            Done
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
