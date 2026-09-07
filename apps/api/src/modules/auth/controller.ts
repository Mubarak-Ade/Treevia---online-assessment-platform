import { type Request, type Response, type NextFunction } from 'express';
import { env } from '../../config/env.js';
import { AuthService } from './service.js';
import { ClientMeta } from './types.js';

const REFRESH_COOKIE_NAME = 'refreshToken';

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService = new AuthService()) {
        this.authService = authService;
    }

    private extractClientMeta(req: Request): ClientMeta {
        return {
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip || req.socket.remoteAddress,
        };
    }

    private setRefreshCookie(res: Response, token: string) {
        res.cookie(REFRESH_COOKIE_NAME, token, {
            httpOnly: true,
            secure: env.isProduction,
            sameSite: env.isProduction ? 'strict' : 'lax',
            maxAge: env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
            path: '/api/v1/auth',
        });
    }

    private clearRefreshCookie(res: Response) {
        res.clearCookie(REFRESH_COOKIE_NAME, {
            httpOnly: true,
            secure: env.isProduction,
            sameSite: env.isProduction ? 'strict' : 'lax',
            path: '/api/v1/auth',
        });
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clientMeta = this.extractClientMeta(req);
            const result = await this.authService.register(req.body, clientMeta);

            this.setRefreshCookie(res, result.refreshToken);

            res.status(201).json({
                user: result.user,
                accessToken: result.accessToken,
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clientMeta = this.extractClientMeta(req);
            const result = await this.authService.login(req.body, clientMeta);

            this.setRefreshCookie(res, result.refreshToken);

            res.status(200).json({
                user: result.user,
                accessToken: result.accessToken,
            });
        } catch (error) {
            next(error);
        }
    };

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

            const clientMeta = this.extractClientMeta(req);
            const result = await this.authService.refresh(refreshToken, clientMeta);

            this.setRefreshCookie(res, result.refreshToken);

            res.status(200).json({
                accessToken: result.accessToken,
            });
        } catch (error) {
            this.clearRefreshCookie(res);
            next(error);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

            await this.authService.logout(refreshToken);
            this.clearRefreshCookie(res);

            res.status(200).json({
                message: 'Logged out successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    getMe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const user = await this.authService.getMe(userId);

            res.status(200).json({
                user,
            });
        } catch (error) {
            next(error);
        }
    };
}
