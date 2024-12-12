import * as usersSchema from "./models/users.ts";
import * as moviesSchema from "./models/movies.ts";

export const users = pgTable('users', {
	id: varchar('clerk_id').notNull().unique().primaryKey(),
	email: varchar('email').notNull().unique(),
	firstName: varchar('first_name'),
	lastName: varchar('last_name'),
	userName: varchar('user_name'),
	imageUrl: varchar('image_url'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
  });
  
