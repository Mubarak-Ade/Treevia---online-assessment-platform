import { and, eq } from 'drizzle-orm';
import { db } from '../../shared/db/index.js';
import {
    NewAssessment,
    Assessment,
    assessments,
    assessStatus,
} from '../../shared/db/schema/assessment.js';
import { IAssessmentRepository } from './types.js';

export class AssessmentRepository implements IAssessmentRepository {
    async create(data: NewAssessment): Promise<Assessment> {
        const [assessment] = await db.insert(assessments).values(data).returning();
        return assessment;
    }

    async findById(assessmentId: string): Promise<Assessment> {
        const [assessment] = await db
            .select()
            .from(assessments)
            .where(eq(assessments.id, assessmentId));
        return assessment;
    }
    async findAll(userId: string): Promise<Assessment[]> {
        const result = await db
            .select()
            .from(assessments)
            .where(eq(assessments.creator_id, userId));
        return result;
    }
    /**
     * find by creator
     */
    async findByCreator(userId: string): Promise<Assessment> {
        const [assessment] = await db
            .select()
            .from(assessments)
            .where(eq(assessments.creator_id, userId));
        return assessment;
    }
    async findByJoinCode(code: string): Promise<string> {
        const joinCode = await db
            .select({ joinCode: assessments.joinCode })
            .from(assessments)
            .where(eq(assessments.joinCode, code))
            .then((rows) => rows[0]?.joinCode);

        return joinCode;
    }
    /**
     * update assessment by id
     */
    async update(data: Partial<NewAssessment>, assessmentId: string): Promise<Assessment> {
        const [assessment] = await db
            .update(assessments)
            .set({
                title: data.title,
                description: data.description,
                durationMinutes: data.durationMinutes,
                updatedAt: new Date(),
            })
            .where(eq(assessments.id, assessmentId))
            .returning();
        return assessment;
    }
    /**
     * delete assessment
     */
    async delete(assessmentId: string): Promise<Assessment> {
        const [assessment] = await db
            .delete(assessments)
            .where(eq(assessments.id, assessmentId))
            .returning();
        return assessment;
    }
    /**
     * update status
     */
    async publish(assessmentId: string): Promise<Assessment> {
        const [assessment] = await db
            .update(assessments)
            .set({
                status: 'published',
                publishedAt: new Date(),
            })
            .where(eq(assessments.id, assessmentId))
            .returning();
        return assessment;
    }
    /**
     * update status
     */
    async closed(assessmentId: string): Promise<Assessment> {
        const [assessment] = await db
            .update(assessments)
            .set({
                status: 'closed',
                updatedAt: new Date(),
            })
            .where(eq(assessments.id, assessmentId))
            .returning();
        return assessment;
    }
}
