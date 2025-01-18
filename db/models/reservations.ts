import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { seats } from "./seats.ts";
import { users } from "./users.ts";

export const reservations = pgTable("reservation", {
    id: serial("id").notNull().unique().primaryKey(),
    seat_id: integer("seat_id").notNull().references(() => seats.id, {
      onDelete: "cascade", // Optional: Löscht die Reservierung, wenn der Sitz gelöscht wird
    }),
    user_id: integer("user_id").references(() => users.id, {
      onDelete: "cascade", // Optional: Löscht die Reservierung, wenn der Benutzer gelöscht wird
    }),
    guest_email: varchar("guest_email", { length: 255 }),
    guest_name: varchar("guest_name", { length: 255 }),
    expire_at: timestamp("expire_at").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
  });


export type Reservation = typeof reservations.$inferSelect;