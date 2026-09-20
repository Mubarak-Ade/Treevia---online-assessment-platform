import { Attempt, NewAttempt, AttemptAnswer, NewAttemptAnswer } from '../../shared/db/schema/attempts.js';

export interface IAttemptRepository {
    create(data: NewAttempt): Promise<Attempt>;
    findById(id: string): Promise<Attempt | null>;
    findByToken(token: string): Promise<Attempt | null>;
    findByAssessmentAndStudent(assessmentId: string, studentId: string): Promise<Attempt | null>;
    updateStatus(id: string, status: 'SUBMITTED' | 'GRADED'): Promise<Attempt>;
    saveAnswer(data: NewAttemptAnswer): Promise<AttemptAnswer>;
    bulkSaveAnswers(data: NewAttemptAnswer[]): Promise<void>;
    findAnswersByAttemptId(attemptId: string): Promise<AttemptAnswer[]>;
    findAnswerByQuestion(attemptId: string, questionId: string): Promise<AttemptAnswer | null>;
    findAttemptsByAssessmentId(assessmentId: string): Promise<Attempt[]>;
    findExpiredInProgress(cutoffMs: number): Promise<Attempt[]>;
}
