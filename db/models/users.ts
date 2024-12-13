import { pgTable, varchar, timestamp, numeric } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm/relations";


export const users = pgTable("users", {
  id: numeric("id").primaryKey().unique().notNull(),
  email: varchar("email").notNull().unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  userName: varchar("user_name"),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


export type User = typeof users.$inferSelect;