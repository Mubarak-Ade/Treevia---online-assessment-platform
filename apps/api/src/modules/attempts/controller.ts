import { type Request, type Response, type NextFunction } from 'express';
import { AttemptService } from './service.js';

export class AttemptController {
    private attemptService: AttemptService;

    constructor(attemptService: AttemptService = new AttemptService()) {
        this.attemptService = attemptService;
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.attemptService.createAttempt(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    getAttempt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const attemptId = req.attemptAuth!.attemptId;
            const result = await this.attemptService.getAttempt(attemptId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const attemptId = req.attemptAuth!.attemptId;
            const result = await this.attemptService.getAttemptQuestions(attemptId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getAnswers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const attemptId = req.attemptAuth!.attemptId;
            const result = await this.attemptService.getAttemptAnswers(attemptId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    saveAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const attemptId = req.attemptAuth!.attemptId;
            const { questionId, selectedOptionId } = req.body;
            await this.attemptService.saveAnswer(attemptId, questionId, selectedOptionId);
            res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    bulkSaveAnswers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const attemptId = req.attemptAuth!.attemptId;
            const { answers } = req.body;
            await this.attemptService.bulkSaveAnswers(attemptId, answers);
            res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    };

    submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const attemptId = req.attemptAuth!.attemptId;
            const result = await this.attemptService.submitAttempt(attemptId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}
