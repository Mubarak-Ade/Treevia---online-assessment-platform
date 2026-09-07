import { and, eq, gt, isNull, lt } from 'drizzle-orm';
import { db } from '../../shared/db/index.js';
import { NewSession, Session, sessions } from '../../shared/db/schema/sessions.js';
import { ISessionRepository } from './types.js';

export class SessionRepository implements ISessionRepository {
    async create(data: NewSession): Promise<Session> {
        const [session] = await db.insert(sessions).values(data).returning();
        return session;
    }

    async findById(id: string): Promise<Session | null> {
        const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
        return session ?? null;
    }

    async findByTokenHash(tokenHash: string): Promise<Session | null> {
        const [session] = await db
            .select()
            .from(sessions)
            .where(eq(sessions.refreshTokenHash, tokenHash));
        return session ?? null;
    }

    /**
     * Finds a session that is neither revoked nor expired.
     */
    async findValidByTokenHash(tokenHash: string): Promise<Session | null> {
        const now = new Date();
        const [session] = await db
            .select()
            .from(sessions)
            .where(
                and(
                    eq(sessions.refreshTokenHash, tokenHash),
                    isNull(sessions.revokedAt),
                    gt(sessions.expiresAt, now),
                ),
            );
        return session ?? null;
    }

    /**
     * Rotates the refresh token hash and updates expiration for an existing session.
     */
    async updateTokenHash(id: string, tokenHash: string, expiresAt: Date): Promise<Session | null> {
        const [updated] = await db
            .update(sessions)
            .set({
                refreshTokenHash: tokenHash,
                expiresAt,
                updatedAt: new Date(),
            })
            .where(eq(sessions.id, id))
            .returning();
        return updated ?? null;
    }

    /**
     * Revokes a specific session.
     */
    async revoke(id: string): Promise<boolean> {
        const [revoked] = await db
            .update(sessions)
            .set({
                revokedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(sessions.id, id))
            .returning({ id: sessions.id });
        return Boolean(revoked);
    }

    /**
     * Revokes all active sessions for a user (e.g., on password reset or account compromise).
     */
    async revokeAllByUserId(userId: string): Promise<number> {
        const revoked = await db
            .update(sessions)
            .set({
                revokedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)))
            .returning({ id: sessions.id });
        return revoked.length;
    }

    /**
     * Cleanup job to purge expired sessions.
     */
    async deleteExpired(): Promise<number> {
        const deleted = await db
            .delete(sessions)
            .where(lt(sessions.expiresAt, new Date()))
            .returning({ id: sessions.id });
        return deleted.length;
    }
}
