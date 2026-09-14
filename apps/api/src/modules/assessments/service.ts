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
import { generateJoinCode } from '../../shared/utils/generate_joincode.js';
import { v7 as uuid } from 'uuid';
import { sql } from 'drizzle-orm';

export class AssessmentService {
    private assessmentRepository: IAssessmentRepository;
    private authRepository: IAuthRepository;

    constructor(
        assessmentRepository: IAssessmentRepository = new AssessmentRepository(),
        authRepository: IAuthRepository = new AuthRepository(),
    ) {
        this.assessmentRepository = assessmentRepository;
        this.authRepository = authRepository;
    }

    private async generateUniqueJoinCode(): Promise<string> {
        const code = generateJoinCode();

        const existing = await this.assessmentRepository.findByJoinCode(code);

        if (!existing) {
            return generateJoinCode();
        }

        return code;
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
            throw new ConflictError('assessment already publish');
        }
        if (assessmentExist.status === 'closed') {
            throw new ConflictError('assessment is close, cant be publish');
        }
        if (assessmentExist.status !== 'draft') {
            throw new ConflictError('Unable to publish accessment');
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
            throw new ForbiddenError("You can't access this assessment");
        }
        if (assessmentExist.status !== 'published') {
            throw new ConflictError('cant close unpublish assessment');
        }
        const assessment = await this.assessmentRepository.publish(assessmentExist.id);
        return assessment;
    }
}
