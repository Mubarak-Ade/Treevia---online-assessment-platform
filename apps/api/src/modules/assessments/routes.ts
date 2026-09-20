import { Router } from 'express';
import { AssessmentController } from './controller.js';
import { validateBody, validateParams } from '../../shared/validation/index.js';
import { assessmentSchema } from '@treevia/validation';
import { assessmentParamsSchema } from './schema.js';
import { assessmentUpdateSchema } from '@treevia/validation/src/assessment.js';
import { requireRole } from '../../shared/middleware/auth.middleware.js';

export const assessmentRouter = Router({mergeParams: true});
const assessmentController = new AssessmentController();

assessmentRouter.post('/', validateBody(assessmentSchema), requireRole('educator', 'admin'), assessmentController.create);
assessmentRouter.get('/', assessmentController.findAll);
assessmentRouter.get('/:id', validateParams(assessmentParamsSchema), assessmentController.findById)
assessmentRouter.put('/:id', validateParams(assessmentParamsSchema), validateBody(assessmentUpdateSchema), assessmentController.update)
assessmentRouter.delete('/:id', validateParams(assessmentParamsSchema), assessmentController.delete)
assessmentRouter.patch('/:id/publish', validateParams(assessmentParamsSchema), assessmentController.publish)
assessmentRouter.patch('/:id/unpublish', validateParams(assessmentParamsSchema), assessmentController.unpublish)
assessmentRouter.patch('/:id/close', validateParams(assessmentParamsSchema), assessmentController.close)
assessmentRouter.get('/:id/participants', validateParams(assessmentParamsSchema), assessmentController.participants)
