import { Router } from 'express';
import { QuestionController } from './controller.js';
import { validateBody, validateParams } from '../../shared/validation/index.js';
import { questionSchema, questionUpdateSchema, questionReorderSchema, questionParamsSchema } from './schema.js';

export const questionRouter = Router({mergeParams: true});
const questionController = new QuestionController();

questionRouter.get('/', questionController.getQuestions);
questionRouter.post('/', validateBody(questionSchema), questionController.createQuestion);
questionRouter.get('/:questionId', validateParams(questionParamsSchema), questionController.getQuestion);
questionRouter.put('/:questionId', validateParams(questionParamsSchema), validateBody(questionUpdateSchema), questionController.updateQuestion);
questionRouter.delete('/:questionId', validateParams(questionParamsSchema), questionController.deleteQuestion);
questionRouter.patch('/reorder', validateBody(questionReorderSchema), questionController.reorderQuestions);
