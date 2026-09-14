import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';
import { authRateLimiter } from '../../shared/middleware/rate-limiter.middleware.js';
import { validateBody } from '../../shared/validation/index.js';
import { AuthController } from './controller.js';
import { loginSchema, refreshTokenSchema, registerSchema } from './schema.js';

export const authRouter = Router();
const authController = new AuthController();

authRouter.post(
    '/register',
    authRateLimiter,
    validateBody(registerSchema),
    authController.register,
);

authRouter.post('/login', authRateLimiter, validateBody(loginSchema), authController.login);

authRouter.post(
    '/refresh',
    authRateLimiter,
    authController.refresh,
);

authRouter.post('/logout', authController.logout);

authRouter.get('/me', requireAuth, authController.getMe);
