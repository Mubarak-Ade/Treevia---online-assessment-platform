import {
    BadRequestError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
} from '@treevia/shared';
import { Assessment, NewAssessment } from '../../shared/db/schema/assessment.js';
import { AuthRepository } from '../auth/repository.js';
import { IAuthRepository } from '../auth/types.js';
import { AssessmentRepository } from './repository.js';
import { IAssessmentRepository } from './types.js';
import { QuestionRepository } from '../questions/repository.js';
import { IQuestionRepository } from '../questions/types.js';
import { AttemptRepository } from '../attempts/repository.js';
import { IAttemptRepository } from '../attempts/types.js';
import { generateJoinCode } from '../../shared/utils/generate_joincode.js';
import { v7 as uuid } from 'uuid';

export class AssessmentService {
    private assessmentRepository: IAssessmentRepository;
    private authRepository: IAuthRepository;
    private questionRepository: IQuestionRepository;
    private attemptRepository: IAttemptRepository;

    constructor(
        assessmentRepository: IAssessmentRepository = new AssessmentRepository(),
        authRepository: IAuthRepository = new AuthRepository(),
        questionRepository: IQuestionRepository = new QuestionRepository(),
        attemptRepository: IAttemptRepository = new AttemptRepository(),
    ) {
        this.assessmentRepository = assessmentRepository;
        this.authRepository = authRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
    }

    private async generateUniqueJoinCode(): Promise<string> {
        const code = generateJoinCode();

        const existing = await this.assessmentRepository.findByJoinCode(code);

        if (!existing) {
            return code;
        }

        return this.generateUniqueJoinCode();
    }

    async create(data: NewAssessment, creatorId: string) {
        const user = await this.authRepository.findById(creatorId);
        if (!user) {
            throw new UnauthorizedError('unauthorized user');
        }

        const assessmentId = uuid();
        const joincode = await this.generateUniqueJoinCode();

        const assessment = await this.assessmentRepository.create({
            ...data,
            id: assessmentId,
            creator_id: user.id,
            joinCode: joincode,
        });

        return assessment;
    }

    async findAll(userId: string) {
        const assessments = await this.assessmentRepository.findAll(userId);
        return assessments;
    }
    /**
     * Find Assessment By Id
     */
    async findById(assessmentId: string, userId: string): Promise<Assessment> {
        const assessment = await this.assessmentRepository.findById(assessmentId);
        if (!assessment) {
            throw new NotFoundError('Assessment not found');
        }

        if (assessment.creator_id !== userId) {
            throw new ForbiddenError("You can't access this assessment");
        }

        return assessment;
    }
    /**
     * update assessment by id
     */
    async update(
        data: Partial<NewAssessment>,
        userId: string,
        assessmentId: string,
    ): Promise<Assessment> {
        const assessmentExist = await this.assessmentRepository.findById(assessmentId);
        if (!assessmentExist) {
            throw new NotFoundError('Assessment not found');
        }

        if (assessmentExist.creator_id !== userId) {
            throw new ForbiddenError("You can't update this assessment");
        }
        if (assessmentExist.status !== 'draft') {
            throw new ConflictError('Cannot modify a published or closed assessment');
        }
        const assessment = await this.assessmentRepository.update(data, assessmentExist.id);

        return assessment;
    }
    /**
     * delete assessment service
     */
    async delete(assessmentId: string, userId: string): Promise<Assessment> {
        const assessmentExist = await this.assessmentRepository.findById(assessmentId);
        if (!assessmentExist) {
            throw new NotFoundError('Assessment not found');
        }

        if (assessmentExist.creator_id !== userId) {
            throw new ForbiddenError("You can't delete this assessment");
        }
        if (assessmentExist.status !== 'draft') {
            throw new ConflictError('Cannot delete a published or closed assessment');
        }

        const assessment = await this.assessmentRepository.delete(assessmentExist.id);
        return assessment;
    }

