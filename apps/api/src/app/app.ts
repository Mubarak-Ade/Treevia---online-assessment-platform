import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Request, type Response, type NextFunction } from 'express';
import helmet from 'helmet';
import { env } from '../config/env.js';
import { authRouter } from '../modules/auth/routes.js';
import { AppError } from '../shared/errors/index.js';
import { httpLogger } from '../shared/logger/index.js';

export const app = express();

// Security headers
app.use(helmet());

// HTTP request logger
app.use(httpLogger);

// CORS with credential support for cookies
app.use(
    cors({
        origin: env.WEB_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
);

// Body and Cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));

// API Routes
app.use('/api/v1/auth', authRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'Requested resource was not found',
        },
    });
});

// Centralized Error Handler
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

    // Express JSON parse error
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            error: {
                code: 'INVALID_JSON',
                message: 'Malformed JSON payload in request body',
            },
        });
    }

    // Unexpected internal errors
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
