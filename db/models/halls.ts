import { pgTable, varchar, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { int } from "drizzle-orm/singlestore-core";
// import { relations } from "drizzle-orm/relations";

export const halls = pgTable("hall", {
    id: serial("id").notNull().unique().primaryKey(),
    name: varchar("name").notNull().unique(),
    seating_capacity: integer("seating_capacity"),
  });


export type Hall = typeof halls.$inferSelect;