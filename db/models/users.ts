import { pgTable, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm/relations";


export const users = pgTable("users", {
  id: varchar("id").primaryKey().unique(),
  password: varchar("password"),
  email: varchar("email").notNull().unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  userName: varchar("user_name").unique(),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isAdmin: boolean("is_admin").default(false),
  isVerified: boolean("is_verified").default(false)
});


export type User = typeof users.$inferSelect;