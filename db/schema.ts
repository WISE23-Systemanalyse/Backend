import { pgTable, text, integer, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const movie = pgTable("movie", {
	id: integer().primaryKey().notNull(),
	title: text().notNull(),
	year: integer().notNull(),
});

export const user = pgTable("User", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	name: text(),
}, (table) => {
	return {
		emailKey: uniqueIndex("User_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
	}
});
