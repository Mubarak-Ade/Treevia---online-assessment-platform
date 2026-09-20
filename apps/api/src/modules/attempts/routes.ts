import { Router } from 'express';
import { AttemptController } from './controller.js';
import { validateBody, validateParams } from '../../shared/validation/index.js';
import { createAttemptSchema, saveAnswerSchema, bulkSaveAnswersSchema } from '@treevia/validation';
import { attemptParamsSchema } from './schema.js';
import { requireAttemptAuth } from '../../shared/middleware/attempt.middleware.js';

export const attemptRouter = Router();
const attemptController = new AttemptController();

attemptRouter.post('/', validateBody(createAttemptSchema), attemptController.create);

attemptRouter.get('/:attemptId', requireAttemptAuth, validateParams(attemptParamsSchema), attemptController.getAttempt);
attemptRouter.get('/:attemptId/questions', requireAttemptAuth, validateParams(attemptParamsSchema), attemptController.getQuestions);
attemptRouter.get('/:attemptId/answers', requireAttemptAuth, validateParams(attemptParamsSchema), attemptController.getAnswers);

attemptRouter.patch('/:attemptId/answers', requireAttemptAuth, validateParams(attemptParamsSchema), validateBody(saveAnswerSchema), attemptController.saveAnswer);
attemptRouter.patch('/:attemptId/answers/bulk', requireAttemptAuth, validateParams(attemptParamsSchema), validateBody(bulkSaveAnswersSchema), attemptController.bulkSaveAnswers);

attemptRouter.post('/:attemptId/submit', requireAttemptAuth, validateParams(attemptParamsSchema), attemptController.submit);
