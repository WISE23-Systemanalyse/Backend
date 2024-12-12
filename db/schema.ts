import { pgTable, text, integer, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const movie = pgTable("movie", {
	id: integer().primaryKey().notNull(),
	title: text().notNull(),
	year: integer().notNull(),
});

export const user = pgTable("users", {
  id: varchar("clerk_id").notNull().unique().primaryKey(),
  email: varchar("email").notNull().unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  userName: varchar("user_name"),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
