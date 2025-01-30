import { pgTable, varchar, serial, doublePrecision } from "drizzle-orm/pg-core";

export const categories = pgTable("category", {
    id: serial("id").notNull().unique().primaryKey(),
    category_name: varchar("category_name", { length: 255 }).notNull(),
    surcharge: doublePrecision("surcharge").default(0.0),
});

export type Category = typeof categories.$inferSelect;