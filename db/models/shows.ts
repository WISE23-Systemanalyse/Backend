import { pgTable, serial, timestamp, integer, doublePrecision } from "drizzle-orm/pg-core";
import { movies } from "./movies.ts"; 
import { halls } from "./halls.ts";   

export const shows = pgTable("show", {
  id: serial("id").notNull().unique().primaryKey(),
  movie_id: integer("movie_id").notNull().references(() => movies.id, {
    onDelete: "cascade", // Wenn der Film gelöscht wird, werden die Shows auch gelöscht
  }),
  hall_id: integer("hall_id").notNull().references(() => halls.id, {
    onDelete: "cascade", // Wenn der Saal gelöscht wird, werden die Shows auch gelöscht
  }),
  start_time: timestamp("start_time").notNull(),
  base_price: doublePrecision("base_price").notNull(),

});

export type Show = typeof shows.$inferSelect;

export interface ShowWithDetails extends Show {
  id: number;
  movie_id: number;
  hall_id: number;
  start_time: Date;
  title: string | null;
  description: string | null;
  name: string | null;
}
