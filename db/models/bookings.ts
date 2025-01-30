import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users.ts"; 
import { shows } from "./shows.ts"; 
import { seats } from "./seats.ts"; 
import { payments } from "./payments.ts";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey().unique().notNull(),
  user_id: varchar("user_id").notNull().references(() => users.id, {
    onDelete: "cascade", // Löscht Buchungen, wenn der User gelöscht wird
  }),
  show_id: integer("show_id").notNull().references(() => shows.id, {
    onDelete: "cascade", 
  }),
  seat_id: integer("seat_id").notNull().references(() => seats.id, {
    onDelete: "cascade", 
  }),
  booking_time: timestamp("booking_time").defaultNow(), 
  payment_id: integer("payment_id").notNull().references(() => payments.id, {
    onDelete: "cascade", 
  }),
  token: varchar("token").notNull().unique(),
});

export type Booking = typeof bookings.$inferSelect;