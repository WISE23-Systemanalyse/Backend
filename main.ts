import { Application } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { routers } from "./routes/index.ts";

const app = new Application();

// Use CORS middleware
app.use(oakCors());

// Define the routes
app.use(routers.routes());

// Start the server
console.log("Server läuft auf http://localhost:8000");
await app.listen({ port: 8000 });
