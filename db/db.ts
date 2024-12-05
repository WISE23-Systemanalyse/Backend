import { drizzle } from "drizzle-orm/node-postgres";
import { movie as movieSchema, user as userSchema } from "./schema.ts";
import pg from "pg";
import { integer } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm/expressions";

const { Pool } = pg;

// Instantiate Drizzle client with pg driver and schema.
export const db = drizzle({
  client: new Pool({
    connectionString: Deno.env.get("DATABASE_URL"),
  }),
  schema: { userSchema, movieSchema },
});

export async function findMovieById(movieId: number) {
  return await db.select().from(movieSchema).where(
    eq(movieSchema.id, movieId),
  );
}

export async function findUserById(userId: string) {
  return await db.select().from(userSchema).where(
    eq(userSchema.id, userId),
  );
}

export async function createUser(userId: string, name: string, email: string) {
  return await db.insert(userSchema).values({
    id: userId,
    name: name,
    email: email,
  })
}