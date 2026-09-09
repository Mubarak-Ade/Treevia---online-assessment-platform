import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const assessments = pgTable('assessments', {
    id: uuid('id').primaryKey(),
    creator_id: uuid('creator_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    status: varchar('status', { length: 255 }).notNull(),
    duration_minutes: integer('duration_minutes').notNull(),
    join_code: varchar('join_code', { length: 255 }).notNull(),
    published_at: timestamp('published_at').defaultNow().notNull(),
    created_at: timestamp('published_at').defaultNow().notNull(),
    updated_at: timestamp('published_at').defaultNow().notNull(),
});
