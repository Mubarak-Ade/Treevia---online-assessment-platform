import { and, eq, sql } from 'drizzle-orm';
import { db } from '../../shared/db/index.js';
import {
    attempts,
    attemptAnswers,
    type Attempt,
    type NewAttempt,
    type AttemptAnswer,
    type NewAttemptAnswer,
} from '../../shared/db/schema/attempts.js';
import { IAttemptRepository } from './types.js';

export class AttemptRepository implements IAttemptRepository {
    async create(data: NewAttempt): Promise<Attempt> {
        const [attempt] = await db.insert(attempts).values(data).returning();
        return attempt;
    }

    async findById(id: string): Promise<Attempt | null> {
        const [attempt] = await db
            .select()
            .from(attempts)
            .where(eq(attempts.id, id));
        return attempt || null;
    }

    async findByToken(token: string): Promise<Attempt | null> {
        const [attempt] = await db
            .select()
            .from(attempts)
            .where(eq(attempts.token, token));
        return attempt || null;
    }

    async findByAssessmentAndStudent(assessmentId: string, studentId: string): Promise<Attempt | null> {
        const [attempt] = await db
            .select()
            .from(attempts)
            .where(and(
                eq(attempts.assessmentId, assessmentId),
                eq(attempts.studentId, studentId),
            ));
        return attempt || null;
    }

    async updateStatus(id: string, status: 'SUBMITTED' | 'GRADED'): Promise<Attempt> {
        const [attempt] = await db
            .update(attempts)
            .set({
                status,
                submittedAt: status === 'SUBMITTED' ? new Date() : undefined,
                updatedAt: new Date(),
            })
            .where(eq(attempts.id, id))
            .returning();
        return attempt;
    }

    async saveAnswer(data: NewAttemptAnswer): Promise<AttemptAnswer> {
        const existing = await this.findAnswerByQuestion(data.attemptId, data.questionId);

        if (existing) {
            const [updated] = await db
                .update(attemptAnswers)
                .set({
                    selectedOptionId: data.selectedOptionId,
                    updatedAt: new Date(),
                })
                .where(eq(attemptAnswers.id, existing.id))
                .returning();
            return updated;
        }

        const [answer] = await db.insert(attemptAnswers).values(data).returning();
        return answer;
    }

    async bulkSaveAnswers(data: NewAttemptAnswer[]): Promise<void> {
        if (data.length === 0) return;

        const existingAnswers = await db
            .select()
            .from(attemptAnswers)
            .where(eq(attemptAnswers.attemptId, data[0].attemptId));

        const existingMap = new Map(
            existingAnswers.map((a) => [`${a.attemptId}:${a.questionId}`, a])
        );

        const toInsert: NewAttemptAnswer[] = [];
        const toUpdate: { id: string; selectedOptionId: string | null }[] = [];

        for (const answer of data) {
            const key = `${answer.attemptId}:${answer.questionId}`;
            const existing = existingMap.get(key);
            if (existing) {
                toUpdate.push({ id: existing.id, selectedOptionId: answer.selectedOptionId ?? null });
            } else {
                toInsert.push(answer);
            }
        }

        if (toInsert.length > 0) {
            await db.insert(attemptAnswers).values(toInsert);
        }

        for (const update of toUpdate) {
            await db
                .update(attemptAnswers)
                .set({ selectedOptionId: update.selectedOptionId, updatedAt: new Date() })
                .where(eq(attemptAnswers.id, update.id));
        }
    }

    async findAnswersByAttemptId(attemptId: string): Promise<AttemptAnswer[]> {
        return db
            .select()
            .from(attemptAnswers)
            .where(eq(attemptAnswers.attemptId, attemptId));
    }

    async findAnswerByQuestion(attemptId: string, questionId: string): Promise<AttemptAnswer | null> {
        const [answer] = await db
            .select()
            .from(attemptAnswers)
            .where(and(
                eq(attemptAnswers.attemptId, attemptId),
                eq(attemptAnswers.questionId, questionId),
            ));
        return answer || null;
    }

    async findAttemptsByAssessmentId(assessmentId: string): Promise<Attempt[]> {
        return db
            .select()
            .from(attempts)
            .where(eq(attempts.assessmentId, assessmentId))
            .orderBy(attempts.createdAt);
    }

    async findExpiredInProgress(cutoffMs: number): Promise<Attempt[]> {
        const cutoff = new Date(cutoffMs);
        return db
            .select()
            .from(attempts)
            .where(
                and(
                    eq(attempts.status, 'IN_PROGRESS'),
                    sql`${attempts.startedAt} < ${cutoff}`
                )
            );
    }
}
