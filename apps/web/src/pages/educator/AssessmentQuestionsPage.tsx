import * as React from 'react';
import { useParams, Link } from 'react-router';
import {
    Plus,
    GripVertical,
    Trash2,
    Edit2,
    CheckCircle,
    HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AssessmentQuestionsPage() {
    const { assessmentId } = useParams();

    const questions = [
        {
            id: 'q1',
            number: 1,
            type: 'MULTIPLE_CHOICE',
            points: 2,
            text: 'Which normal form eliminates partial dependencies on a composite candidate key?',
            correctAnswer: 'Second Normal Form (2NF)',
        },
        {
            id: 'q2',
            number: 2,
            type: 'TRUE_FALSE',
            points: 1,
            text: 'An index always speeds up INSERT and UPDATE operations in a relational database table.',
            correctAnswer: 'False',
        },
        {
            id: 'q3',
            number: 3,
            type: 'MULTIPLE_CHOICE',
            points: 2,
            text: 'What does the ACID acronym stand for in the context of relational database transactions?',
            correctAnswer: 'Atomicity, Consistency, Isolation, Durability',
        },
        {
            id: 'q4',
            number: 4,
            type: 'MULTIPLE_CHOICE',
            points: 3,
            text: 'Which SQL JOIN returns all rows from the left table and matched rows from the right table?',
            correctAnswer: 'LEFT OUTER JOIN',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-bold text-slate-900">
                        Questions List (4 of 20 loaded)
                    </h2>
                    <p className="text-xs text-slate-500">
                        Total points: 30 · Reorder and configure question weights
                    </p>
                </div>
                <Link to={`/assessments/${assessmentId}/builder`}>
                    <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 shadow-xs">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Question</span>
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                {questions.map((q) => (
                    <Card key={q.id} className="bg-white border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
                        <CardContent className="p-4 flex items-start gap-3">
                            <button className="cursor-grab text-slate-300 hover:text-slate-500 mt-1">
                                <GripVertical className="w-4 h-4" />
                            </button>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-900">
                                        Question {q.number}
                                    </span>
                                    <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                                        {q.type.replace('_', ' ')}
                                    </Badge>
                                    <span className="text-[11px] font-semibold text-emerald-700 ml-auto">
                                        {q.points} {q.points === 1 ? 'pt' : 'pts'}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm font-medium text-slate-800">
                                    {q.text}
                                </p>
                                <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Correct: <strong className="text-slate-700">{q.correctAnswer}</strong></span>
                                </p>
                            </div>

                            <div className="flex items-center gap-1">
                                <Link to={`/assessments/${assessmentId}/builder`}>
                                    <Button variant="ghost" size="icon-xs" className="text-slate-400 hover:text-slate-700">
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="icon-xs" className="text-slate-400 hover:text-rose-600">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
