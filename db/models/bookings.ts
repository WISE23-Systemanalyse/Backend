import { pgTable, serial, numeric, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users.ts"; 
import { shows } from "./shows.ts"; 
import { seats } from "./seats.ts"; 

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey().unique().notNull(),
  user_id: numeric("user_id").notNull().references(() => users.id, {
    onDelete: "cascade", // Löscht Buchungen, wenn der User gelöscht wird
  }),
  show_id: integer("show_id").notNull().references(() => shows.id, {
    onDelete: "cascade", 
  }),
  seat_id: integer("seat_id").notNull().references(() => seats.id, {
    onDelete: "cascade", 
  }),
  booking_time: timestamp("booking_time").defaultNow(), 
});

export type Booking = typeof bookings.$inferSelect;
