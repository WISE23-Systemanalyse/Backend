import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const verificationCodes = pgTable('verification_codes', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    code: varchar('code', { length: 6 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    expiresAt: timestamp('expires_at').notNull()
  });


export type VerificationCode = typeof verificationCodes.$inferSelect;