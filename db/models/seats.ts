import { pgTable, varchar, serial, integer } from "drizzle-orm/pg-core";
import { halls } from "./halls.ts";
import { categories } from "./categories.ts";

export const seats = pgTable("seat", {
    id: serial("id").notNull().unique().primaryKey(),
    hall_id: integer("hall_id").notNull().references(() => halls.id, {
      onDelete: "cascade",
    }),
    row_number: integer("row_number").notNull(),
    seat_number: integer("seat_number").notNull(),
    category_id: integer("category_id").notNull().references(() => categories.id, {
      onDelete: "cascade", 
    }),
  });


export type Seat = typeof seats.$inferSelect;