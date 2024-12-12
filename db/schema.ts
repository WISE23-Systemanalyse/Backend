import { pgTable, text, integer, varchar, timestamp, uniqueIndex, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const movie = pgTable("movie", {
	id: integer().primaryKey().notNull(),
	title: text().notNull(),
	year: integer().notNull(),
});

export const users = pgTable("user", {
	id: serial("id").primaryKey(),
	name: text("name"),
	email: text("email"),
});