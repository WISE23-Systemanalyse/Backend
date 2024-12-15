import { pgTable, varchar, time} from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm/relations";

export const movies = pgTable("movie", {
    id: varchar("id").notNull().unique().primaryKey(),
    title: varchar("title").notNull().unique(),
    year: time("year").notNull(),
    imageUrl: varchar("image_url").notNull(),
  });


export type Movie = typeof movies.$inferSelect;