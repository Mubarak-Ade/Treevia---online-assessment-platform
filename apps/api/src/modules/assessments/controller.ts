import { type Request, type Response, type NextFunction } from 'express';
import { AssessmentService } from './service.js';

export class AssessmentController {
    private assessmentService: AssessmentService;

    constructor(assessmentService: AssessmentService = new AssessmentService()) {
        this.assessmentService = assessmentService;
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const body = req.body;
            const userId = req.user!.id;
            const result = await this.assessmentService.create(body, userId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };
    findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.id;
            const result = await this.assessmentService.findAll(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
    findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const assessmentId = req.params.id as string;
            const userId = req.user!.id;
            const result = await this.assessmentService.findById(assessmentId, userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const assessmentId = req.params.id as string;
            const userId = req.user!.id;
            const result = await this.assessmentService.update(req.body, userId, assessmentId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const assessmentId = req.params.id as string;
            const userId = req.user!.id;
            const result = await this.assessmentService.delete(assessmentId, userId);
            res.status(204).json(result);
        } catch (error) {
            next(error);
        }
    };

    publish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const assessmentId = req.params.id as string;
            const userId = req.user!.id;
            const result = await this.assessmentService.publish(assessmentId, userId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    close = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const assessmentId = req.params.id as string;
            const userId = req.user!.id;
            const result = await this.assessmentService.close(assessmentId, userId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };
}
