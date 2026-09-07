import { type Request, type Response, type NextFunction } from 'express';
import { type ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../errors/index.js';

export function validateBody<T>(schema: ZodSchema<T>) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formatted = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                next(new ValidationError('Invalid request body', formatted));
            } else {
                next(error);
            }
        }
    };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.query = (await schema.parseAsync(req.query)) as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formatted = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                next(new ValidationError('Invalid query parameters', formatted));
            } else {
                next(error);
            }
        }
    };
}

export function validateParams<T>(schema: ZodSchema<T>) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.params = (await schema.parseAsync(req.params)) as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formatted = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                next(new ValidationError('Invalid URL parameters', formatted));
            } else {
                next(error);
            }
        }
    };
}
