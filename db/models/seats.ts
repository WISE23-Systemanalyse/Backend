import { pgTable, varchar, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { int } from "drizzle-orm/singlestore-core";
import { halls } from "./halls";
// import { relations } from "drizzle-orm/relations";

export const seats = pgTable("seat", {
    id: serial("id").notNull().unique().primaryKey(),
    hall_id: integer("hall_id").notNull().references(() => halls.id, {
      onDelete: "cascade", // Optional: Löscht die Sitze, wenn der Saal gelöscht wird
    }),
    row_number: integer("row_number").notNull(),
    seat_number: integer("seat_number").notNull(),
    seat_type: varchar("seat_type", { length: 50 }), // z.B. "VIP", "Standard"
  });


export type Seat = typeof seats.$inferSelect;