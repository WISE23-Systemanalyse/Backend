import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm/relations";

export const movies = pgTable("movie", {
    id: varchar("id").notNull().unique().primaryKey(),
    title: varchar("title").notNull().unique(),
    year: timestamp("year").notNull(),
    imageUrl: varchar("image_url").notNull(),
  });


export type Movie = typeof movies.$inferSelect;