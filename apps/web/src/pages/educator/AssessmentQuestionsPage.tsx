import * as React from 'react';
import { useParams, Link } from 'react-router';
import {
    Plus,
    GripVertical,
    Trash2,
    Edit2,
    CheckCircle,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useQuestions, useDeleteQuestion } from '@/features/questions';

export function AssessmentQuestionsPage() {
    const { assessmentId } = useParams();
    const { data: questions, isLoading, error } = useQuestions(assessmentId || '');
    const deleteQuestion = useDeleteQuestion();

    const handleDelete = (questionId: string) => {
        if (assessmentId && confirm('Are you sure you want to delete this question?')) {
            deleteQuestion.mutate({ assessmentId, questionId });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <p className="text-sm text-slate-600">Failed to load questions</p>
                </div>
            </div>
        );
    }

    const questionList = questions || [];
    const totalPoints = questionList.reduce((acc, q) => acc + q.points, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-bold text-slate-900">
                        Questions List ({questionList.length} loaded)
                    </h2>
                    <p className="text-xs text-slate-500">
                        Total points: {totalPoints} · Reorder and configure question weights
                    </p>
                </div>
                <Link to={`/assessments/${assessmentId}/builder`}>
                    <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 shadow-xs">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Question</span>
                    </Button>
                </Link>
            </div>

            {questionList.length === 0 ? (
                <EmptyState
                    title="No questions yet"
                    description="Click 'Add Question' to create your first question."
                    icon={<Plus className="w-12 h-12 text-slate-300" />}
                />
            ) : (
                <div className="space-y-3">
                    {questionList.map((q, idx) => (
                        <Card key={q.id} className="bg-white border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
                            <CardContent className="p-4 flex items-start gap-3">
                                <button className="cursor-grab text-slate-300 hover:text-slate-500 mt-1">
                                    <GripVertical className="w-4 h-4" />
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-slate-900">
                                            Question {idx + 1}
                                        </span>
                                        <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                                            {q.questionType.replace('_', ' ')}
                                        </Badge>
                                        <span className="text-[11px] font-semibold text-emerald-700 ml-auto">
                                            {q.points} {q.points === 1 ? 'pt' : 'pts'}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-800">
                                        {q.questionText}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Link to={`/assessments/${assessmentId}/builder`}>
                                        <Button variant="ghost" size="icon-xs" className="text-slate-400 hover:text-slate-700">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        className="text-slate-400 hover:text-rose-600"
                                        onClick={() => handleDelete(q.id)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
