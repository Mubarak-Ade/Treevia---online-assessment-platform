import { BadRequestError, ConflictError, NotFoundError, GoneError } from '@treevia/shared';
import { Attempt } from '../../shared/db/schema/attempts.js';
import { AssessmentRepository } from '../assessments/repository.js';
import { IAssessmentRepository } from '../assessments/types.js';
import { QuestionRepository } from '../questions/repository.js';
import { IQuestionRepository } from '../questions/types.js';
import { AttemptRepository } from './repository.js';
import { IAttemptRepository } from './types.js';
import { v7 as uuid } from 'uuid';
import { createHash, randomBytes } from 'crypto';

export interface AttemptWithToken extends Attempt {
    token: string;
}

export interface AttemptQuestion {
    id: string;
    number: number;
    text: string;
    options: { id: string; text: string }[];
}

export interface AttemptDetail {
    id: string;
    assessmentId: string;
    studentName: string;
    studentId: string;
    studentEmail: string;
    status: string;
    startedAt: Date;
    submittedAt: Date | null;
    durationMinutes: number;
    expiresAt: Date;
    isExpired: boolean;
    timeRemainingMs: number;
    createdAt: Date;
}

export class AttemptService {
    private attemptRepository: IAttemptRepository;
    private assessmentRepository: IAssessmentRepository;
    private questionRepository: IQuestionRepository;

    constructor(
        attemptRepository: IAttemptRepository = new AttemptRepository(),
        assessmentRepository: IAssessmentRepository = new AssessmentRepository(),
        questionRepository: IQuestionRepository = new QuestionRepository(),
    ) {
        this.attemptRepository = attemptRepository;
        this.assessmentRepository = assessmentRepository;
        this.questionRepository = questionRepository;
    }

    private generateToken(): string {
        return randomBytes(32).toString('hex');
    }

    private hashToken(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }

    private async getAssessmentDurationMinutes(assessmentId: string): Promise<number> {
        const assessment = await this.assessmentRepository.findById(assessmentId);
        if (!assessment) throw new NotFoundError('Assessment not found');
        return assessment.durationMinutes;
    }

    private assertInProgress(attempt: Attempt): void {
        if (attempt.status !== 'IN_PROGRESS') {
            throw new ConflictError('Attempt has already been submitted');
        }
    }

    private async assertTimeNotExpired(attempt: Attempt): Promise<void> {
        const durationMs = (await this.getAssessmentDurationMinutes(attempt.assessmentId)) * 60 * 1000;
        const elapsed = Date.now() - new Date(attempt.startedAt).getTime();
        if (elapsed > durationMs) {
            await this.attemptRepository.updateStatus(attempt.id, 'SUBMITTED');
            throw new GoneError('Time has expired — attempt was auto-submitted');
        }
    }

    async createAttempt(data: {
        assessmentId: string;
        studentName: string;
        studentId: string;
        studentEmail: string;
    }): Promise<AttemptWithToken> {
        const assessment = await this.assessmentRepository.findById(data.assessmentId);
        if (!assessment) {
            throw new NotFoundError('Assessment not found');
        }
        if (assessment.status !== 'published') {
            throw new ConflictError('Assessment is not available');
        }

        const existing = await this.attemptRepository.findByAssessmentAndStudent(
            data.assessmentId,
            data.studentId,
        );
        if (existing) {
            throw new ConflictError('You have already started this assessment');
        }

        const token = this.generateToken();
        const tokenHash = this.hashToken(token);
        const attempt = await this.attemptRepository.create({
            id: uuid(),
            assessmentId: data.assessmentId,
            studentName: data.studentName,
            studentId: data.studentId,
            studentEmail: data.studentEmail,
            token: tokenHash,
        });

        return { ...attempt, token };
    }

