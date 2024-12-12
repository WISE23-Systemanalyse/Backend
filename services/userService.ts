import { db } from "../db/db.ts"; // Verbindung zur Datenbank
import { users } from "../db/schema.ts"; // Datenbankschema
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../utils/hashUtils.ts";
import { createJwt } from "../utils/jwtUtils.ts";

export async function login(email: string, password: string) {
  const user = await db.select().from(users).where(eq(users.email, email)).execute();
  if (user && await verifyPassword(password, user.passwordHash)) {
    return await createJwt(user.id);
  }
  return null;
}

export async function getUserById(userId: number) {
  const user = await db.select().from(users).where(eq(users.id, userId)).execute();
  return user || null;
}
