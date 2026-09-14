import { Router } from 'express';
import { QuestionController } from './controller.js';
import { validateBody, validateParams } from '../../shared/validation/index.js';
import { questionSchema, questionUpdateSchema, questionReorderSchema, questionParamsSchema } from './schema.js';

export const questionRouter = Router();
const questionController = new QuestionController();

questionRouter.get('/:assessmentId/questions', questionController.getQuestions);
questionRouter.post('/:assessmentId/questions', validateBody(questionSchema), questionController.createQuestion);
questionRouter.put('/:assessmentId/questions/:questionId', validateParams(questionParamsSchema), validateBody(questionUpdateSchema), questionController.updateQuestion);
questionRouter.delete('/:assessmentId/questions/:questionId', validateParams(questionParamsSchema), questionController.deleteQuestion);
questionRouter.patch('/:assessmentId/questions/reorder', validateParams(questionParamsSchema), validateBody(questionReorderSchema), questionController.reorderQuestions);
