import { User, NewUser, UserRole } from '../../shared/db/schema/users.js';
import { Session, NewSession } from '../../shared/db/schema/sessions.js';

export type SanitizedUser = Omit<User, 'passwordHash'>;

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResult {
    user: SanitizedUser;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshResult {
    accessToken: string;
    refreshToken: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    role?: UserRole;
}

export interface ClientMeta {
    userAgent?: string;
    ipAddress?: string;
}

export interface IAuthRepository {
    create(data: NewUser): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    existsByEmail(email: string): Promise<boolean>;
    update(id: string, data: UpdateUserDTO): Promise<User | null>;
    updatePassword(id: string, passwordHash: string): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    count(): Promise<number>;
}

export interface ISessionRepository {
    create(data: NewSession): Promise<Session>;
    findById(id: string): Promise<Session | null>;
    findByTokenHash(tokenHash: string): Promise<Session | null>;
    findValidByTokenHash(tokenHash: string): Promise<Session | null>;
    updateTokenHash(id: string, tokenHash: string, expiresAt: Date): Promise<Session | null>;
    revoke(id: string): Promise<boolean>;
    revokeAllByUserId(userId: string): Promise<number>;
    deleteExpired(): Promise<number>;
}
