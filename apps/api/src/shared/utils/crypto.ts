import argon2 from 'argon2';
import crypto from 'node:crypto';
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';
import { env } from '../../config/env.js';

export interface AccessTokenClaims extends JWTPayload {
    sub: string;
    email: string;
    role: string;
}

const secretKey = new TextEncoder().encode(env.JWT_ACCESS_SECRET);

/**
 * Hashes a plaintext password using Argon2id.
 */
export async function hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536, // 64 MB
        timeCost: 3,
        parallelism: 4,
    });
}

/**
 * Verifies a plaintext password against an Argon2id hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
        return await argon2.verify(hash, password);
    } catch {
        return false;
    }
}

/**
 * Creates a SHA-256 hash of a token string (used for refresh tokens and attempt tokens).
 */
export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generates a cryptographically secure random hexadecimal token.
 */
export function generateSecureToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Signs a short-lived JWT access token for an authenticated user.
 */
export async function createAccessToken(payload: {
    sub: string;
    email: string;
    role: string;
}): Promise<string> {
    return await new SignJWT({
        email: payload.email,
        role: payload.role,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(payload.sub)
        .setIssuedAt()
        .setExpirationTime(env.JWT_ACCESS_EXPIRES_IN)
        .sign(secretKey);
}

/**
 * Verifies and decodes a JWT access token.
 */
export async function verifyAccessToken(token: string): Promise<AccessTokenClaims> {
    const { payload } = await jwtVerify(token, secretKey, {
        algorithms: ['HS256'],
    });

    if (!payload.sub || typeof payload.email !== 'string' || typeof payload.role !== 'string') {
        throw new Error('Invalid token claims structure');
    }

    return payload as AccessTokenClaims;
}
