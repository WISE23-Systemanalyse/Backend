import { pgTable, time, doublePrecision, serial } from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
    id: serial("id").notNull().unique().primaryKey(),
    amount: doublePrecision("amount").notNull(),
    payment_time: time("payment_time").defaultNow(),
    tax: doublePrecision("tax").notNull()
});