import { Question, NewQuestion, QuestionOption, NewQuestionOption } from '../../shared/db/schema/questions.js';

export interface IQuestionRepository {
    create(data: NewQuestion, options: NewQuestionOption[]): Promise<Question>;
    findByAssessmentId(assessmentId: string): Promise<Question[]>;
    findById(questionId: string): Promise<Question>;
    update(data: Partial<NewQuestion>, questionId: string): Promise<Question>;
    delete(questionId: string): Promise<void>;
    reorder(assessmentId: string, order: string[]): Promise<void>;
}
