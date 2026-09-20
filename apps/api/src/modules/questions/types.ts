import { db } from '../../shared/db/index.js';
import { Question, NewQuestion, QuestionOption, NewQuestionOption } from '../../shared/db/schema/questions.js';

export interface QuestionAndOption {
    question: Question,
    options: QuestionAndOption[]
}

export interface IQuestionRepository {
    create(tsx: DbTransaction, data: NewQuestion): Promise<Question>;
    findByAssessmentId(assessmentId: string): Promise<Question[]>;
    findById(questionId: string, assessmentId: string, tx?: DbTransaction): Promise<Question | undefined>;
    update(data: Partial<NewQuestion>, questionId: string, tx?: DbTransaction): Promise<Question>;
    delete(questionId: string): Promise<void>;
    reorder(assessmentId: string, questions: { id: string; position: number }[]): Promise<void>;
    addOptions(tsx: DbTransaction, options: NewQuestionOption[]): Promise<QuestionOption[]>,
    replaceOptions(questionId: string, options: NewQuestionOption[], tx?: DbTransaction): Promise<QuestionOption[]>,
    findOptionsByQuestionId(questionId: string): Promise<QuestionOption[]>,
}

export type DbTransaction = Parameters<
    Parameters<typeof db.transaction>[0]
>[0];