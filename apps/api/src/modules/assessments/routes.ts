import { Router } from 'express';
import { AssessmentController } from './controller.js';
import { validateBody, validateParams } from '../../shared/validation/index.js';
import { assessmentSchema } from '@treevia/validation';
import { assessmentParamsSchema } from './schema.js';
import { assessmentUpdateSchema } from '@treevia/validation/src/assessment.js';

export const assessmentRouter = Router();
const assessmentController = new AssessmentController();
assessmentRouter.post('/', validateBody(assessmentSchema), assessmentController.create);
assessmentRouter.get('/', assessmentController.findAll);
assessmentRouter.get('/:id', validateParams(assessmentParamsSchema), assessmentController.findById)
assessmentRouter.put('/:id', validateParams(assessmentParamsSchema), validateBody(assessmentUpdateSchema), assessmentController.update)
assessmentRouter.delete('/:id', validateParams(assessmentParamsSchema), assessmentController.delete)
assessmentRouter.patch('/publish/:id', validateParams(assessmentParamsSchema), assessmentController.publish)
assessmentRouter.patch('/close/:id', validateParams(assessmentParamsSchema), assessmentController.close)
