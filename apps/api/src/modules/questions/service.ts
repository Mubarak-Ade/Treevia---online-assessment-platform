import { BadRequestError, ForbiddenError, NotFoundError, ConflictError } from '@treevia/shared';
import { Question, NewQuestion, QuestionOption } from '../../shared/db/schema/questions.js';
import { IQuestionRepository } from './types.js';
import { IAssessmentRepository } from '../assessments/types.js';
import { AssessmentRepository } from '../assessments/repository.js';
import { QuestionRepository } from './repository.js';
import { v7 as uuid } from 'uuid';
import { db } from '../../shared/db/index.js';

export class QuestionService {
    private questionRepository: IQuestionRepository;
    private assessmentRepository: IAssessmentRepository;

    constructor(
        questionRepository: IQuestionRepository = new QuestionRepository(),
        assessmentRepository: IAssessmentRepository = new AssessmentRepository(),
    ) {
        this.questionRepository = questionRepository;
        this.assessmentRepository = assessmentRepository;
    }

    async getQuestions(assessmentId: string, userId: string): Promise<Question[]> {
        await this.checkOwnership(assessmentId, userId);
        return this.questionRepository.findByAssessmentId(assessmentId);
    }

    async getQuestion(assessmentId: string, userId: string, questionId: string): Promise<Question> {
        await this.checkOwnership(assessmentId, userId);
        const question = await this.questionRepository.findById(questionId, assessmentId);
        if (!question) {
            throw new NotFoundError('Question not found');
        }
        return question;
    }

    async createQuestion(
        assessmentId: string,
        userId: string,
        data: NewQuestion,
        options: QuestionOption[],
    ): Promise<Question> {
        const assessment = await this.checkOwnership(assessmentId, userId);
        if (assessment.status !== 'draft') {
            throw new ConflictError('Cannot modify questions on a published or closed assessment');
        }

        return db.transaction(async (tx) => {
            const question = await this.questionRepository.create(tx, {
                ...data,
                assessmentId,
                id: uuid(),
            });

            if (!question) {
                throw new BadRequestError('Failed to create question');
            }

            const optionValues = options.map((option) => ({
                ...option,
                id: uuid(),
                questionId: question.id,
            }));

            this.validateOptions(data.questionType, optionValues);

            const createdOptions = await this.questionRepository.addOptions(tx, optionValues);

            if (createdOptions.length === 0) {
                throw new BadRequestError('Failed to create question options');
            }

            const questionAndOptions = await this.questionRepository.findById(question.id, assessmentId, tx) as Question

            return questionAndOptions;
        });
    }


    async updateQuestion(
        questionId: string,
        userId: string,
        assessmentId: string,
        data: Partial<NewQuestion>,
        options?: QuestionOption[],
    ): Promise<Question> {
        const assessment = await this.checkOwnership(assessmentId, userId);
        if (assessment.status !== 'draft') {
            throw new ConflictError('Cannot modify questions on a published or closed assessment');
        }

        const question = await this.questionRepository.findById(questionId, assessmentId);
        if (!question) {
            throw new NotFoundError('Question not found');
        }
        if (question.assessmentId !== assessmentId) {
            throw new ForbiddenError("You can't update questions in this assessment");
        }
        if (options) {
            this.validateOptions(data.questionType || question.questionType, options);
        }

        return db.transaction(async (tx) => {
            await this.questionRepository.update(data, questionId, tx);

            if (options) {
                const optionValues = options.map((option) => ({
                    ...option,
                    id: option.id || uuid(),
                    questionId,
                }));
                await this.questionRepository.replaceOptions(questionId, optionValues, tx);
            }

            const result = await this.questionRepository.findById(questionId, assessmentId, tx) as Question;
            return result;
        });
    }

    async deleteQuestion(questionId: string, userId: string, assessmentId: string): Promise<void> {
        const assessment = await this.checkOwnership(assessmentId, userId);
        if (assessment.status !== 'draft') {
            throw new ConflictError('Cannot modify questions on a published or closed assessment');
        }

        const question = await this.questionRepository.findById(questionId, assessmentId);
        if (!question) {
            throw new NotFoundError('Question not found');
        }
        if (question.assessmentId !== assessmentId) {
            throw new ForbiddenError("You can't delete questions in this assessment");
        }
        await this.questionRepository.delete(questionId);
    }

    async reorderQuestions(assessmentId: string, userId: string, questions: { id: string; position: number }[]): Promise<void> {
        const assessment = await this.checkOwnership(assessmentId, userId);
        if (assessment.status !== 'draft') {
            throw new ConflictError('Cannot reorder questions on a published or closed assessment');
        }
        await this.questionRepository.reorder(assessmentId, questions);
    }

    private async checkOwnership(assessmentId: string, userId: string) {
        const assessment = await this.assessmentRepository.findById(assessmentId);
        if (!assessment) {
            throw new NotFoundError('Assessment not found');
        }
        if (assessment.creator_id !== userId) {
            throw new ForbiddenError("You can't access this assessment");
        }
        return assessment;
    }

    private validateOptions(questionType: string, options: QuestionOption[]): void {
        if (questionType === 'MULTIPLE_CHOICE') {
            if (options.length < 2) {
                throw new BadRequestError('Multiple choice questions must have at least 2 options');
            }
            const correctCount = options.filter((o) => o.isCorrect).length;
            if (correctCount !== 1) {
                throw new ConflictError(
                    'Multiple choice questions must have exactly 1 correct answer',
                );
            }
        } else if (questionType === 'TRUE_FALSE') {
            if (options.length !== 2) {
                throw new BadRequestError('True/False questions must have exactly 2 options');
            }
            const correctCount = options.filter((o) => o.isCorrect).length;
            if (correctCount !== 1) {
                throw new ConflictError('True/False questions must have exactly 1 correct answer');
            }
        }
    }
}
