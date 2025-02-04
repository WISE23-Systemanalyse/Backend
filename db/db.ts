import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema.ts";

export const connectionString = Deno.env.get("DATABASE_URL") || "";
export const client = postgres(connectionString, {
    max: 20, // Maximum connections
    idle_timeout: 30,
    connect_timeout: 2,
});
export const db = drizzle(client, { schema });
