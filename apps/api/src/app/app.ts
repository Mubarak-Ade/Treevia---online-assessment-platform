import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Request, type Response, type NextFunction } from 'express';
import helmet from 'helmet';
import { env } from '../config/env.js';
import { authRouter } from '../modules/auth/routes.js';
import { AppError } from '../shared/errors/index.js';
import { httpLogger } from '../shared/logger/index.js';
import { assessmentRouter } from '../modules/assessments/routes.js';
import { questionRouter } from '../modules/questions/routes.js';
import { attemptRouter } from '../modules/attempts/routes.js';
import { requireAuth } from '../shared/middleware/auth.middleware.js';
import { AssessmentController } from '../modules/assessments/controller.js';
import { validateParams } from '../shared/validation/index.js';
import { joinCodeParamsSchema } from '../modules/assessments/schema.js';

export const app = express();

const assessmentController = new AssessmentController();

app.use(helmet());
app.use(httpLogger);

app.use(
    cors({
        origin: env.WEB_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/assessments/join/:joinCode', validateParams(joinCodeParamsSchema), assessmentController.lookup);
app.use('/api/v1/assessments', requireAuth, assessmentRouter);
app.use('/api/v1/assessments/:assessmentId/questions', requireAuth, questionRouter);
app.use('/api/v1/attempts', attemptRouter);

app.use((_req: Request, res: Response) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'Requested resource was not found',
        },
    });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
            },
        });
    }

    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            error: {
                code: 'INVALID_JSON',
                message: 'Malformed JSON payload in request body',
            },
        });
    }

    console.error('Unhandled Server Error:', err);

    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: env.isProduction
                ? 'An unexpected error occurred. Please try again later.'
                : err.message || 'Internal Server Error',
        },
    });
});
