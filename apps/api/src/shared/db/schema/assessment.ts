import { integer, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { InferEnum, relations } from 'drizzle-orm';

export const assessStatusEnum = pgEnum('assess_status', ['draft', 'published', 'closed'])

export const assessments = pgTable('assessments', {
    id: uuid('id').primaryKey(),
    creator_id: uuid('creator_id')
        .references(() => users.id, { onDelete: 'restrict' })
        .notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    status: assessStatusEnum('status').default('draft').notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    joinCode: varchar('join_code', { length: 6 }).notNull().unique(),
    publishedAt: timestamp('published_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect
export type NewAssessment = typeof assessments.$inferInsert
export type assessStatus = InferEnum<typeof assessStatusEnum>

export const assessmentRelation = relations(assessments, ({one}) => ({
    creator: one(users, {
        fields: [assessments.creator_id],
        references: [users.id]
    })
}))