    async getAttempt(attemptId: string): Promise<AttemptDetail> {
        const attempt = await this.attemptRepository.findById(attemptId);
        if (!attempt) {
            throw new NotFoundError('Attempt not found');
        }

        const durationMinutes = await this.getAssessmentDurationMinutes(attempt.assessmentId);
        const durationMs = durationMinutes * 60 * 1000;
        const elapsed = Date.now() - new Date(attempt.startedAt).getTime();
        const timeRemainingMs = Math.max(0, durationMs - elapsed);

        return {
            id: attempt.id,
            assessmentId: attempt.assessmentId,
            studentName: attempt.studentName,
            studentId: attempt.studentId,
            studentEmail: attempt.studentEmail,
            status: attempt.status,
            startedAt: attempt.startedAt,
            submittedAt: attempt.submittedAt,
            durationMinutes,
            expiresAt: new Date(new Date(attempt.startedAt).getTime() + durationMs),
            isExpired: elapsed > durationMs,
            timeRemainingMs,
            createdAt: attempt.createdAt,
        };
    }

    async getAttemptQuestions(attemptId: string): Promise<AttemptQuestion[]> {
        const attempt = await this.attemptRepository.findById(attemptId);
        if (!attempt) {
            throw new NotFoundError('Attempt not found');
        }

        const questions = await this.questionRepository.findByAssessmentId(attempt.assessmentId);
        const sorted = [...questions].sort((a, b) => a.position - b.position);

        return Promise.all(
            sorted.map(async (q, idx) => {
                const options = await this.questionRepository.findOptionsByQuestionId(q.id);
                return {
                    id: q.id,
                    number: idx + 1,
                    text: q.questionText,
                    options: options.map((o) => ({ id: o.id, text: o.optionText })),
                };
            }),
        );
    }

    async getAttemptAnswers(attemptId: string): Promise<Record<string, string>> {
        const answers = await this.attemptRepository.findAnswersByAttemptId(attemptId);
        const map: Record<string, string> = {};
        for (const a of answers) {
            if (a.selectedOptionId) {
                map[a.questionId] = a.selectedOptionId;
            }
        }
        return map;
    }

    async saveAnswer(attemptId: string, questionId: string, selectedOptionId: string): Promise<void> {
        const attempt = await this.attemptRepository.findById(attemptId);
        if (!attempt) throw new NotFoundError('Attempt not found');
        this.assertInProgress(attempt);
        await this.assertTimeNotExpired(attempt);

        const question = await this.questionRepository.findById(questionId, attempt.assessmentId);
        if (!question) {
            throw new BadRequestError('Question does not belong to this assessment');
        }

        const options = await this.questionRepository.findOptionsByQuestionId(questionId);
        if (!options.some((o) => o.id === selectedOptionId)) {
            throw new BadRequestError('Option does not belong to this question');
        }

        await this.attemptRepository.saveAnswer({
            id: uuid(),
            attemptId,
            questionId,
            selectedOptionId,
        });
    }

    async bulkSaveAnswers(attemptId: string, answers: { questionId: string; selectedOptionId: string }[]): Promise<void> {
        const attempt = await this.attemptRepository.findById(attemptId);
        if (!attempt) throw new NotFoundError('Attempt not found');
        this.assertInProgress(attempt);
        await this.assertTimeNotExpired(attempt);

        const questions = await this.questionRepository.findByAssessmentId(attempt.assessmentId);
        const questionIds = new Set(questions.map((q) => q.id));

        for (const answer of answers) {
            if (!questionIds.has(answer.questionId)) {
                throw new BadRequestError(`Question ${answer.questionId} does not belong to this assessment`);
            }
            const options = await this.questionRepository.findOptionsByQuestionId(answer.questionId);
            if (!options.some((o) => o.id === answer.selectedOptionId)) {
                throw new BadRequestError(`Option ${answer.selectedOptionId} does not belong to question ${answer.questionId}`);
            }
        }

        await this.attemptRepository.bulkSaveAnswers(
            answers.map((a) => ({
                id: uuid(),
                attemptId,
                questionId: a.questionId,
                selectedOptionId: a.selectedOptionId,
            })),
        );
    }

    async submitAttempt(attemptId: string): Promise<Attempt> {
        const attempt = await this.attemptRepository.findById(attemptId);
        if (!attempt) throw new NotFoundError('Attempt not found');
        this.assertInProgress(attempt);

        const submitted = await this.attemptRepository.updateStatus(attemptId, 'SUBMITTED');
        return submitted;
    }
}
