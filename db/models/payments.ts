import { pgTable, doublePrecision, serial, timestamp } from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
    id: serial("id").notNull().unique().primaryKey(),
    amount: doublePrecision("amount").notNull(),
    payment_time: timestamp("payment_time").defaultNow(),
    tax: doublePrecision("tax").notNull()
});

export type Payment = typeof payments.$inferSelect;