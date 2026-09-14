import { eq } from 'drizzle-orm';
import { db } from '../../shared/db/index.js';
import { questions, questionOptions, Question, NewQuestion, NewQuestionOption } from '../../shared/db/schema/questions.js';
import { IQuestionRepository } from './types.js';

export class QuestionRepository implements IQuestionRepository {
    async create(data: NewQuestion, options: NewQuestionOption[]): Promise<Question> {
        const [question] = await db.insert(questions).values(data).returning();
        if (options.length > 0) {
            const optionValues = options.map((opt) => ({ ...opt, questionId: question.id }));
            await db.insert(questionOptions).values(optionValues);
        }
        const [createdQuestion] = await db.select().from(questions).where(eq(questions.id, question.id));
        return createdQuestion as Question;
    }

    async findByAssessmentId(assessmentId: string): Promise<Question[]> {
        const rows = await db.select().from(questions).where(eq(questions.assessmentId, assessmentId)).orderBy(questions.position);
        return rows;
    }

    async findById(questionId: string): Promise<Question> {
        const [question] = await db.select().from(questions).where(eq(questions.id, questionId));
        return question;
    }

    async update(data: Partial<NewQuestion>, questionId: string): Promise<Question> {
        const [question] = await db.update(questions).set({ ...data, updatedAt: new Date() }).where(eq(questions.id, questionId)).returning();
        return question;
    }

    async delete(questionId: string): Promise<void> {
        await db.delete(questions).where(eq(questions.id, questionId));
    }

    async reorder(assessmentId: string, order: string[]): Promise<void> {
        for (let i = 0; i < order.length; i++) {
            await db.update(questions).set({ position: i, updatedAt: new Date() }).where(eq(questions.id, order[i])).execute();
        }
    }
}
