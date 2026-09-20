import { and, eq } from 'drizzle-orm';
import { db } from '../../shared/db/index.js';
import {
    questionOptions,
    Question,
    NewQuestion,
    NewQuestionOption,
    QuestionOption,
    questions,
} from '../../shared/db/schema/questions.js';
import { DbTransaction, IQuestionRepository } from './types.js';
import { v7 as uuid } from 'uuid';

export class QuestionRepository implements IQuestionRepository {
    async create(tsx: DbTransaction, data: NewQuestion): Promise<Question> {
        const [question] = await tsx.insert(questions).values(data).returning();
        return question;
    }

    async addOptions(tsx: DbTransaction, options: NewQuestionOption[]): Promise<QuestionOption[]> {
        const questionOption = await tsx.insert(questionOptions).values(options).returning();
        return questionOption
    }

    async findByAssessmentId(assessmentId: string): Promise<Question[]> {
        const rows = await db.query.questions.findMany({
            where: eq(questions.assessmentId, assessmentId),
            with: {
                options: true,
            },
            orderBy: (questions, {asc}) => asc(questions.position),
        })
        return rows
    }

    async findById(questionId: string, assessmentId: string, tx?: DbTransaction): Promise<Question | undefined> {
        const rows = await (tx ? tx : db).query.questions.findFirst({
            where: and(eq(questions.id, questionId), eq(questions.assessmentId, assessmentId)),
            with: {
                options: {
                    columns: {
                        isCorrect: false
                    }
                },
            },
        })                
        return rows
    }

    async update(data: Partial<NewQuestion>, questionId: string, tx?: DbTransaction): Promise<Question> {
        const executor = tx || db;
        const [question] = await executor
            .update(questions)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(questions.id, questionId))
            .returning();
        return question;
    }

    async replaceOptions(questionId: string, options: NewQuestionOption[], tx?: DbTransaction): Promise<QuestionOption[]> {
        const executor = tx || db;
        await executor.delete(questionOptions).where(eq(questionOptions.questionId, questionId));
        if (options.length === 0) {
            return [];
        }
        return executor.insert(questionOptions).values(options).returning();
    }

    async delete(questionId: string): Promise<void> {
        await db.delete(questions).where(eq(questions.id, questionId));
    }

    async reorder(assessmentId: string, items: { id: string; position: number }[]): Promise<void> {
        for (const item of items) {
            await db
                .update(questions)
                .set({ position: item.position, updatedAt: new Date() })
                .where(eq(questions.id, item.id))
                .execute();
        }
    }

    async findOptionsByQuestionId(questionId: string): Promise<QuestionOption[]> {
        return db
            .select()
            .from(questionOptions)
            .where(eq(questionOptions.questionId, questionId))
            .orderBy(questionOptions.position);
    }
}
