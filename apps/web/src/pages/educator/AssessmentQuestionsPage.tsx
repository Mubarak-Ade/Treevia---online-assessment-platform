import { useParams } from 'react-router';
import {
    Plus,
    GripVertical,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useQuestions, useCreateQuestion } from '@/features/questions';

export function AssessmentQuestionsPage() {
    const { assessmentId } = useParams();
    const { data: questions, isLoading, error } = useQuestions(assessmentId || '');
    const createQuestion = useCreateQuestion();

    const questionList = questions || [];
    const totalPoints = questionList.reduce((acc, q) => acc + q.points, 0);

    const handleAddQuestion = () => {
        if (!assessmentId) return;
        createQuestion.mutate({
            assessmentId,
            data: {
                questionType: 'MULTIPLE_CHOICE',
                questionText: 'New question',
                points: 1,
                position: questionList.length,
                options: [
                    { optionText: 'Option A', isCorrect: true, position: 0 },
                    { optionText: 'Option B', isCorrect: false, position: 1 },
                ],
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-sm text-slate-600">Failed to load questions</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-bold text-slate-900">Questions</h2>
                    <p className="text-xs text-slate-500">
                        {questionList.length} questions · {totalPoints} points
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={handleAddQuestion}
                    disabled={createQuestion.isPending}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 shadow-xs"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                </Button>
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
                            <CardContent className="p-4 flex items-center gap-3">
                                <button className="cursor-grab text-slate-300 hover:text-slate-500">
                                    <GripVertical className="w-4 h-4" />
                                </button>

                                <span className="text-sm font-bold text-slate-900 w-6 text-center shrink-0">
                                    {idx + 1}
                                </span>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800">
                                        {q.questionText}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                                        >
                                            {q.questionType === 'MULTIPLE_CHOICE'
                                                ? 'Multiple Choice'
                                                : q.questionType === 'TRUE_FALSE'
                                                ? 'True / False'
                                                : q.questionType}
                                        </Badge>
                                        <span className="text-[11px] text-slate-500">
                                            {q.points} {q.points === 1 ? 'point' : 'points'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
