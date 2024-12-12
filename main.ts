import { Application } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { statusRoutes } from "./routes/statusRoutes.ts";
import { movieRoutes } from "./routes/movieRoutes.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { userRoutes } from "./routes/userRoutes.ts";
import { userMiddleware } from "./middleware/authMiddleware.ts";

const app = new Application();

// Use CORS middleware
app.use(oakCors());

app.use(userMiddleware); // Globale Middleware für Benutzererkennung

// Define the routes
app.use(statusRoutes.routes());
app.use(statusRoutes.allowedMethods());

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.use(movieRoutes.routes());
app.use(movieRoutes.allowedMethods());

// Start the server
console.log("Server läuft auf http://localhost:8000");
const env = config();
const databaseUrl = env.DATABASE_URL || Deno.env.get("DATABASE_URL");

console.log("Database URL:", databaseUrl);
await app.listen({ port: 8000 });
