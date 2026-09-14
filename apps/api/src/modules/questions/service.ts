import { BadRequestError, ForbiddenError, NotFoundError, ConflictError } from '@treevia/shared';
import { Question, NewQuestion, QuestionOption } from '../../shared/db/schema/questions.js';
import { IQuestionRepository } from './types.js';
import { IAssessmentRepository } from '../assessments/types.js';
import { AssessmentRepository } from '../assessments/repository.js';
import { QuestionRepository } from './repository.js';

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

    async createQuestion(assessmentId: string, userId: string, data: NewQuestion, options: QuestionOption[]): Promise<Question> {
        await this.checkOwnership(assessmentId, userId);
        this.validateOptions(data.questionType, options);
        return this.questionRepository.create(data, options);
    }

    async updateQuestion(questionId: string, userId: string, assessmentId: string, data: Partial<NewQuestion>, options?: QuestionOption[]): Promise<Question> {
        const question = await this.questionRepository.findById(questionId);
        if (!question) {
            throw new NotFoundError('Question not found');
        }
        if (question.assessmentId !== assessmentId) {
            throw new ForbiddenError("You can't update questions in this assessment");
        }
        if (options) {
            this.validateOptions(data.questionType || question.questionType, options);
        }
        return this.questionRepository.update(data, questionId);
    }

    async deleteQuestion(questionId: string, userId: string, assessmentId: string): Promise<void> {
        const question = await this.questionRepository.findById(questionId);
        if (!question) {
            throw new NotFoundError('Question not found');
        }
        if (question.assessmentId !== assessmentId) {
            throw new ForbiddenError("You can't delete questions in this assessment");
        }
        await this.questionRepository.delete(questionId);
    }

    async reorderQuestions(assessmentId: string, userId: string, order: string[]): Promise<void> {
        await this.checkOwnership(assessmentId, userId);
        await this.questionRepository.reorder(assessmentId, order);
    }

    private async checkOwnership(assessmentId: string, userId: string): Promise<void> {
        const assessment = await this.assessmentRepository.findById(assessmentId);
        if (!assessment) {
            throw new NotFoundError('Assessment not found');
        }
        if (assessment.creator_id !== userId) {
            throw new ForbiddenError("You can't access this assessment");
        }
    }

    private validateOptions(questionType: string, options: QuestionOption[]): void {
        if (questionType === 'MULTIPLE_CHOICE') {
            if (options.length < 2) {
                throw new BadRequestError('Multiple choice questions must have at least 2 options');
            }
            const correctCount = options.filter((o) => o.isCorrect).length;
            if (correctCount !== 1) {
                throw new ConflictError('Multiple choice questions must have exactly 1 correct answer');
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
