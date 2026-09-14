import { integer, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { assessments } from './assessment.js';
import { relations } from 'drizzle-orm';
import { InferEnum } from 'drizzle-orm';

export const questionTypeEnum = pgEnum('question_type', ['MULTIPLE_CHOICE', 'TRUE_FALSE']);

export const questions = pgTable('questions', {
    id: uuid('id').primaryKey(),
    assessmentId: uuid('assessment_id')
        .references(() => assessments.id, { onDelete: 'cascade' })
        .notNull(),
    questionType: questionTypeEnum('question_type').notNull(),
    questionText: varchar('question_text', { length: 2000 }).notNull(),
    points: integer('points').notNull().default(0),
    position: integer('position').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Question = typeof questions.$inferSelect
export type NewQuestion = typeof questions.$inferInsert
export type questionType = InferEnum<typeof questionTypeEnum>

export const questionRelation = relations(questions, ({one, many}) => ({
    assessment: one(assessments, {
        fields: [questions.assessmentId],
        references: [assessments.id]
    }),
    options: many(questionOptions)
}));

export const questionOptions = pgTable('question_options', {
    id: uuid('id').primaryKey(),
    questionId: uuid('question_id')
        .references(() => questions.id, { onDelete: 'cascade' })
        .notNull(),
    optionText: varchar('option_text', { length: 1000 }).notNull(),
    position: integer('position').notNull().default(0),
    isCorrect: integer('is_correct').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type QuestionOption = typeof questionOptions.$inferSelect
export type NewQuestionOption = typeof questionOptions.$inferInsert

export const questionOptionRelation = relations(questionOptions, ({one}) => ({
    question: one(questions, {
        fields: [questionOptions.questionId],
        references: [questions.id]
    })
}));