    /**
     * publish assessment service
     */
    async publish(assessmentId: string, userId: string): Promise<Assessment> {
        const assessmentExist = await this.assessmentRepository.findById(assessmentId);
        if (!assessmentExist) {
            throw new NotFoundError('Assessment not found');
        }

        if (assessmentExist.creator_id !== userId) {
            throw new ForbiddenError("You can't publish this assessment");
        }
        if (assessmentExist.status === 'published') {
            throw new ConflictError('Assessment is already published');
        }
        if (assessmentExist.status === 'closed') {
            throw new ConflictError('Assessment is closed and cannot be published');
        }
        if (assessmentExist.status !== 'draft') {
            throw new ConflictError('Unable to publish assessment');
        }

        if (!assessmentExist.title || assessmentExist.title.trim().length < 2) {
            throw new BadRequestError('Assessment must have a valid title');
        }

        const questions = await this.questionRepository.findByAssessmentId(assessmentId);
        if (questions.length === 0) {
            throw new BadRequestError('Assessment must have at least one question');
        }

        for (const question of questions) {
            if (!question.questionText || question.questionText.trim().length === 0) {
                throw new BadRequestError(`Question "${question.id}" is missing question text`);
            }
            if (question.points < 0) {
                throw new BadRequestError(`Question "${question.id}" has invalid points`);
            }

            const options = (question as any).options || [];
            if (question.questionType === 'MULTIPLE_CHOICE') {
                if (options.length < 2) {
                    throw new BadRequestError(`Question "${question.id}" must have at least 2 options`);
                }
                const correctCount = options.filter((o: any) => o.isCorrect).length;
                if (correctCount !== 1) {
                    throw new BadRequestError(`Question "${question.id}" must have exactly 1 correct answer`);
                }
                const hasEmpty = options.some((o: any) => !o.optionText || o.optionText.trim().length === 0);
                if (hasEmpty) {
                    throw new BadRequestError(`Question "${question.id}" has empty option text`);
                }
            }

            if (question.questionType === 'TRUE_FALSE') {
                if (options.length !== 2) {
                    throw new BadRequestError(`Question "${question.id}" must have exactly 2 options for True/False`);
                }
                const correctCount = options.filter((o: any) => o.isCorrect).length;
                if (correctCount !== 1) {
                    throw new BadRequestError(`Question "${question.id}" must have exactly 1 correct answer`);
                }
            }
        }

        const assessment = await this.assessmentRepository.publish(assessmentExist.id);
        return assessment;
    }
    /**
     * close assessment service
     */
    async close(assessmentId: string, userId: string): Promise<Assessment> {
        const assessmentExist = await this.assessmentRepository.findById(assessmentId);
        if (!assessmentExist) {
            throw new NotFoundError('Assessment not found');
        }

        if (assessmentExist.creator_id !== userId) {
            throw new ForbiddenError("You can't close this assessment");
        }
        if (assessmentExist.status !== 'published') {
            throw new ConflictError('Only published assessments can be closed');
        }
        const assessment = await this.assessmentRepository.closed(assessmentExist.id);
        return assessment;
    }

    /**
     * unpublish assessment service (published -> draft)
     */
    async unpublish(assessmentId: string, userId: string): Promise<Assessment> {
        const assessmentExist = await this.assessmentRepository.findById(assessmentId);
        if (!assessmentExist) {
            throw new NotFoundError('Assessment not found');
        }

        if (assessmentExist.creator_id !== userId) {
            throw new ForbiddenError("You can't unpublish this assessment");
        }
        if (assessmentExist.status !== 'published') {
            throw new ConflictError('Only published assessments can be unpublished');
        }
        const assessment = await this.assessmentRepository.unpublish(assessmentExist.id);
        return assessment;
    }

    /**
     * Get participants (attempts) for an assessment — educator only
     */
    async getParticipants(assessmentId: string, userId: string): Promise<{
        id: string;
        studentName: string;
        studentId: string;
        studentEmail: string;
        status: string;
        startedAt: Date;
        submittedAt: Date | null;
    }[]> {
        const assessment = await this.assessmentRepository.findById(assessmentId);
        if (!assessment) {
            throw new NotFoundError('Assessment not found');
        }
        if (assessment.creator_id !== userId) {
            throw new ForbiddenError("You can't access this assessment");
        }

        const attempts = await this.attemptRepository.findAttemptsByAssessmentId(assessmentId);
        return attempts.map((a) => ({
            id: a.id,
            studentName: a.studentName,
            studentId: a.studentId,
            studentEmail: a.studentEmail,
            status: a.status,
            startedAt: a.startedAt,
            submittedAt: a.submittedAt,
        }));
    }

    /**
     * Public lookup by join code — returns published assessment info + question count
     */
    async lookupByJoinCode(joinCode: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        durationMinutes: number;
        questionCount: number;
        totalPoints: number;
        joinCode: string;
    }> {
        const code = joinCode.trim().toUpperCase();
        const assessment = await this.assessmentRepository.findPublishedByJoinCode(code);
        if (!assessment) {
            throw new NotFoundError('Assessment not found or not available');
        }

        const questions = await this.questionRepository.findByAssessmentId(assessment.id);
        const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

        return {
            id: assessment.id,
            title: assessment.title,
            description: assessment.description,
            durationMinutes: assessment.durationMinutes,
            questionCount: questions.length,
            totalPoints,
            joinCode: assessment.joinCode,
        };
    }
}
