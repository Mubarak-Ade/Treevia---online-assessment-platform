import { type Request, type Response, type NextFunction } from 'express';
import { verifyAccessToken } from '../utils/crypto.js';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';
import { UserRole } from '../db/schema/users.js';

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: UserRole;
}

// Augment Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
            attemptAuth?: {
                attemptId: string;
                tokenHash: string;
            };
        }
    }
}

/**
 * Middleware that authenticates an educator using a Bearer JWT access token.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedError('Missing or malformed authorization token'));
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
        return next(new UnauthorizedError('Access token is required'));
    }

    try {
        const claims = await verifyAccessToken(token);

        req.user = {
            id: claims.sub,
            email: claims.email,
            role: claims.role as UserRole,
        };

        next();
    } catch (error: any) {
        if (error?.code === 'ERR_JWT_EXPIRED') {
            return next(
                new UnauthorizedError('Access token has expired', { code: 'TOKEN_EXPIRED' }),
            );
        }
        return next(new UnauthorizedError('Invalid or malformed access token'));
    }
}

/**
 * Middleware that restricts access to specific user roles.
 */
export function requireRole(...roles: UserRole[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new UnauthorizedError('Authentication required'));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ForbiddenError('You do not have permission to access this resource'));
        }

        next();
    };
}
