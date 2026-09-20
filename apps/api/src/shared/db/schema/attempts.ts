import { boolean, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { assessments } from './assessment.js';
import { questionOptions, questions } from './questions.js';
import { relations } from 'drizzle-orm';
import { InferEnum } from 'drizzle-orm';

export const attemptStatusEnum = pgEnum('attempt_status', ['IN_PROGRESS', 'SUBMITTED', 'GRADED']);

export const attempts = pgTable('attempts', {
    id: uuid('id').primaryKey(),
    assessmentId: uuid('assessment_id')
        .references(() => assessments.id, { onDelete: 'cascade' })
        .notNull(),
    studentName: varchar('student_name', { length: 255 }).notNull(),
    studentId: varchar('student_id', { length: 100 }).notNull(),
    studentEmail: varchar('student_email', { length: 255 }).notNull(),
    status: attemptStatusEnum('status').default('IN_PROGRESS').notNull(),
    token: varchar('token', { length: 64 }).notNull().unique(),
    startedAt: timestamp('started_at').defaultNow().notNull(),
    submittedAt: timestamp('submitted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Attempt = typeof attempts.$inferSelect
export type NewAttempt = typeof attempts.$inferInsert
export type AttemptStatus = InferEnum<typeof attemptStatusEnum>

export const attemptAnswers = pgTable('attempt_answers', {
    id: uuid('id').primaryKey(),
    attemptId: uuid('attempt_id')
        .references(() => attempts.id, { onDelete: 'cascade' })
        .notNull(),
    questionId: uuid('question_id')
        .references(() => questions.id, { onDelete: 'cascade' })
        .notNull(),
    selectedOptionId: uuid('selected_option_id').references(() => questionOptions.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type AttemptAnswer = typeof attemptAnswers.$inferSelect
export type NewAttemptAnswer = typeof attemptAnswers.$inferInsert

export const attemptRelation = relations(attempts, ({one, many}) => ({
    assessment: one(assessments, {
        fields: [attempts.assessmentId],
        references: [assessments.id]
    }),
    answers: many(attemptAnswers)
}));

export const attemptAnswerRelation = relations(attemptAnswers, ({one}) => ({
    attempt: one(attempts, {
        fields: [attemptAnswers.attemptId],
        references: [attempts.id]
    }),
    question: one(questions, {
        fields: [attemptAnswers.questionId],
        references: [questions.id]
    })
}));
