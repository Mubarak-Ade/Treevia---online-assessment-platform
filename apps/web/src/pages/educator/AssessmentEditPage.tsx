import * as React from 'react';
import { useNavigate, Link, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Clock, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/shared/FormField';
import { useAssessmentById, useUpdateAssessment } from '@/features/assessments/queries';
import { assessmentSchema } from '@treevia/validation';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';

const formSchema = z.object({
    title: z.string().trim().min(2, "Title must be at least 2 characters").max(100),
    description: z.string().trim().optional(),
    durationMinutes: z.number().int().min(1, "Duration must be at least 1 minute"),
});

type FormValues = z.infer<typeof formSchema>;

export function AssessmentEditPage() {
    const navigate = useNavigate();
    const { assessmentId } = useParams();

    const { data: assessment, isLoading, error, refetch } = useAssessmentById(assessmentId || '');
    const updateMutation = useUpdateAssessment();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            durationMinutes: 45,
        },
    });

    // Pre-fill form when assessment data loads
    React.useEffect(() => {
        if (assessment) {
            reset({
                title: assessment.title,
                description: assessment.description || '',
                durationMinutes: assessment.durationMinutes,
            });
        }
    }, [assessment, reset]);

    const durationOptions = ['15', '30', '45', '60', '90'];
    const currentDuration = watch('durationMinutes');
    const charCount = watch('title')?.length || 0;

    const onSubmit = (data: FormValues) => {
        if (!assessmentId) return;
        updateMutation.mutate(
            { id: assessmentId, data },
            {
                onSuccess: (updatedAssessment) => {
                    toast.success('Assessment updated successfully');
                    navigate(`/assessments/${updatedAssessment.id}/builder`);
                },
                onError: (error: unknown) => {
                    const message = error instanceof Error ? error.message : 'Failed to update assessment';
                    toast.error(message);
                },
            },
        );
    };

    const handleDurationSelect = (value: string) => {
        setValue('durationMinutes', Number(value), { shouldValidate: true });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] p-6 sm:p-8 space-y-6">
                <div className="h-8 bg-slate-200 rounded-lg w-64 animate-pulse" />
                <LoadingSkeleton type="metric" count={4} />
                <LoadingSkeleton type="table" count={6} />
            </div>
        );
    }

    if (error || !assessment) {
        return (
            <ErrorState
                title="Assessment not found"
                message="We couldn't find the assessment you're looking for. It may have been deleted or you don't have access."
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Top Bar */}
            <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Link
                        to="/assessments"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Assessments</span>
                    </Link>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                            STEP 1 OF 2
                        </span>
                    </span>
                    <span className="text-xs text-slate-400">• Edit Assessment</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link to={`/assessments/${assessment.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs text-slate-600">
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        size="sm"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting || updateMutation.isPending}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs gap-1.5 shadow-xs"
                    >
                        {isSubmitting || updateMutation.isPending ? (
                            <span className="animate-pulse">Saving...</span>
                        ) : (
                            <>
                                <span>Continue to Questions</span>
                                <ArrowLeft className="w-3.5 h-3.5 rotate-[-45deg]" />
                            </>
                        )}
                    </Button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex">
                {/* Main Content Area */}
                <main className="flex-1 p-6 sm:p-8 max-w-2xl">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Edit Assessment
                        </h1>
                        <p className="text-sm text-slate-500 mt-1.5">
                            Update the details for "{assessment.title}" and continue to the question builder.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Form Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                            {/* Assessment Title */}
                            <FormField
                                label={
                                    <span>
                                        Assessment Title{' '}
                                        <span className="text-rose-500">*</span>
                                    </span>
                                }
                                description="A clear, unambiguous title makes it easy for enrolled students to identify."
                                error={errors.title?.message}
                            >
                                <div className="relative">
                                    <Input
                                        placeholder="e.g., Database Systems - Mid-Semester Exam"
                                        {...register('title')}
                                        maxLength={100}
                                        className={`pr-20 ${errors.title ? 'border-rose-500 focus-visible:border-rose-500' : ''}`}
                                    />
                                    <span
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono ${
                                            errors.title ? 'text-rose-500' : 'text-slate-400'
                                        }`}
                                    >
                                        {charCount}/100
                                    </span>
                                </div>
                            </FormField>

                            {/* Description */}
                            <FormField
                                label={
                                    <span className="flex items-center gap-2">
                                        Description{' '}
                                        <span className="text-emerald-600 text-[11px] font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                                            Optional
                                        </span>
                                        <span className="text-slate-400 text-[11px] ml-auto">
                                            Markdown supported
                                        </span>
                                    </span>
                                }
                                description="Visible to candidates before starting their assessment session."
                            >
                                <Textarea
                                    placeholder="Provide brief context, topics covered, or student instructions..."
                                    {...register('description')}
                                    rows={4}
                                    className="text-sm"
                                />
                            </FormField>

                            {/* Duration */}
                            <FormField
                                label={
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                                        Duration (Minutes)
                                        <span className="text-slate-400 text-[11px] font-normal ml-1">
                                            Enforced exam timer
                                        </span>
                                    </span>
                                }
                                error={errors.durationMinutes?.message}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <Input
                                            type="number"
                                            min={1}
                                            max={300}
                                            {...register('durationMinutes', { valueAsNumber: true })}
                                            className="text-sm pl-9"
                                        />
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                                            mins
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {durationOptions.map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => handleDurationSelect(opt)}
                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                                                    currentDuration === Number(opt)
                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                {opt}m
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </FormField>
                        </div>

                        {/* Info Banner */}
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                            <Clock className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-emerald-900">Streamlined Setup</p>
                                <p className="text-xs text-emerald-800/80 mt-0.5">
                                    Advanced configuration (randomization, question grading, passing
                                    criteria, and schedule) can be set in the builder.
                                </p>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-between">
                            <Link to={`/assessments/${assessment.id}`}>
                                <Button variant="ghost" size="sm" className="text-xs text-slate-600">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmitting || updateMutation.isPending}
                                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs gap-1.5 shadow-xs"
                            >
                                {isSubmitting || updateMutation.isPending ? (
                                    <span className="animate-pulse">Saving...</span>
                                ) : (
                                    <>
                                        <span>Continue to Questions</span>
                                        <ArrowLeft className="w-3.5 h-3.5 rotate-[-45deg]" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </main>

                {/* Right Sidebar */}
                <aside className="w-72 bg-white border-l border-slate-200 p-6 flex flex-col gap-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                    {/* Progress Stepper */}
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Progress
                        </p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">
                                1
                            </div>
                            <ArrowLeft className="w-3 h-3 text-slate-400 rotate-[-45deg]" />
                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                                2
                            </div>
                            <span className="text-[11px] text-slate-500 ml-1">Basic info → Question builder</span>
                        </div>
                    </div>

                    {/* Next Milestone Card */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            Next Milestone
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">
                                    1
                                </div>
                                <span className="text-xs text-slate-800 font-medium">Title, description, and time</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
                                    <ArrowLeft className="w-3 h-3 text-emerald-700 rotate-[-45deg]" />
                                </div>
                                <span className="text-xs text-emerald-700 font-medium">Question builder</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                                    <Circle className="w-3 h-3 text-slate-400" />
                                </div>
                                <span className="text-xs text-slate-400">Assign cohorts and availability</span>
                            </div>
                        </div>
                    </div>

                    {/* Current Assessment Info */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 rounded-xl border border-emerald-100 p-4 space-y-3">
                        <h4 className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18h6"/>
                                <path d="M10 22h4"/>
                                <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>
                            </svg>
                            Current Assessment
                        </h4>
                        <p className="text-sm font-bold text-emerald-900">{assessment.title}</p>
                        <div className="space-y-1.5 pt-2 border-t border-emerald-200/50">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-emerald-800">Status</span>
                                <span className="text-[11px] font-semibold text-emerald-700 capitalize bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {assessment.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-emerald-800">Duration</span>
                                <span className="text-[11px] font-semibold text-emerald-700">{assessment.durationMinutes} min</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-emerald-800">Join Code</span>
                                <span className="text-[11px] font-mono font-semibold text-emerald-700">{assessment.joinCode}</span>
                            </div>
                        </div>
                    </div>

                    {/* Educator Insight Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 rounded-xl border border-emerald-100 p-4 space-y-3">
                        <h4 className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>
                            </svg>
                            Educator Insight
                        </h4>
                        <p className="text-xs text-emerald-800/80 leading-relaxed">
                            Assessments capped at <span className="font-bold">45-60 minutes</span> observe an
                            18% higher completion rate with lower dropout rates during remote cohorts.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}