import { pgTable, doublePrecision, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
    id: serial("id").notNull().unique().primaryKey(),
    amount: doublePrecision("amount").notNull(),
    payment_time: timestamp("payment_time").defaultNow(),
    tax: doublePrecision("tax").notNull(),
    payment_method: varchar("payment_method", { length: 255 }).notNull(),
    payment_status: varchar("payment_status", { length: 255 }).notNull(),
    time_of_payment: timestamp("time_of_payment").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;