import { pgTable, varchar, serial } from "drizzle-orm/pg-core";
import { users } from "./users.ts";
import { relations } from "drizzle-orm/relations";
import { sql } from "drizzle-orm";

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

// Trigger-Definition (muss einmalig ausgeführt werden):
sql`
CREATE OR REPLACE FUNCTION order_friendship_users()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user1_id > NEW.user2_id THEN
    SELECT NEW.user2_id, NEW.user1_id 
    INTO NEW.user1_id, NEW.user2_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER friendship_order_trigger
BEFORE INSERT OR UPDATE ON friends
FOR EACH ROW
EXECUTE FUNCTION order_friendship_users();
`;

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