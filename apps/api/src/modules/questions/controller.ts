import { type Request, type Response, type NextFunction } from 'express';
import { QuestionService } from './service.js';

export class QuestionController {
    private questionService: QuestionService;

    constructor(questionService: QuestionService = new QuestionService()) {
        this.questionService = questionService;
    }

    getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const assessmentId = req.params.assessmentId as string;
            const userId = req.user!.id;
            const result = await this.questionService.getQuestions(assessmentId, userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const assessmentId = req.params.assessmentId as string;
            const userId = req.user!.id;
            const body = req.body;
            const result = await this.questionService.createQuestion(assessmentId, userId, body, body.options);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    updateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const questionId = req.params.questionId as string;
            const userId = req.user!.id;
            const assessmentId = req.params.assessmentId as string;
            const body = req.body;
            const result = await this.questionService.updateQuestion(questionId, userId, assessmentId, body, body.options);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const questionId = req.params.questionId as string;
            const userId = req.user!.id;
            const assessmentId = req.params.assessmentId as string;
            await this.questionService.deleteQuestion(questionId, userId, assessmentId);
            res.status(204).json({});
        } catch (error) {
            next(error);
        }
    };

    reorderQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const assessmentId = req.params.assessmentId as string;
            const userId = req.user!.id;
            const result = await this.questionService.reorderQuestions(assessmentId, userId, req.body.order);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}
