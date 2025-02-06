import { pgTable, varchar, serial } from "drizzle-orm/pg-core";
import { users } from "./users.ts";
import { relations } from "drizzle-orm/relations";

export const friendships = pgTable("friends", {
  id: serial('id').primaryKey(),
  user1Id: varchar('user1_id').notNull().references(() => users.id),
  user2Id: varchar('user2_id').notNull().references(() => users.id),
}, (table) => ({
  uniqueFriendship: {
    columns: [table.user1Id, table.user2Id],
    name: 'unique_friendship'
  }
}));


export const friendshipsRelations = relations(friendships, ({ one }) => ({
  user1: one(users, {
    fields: [friendships.user1Id],
    references: [users.id]
  }),
  user2: one(users, {
    fields: [friendships.user2Id], 
    references: [users.id]
  })
}));

export type Friendship = typeof friendships.$inferSelect;