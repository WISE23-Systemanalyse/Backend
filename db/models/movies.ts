import { pgTable, varchar, integer, doublePrecision, serial } from "drizzle-orm/pg-core";

export const movies = pgTable("movie", {
    id: serial("id").notNull().unique().primaryKey(),
    title: varchar("title").notNull().unique(),
    year: integer("year").notNull(),
    description: varchar("description").notNull(),
    rating: doublePrecision("rating").notNull(),
    imageUrl: varchar("image_url").notNull(),
    genres: varchar("genres").array().notNull(),
    duration: integer("duration").notNull(),
});

export type Movie = typeof movies.$inferSelect;