export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: unknown;

    constructor(code: string, message: string, statusCode: number = 500, details?: unknown) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = true;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request', details?: unknown) {
        super('BAD_REQUEST', message, 400, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Authentication required', details?: unknown) {
        super('UNAUTHORIZED', message, 401, details);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Access denied', details?: unknown) {
        super('FORBIDDEN', message, 403, details);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found', details?: unknown) {
        super('NOT_FOUND', message, 404, details);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource conflict', details?: unknown) {
        super('CONFLICT', message, 409, details);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed', details?: unknown) {
        super('VALIDATION_ERROR', message, 422, details);
    }
}
