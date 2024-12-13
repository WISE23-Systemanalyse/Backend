import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { statusRoutes } from "./routes/statusRoutes.ts";
import { userRoutes } from "./routes/userRoutes.ts";
import { movieRoutes } from "./routes/movieRoutes.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const app = new Application();

// Use CORS middleware
app.use(oakCors());

// Define the routes
app.use(statusRoutes.routes());
app.use(statusRoutes.allowedMethods());

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.use(movieRoutes.routes());
app.use(movieRoutes.allowedMethods());

// Start the server
console.log("Server läuft auf http://localhost:8000");
await app.listen({ port: 8000 });
