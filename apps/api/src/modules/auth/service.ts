import { v7 as uuid } from 'uuid';
import { env } from '../../config/env.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../shared/errors/index.js';
import {
    createAccessToken,
    generateSecureToken,
    hashPassword,
    hashToken,
    verifyPassword,
} from '../../shared/utils/crypto.js';
import { AuthRepository } from './repository.js';
import { SessionRepository } from './session.repository.js';
import {
    AuthResult,
    ClientMeta,
    IAuthRepository,
    ISessionRepository,
    LoginDTO,
    RefreshResult,
    RegisterDTO,
    SanitizedUser,
} from './types.js';

export class AuthService {
    private authRepository: IAuthRepository;
    private sessionRepository: ISessionRepository;

    constructor(
        authRepository: IAuthRepository = new AuthRepository(),
        sessionRepository: ISessionRepository = new SessionRepository(),
    ) {
        this.authRepository = authRepository;
        this.sessionRepository = sessionRepository;
    }

    private sanitizeUser(user: {
        id: string;
        name: string;
        email: string;
        role: 'educator' | 'admin';
        createdAt: Date;
        updatedAt: Date;
    }): SanitizedUser {
        const { id, name, email, role, createdAt, updatedAt } = user;
        return { id, name, email, role, createdAt, updatedAt };
    }

    /**
     * Registers a new educator account, creates an active session, and returns access/refresh tokens.
     */
    async register(data: RegisterDTO, clientMeta: ClientMeta = {}): Promise<AuthResult> {
        const exists = await this.authRepository.existsByEmail(data.email);
        if (exists) {
            throw new ConflictError('An account with this email address already exists');
        }

        const passwordHash = await hashPassword(data.password);
        const userId = uuid();

        const user = await this.authRepository.create({
            id: userId,
            name: data.name,
            email: data.email,
            passwordHash,
            role: 'educator',
        });

        const rawRefreshToken = generateSecureToken(32);
        const refreshTokenHash = hashToken(rawRefreshToken);
        const expiresAt = new Date(
            Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
        );

        await this.sessionRepository.create({
            id: uuid(),
            userId: user.id,
            refreshTokenHash,
            userAgent: clientMeta.userAgent,
            ipAddress: clientMeta.ipAddress,
            expiresAt,
        });

        const accessToken = await createAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: this.sanitizeUser(user),
            accessToken,
            refreshToken: rawRefreshToken,
        };
    }

    /**
     * Authenticates an educator by email and password, creates a session, and returns tokens.
     */
    async login(data: LoginDTO, clientMeta: ClientMeta = {}): Promise<AuthResult> {
        const user = await this.authRepository.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const isValidPassword = await verifyPassword(data.password, user.passwordHash);
        if (!isValidPassword) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const rawRefreshToken = generateSecureToken(32);
        const refreshTokenHash = hashToken(rawRefreshToken);
        const expiresAt = new Date(
            Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
        );

        await this.sessionRepository.create({
            id: uuid(),
            userId: user.id,
            refreshTokenHash,
            userAgent: clientMeta.userAgent,
            ipAddress: clientMeta.ipAddress,
            expiresAt,
        });

        const accessToken = await createAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: this.sanitizeUser(user),
            accessToken,
            refreshToken: rawRefreshToken,
        };
    }

    /**
     * Validates an existing refresh token, rotates it with a new one, and generates a new access token.
     */
    async refresh(rawRefreshToken: string, _clientMeta: ClientMeta = {}): Promise<RefreshResult> {
        if (!rawRefreshToken) {
            throw new UnauthorizedError('Refresh token is required');
        }

        const tokenHash = hashToken(rawRefreshToken);
        const session = await this.sessionRepository.findValidByTokenHash(tokenHash);

        if (!session) {
            throw new UnauthorizedError('Session is invalid or has expired. Please log in again.');
        }

        const user = await this.authRepository.findById(session.userId);
        if (!user) {
            await this.sessionRepository.revoke(session.id);
            throw new UnauthorizedError('User account not found');
        }

        // Rotate refresh token
        const newRawRefreshToken = generateSecureToken(32);
        const newRefreshTokenHash = hashToken(newRawRefreshToken);
        const newExpiresAt = new Date(
            Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
        );

        await this.sessionRepository.updateTokenHash(session.id, newRefreshTokenHash, newExpiresAt);

        const accessToken = await createAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            accessToken,
            refreshToken: newRawRefreshToken,
        };
    }

    /**
     * Revokes the current session by refresh token.
     */
    async logout(rawRefreshToken?: string): Promise<void> {
        if (!rawRefreshToken) {
            return;
        }

        const tokenHash = hashToken(rawRefreshToken);
        const session = await this.sessionRepository.findByTokenHash(tokenHash);

        if (session) {
            await this.sessionRepository.revoke(session.id);
        }
    }

    /**
     * Returns sanitized user information by user ID.
     */
    async getMe(userId: string): Promise<SanitizedUser> {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        return this.sanitizeUser(user);
    }
}
