import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/drizzle",
  schema: "./db/models/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL")!,
  },
});