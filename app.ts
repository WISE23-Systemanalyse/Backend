import { Application } from "https://deno.land/x/oak/mod.ts";
import { statusRoutes } from "./routes/statusRoutes.ts";
import { userRoutes } from "./routes/userRoutes.ts";
import { movieRoutes } from "./routes/movieRoutes.ts";


const app = new Application();

// Definiere die Routen
app.use(statusRoutes.routes());
app.use(statusRoutes.allowedMethods());

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.use(movieRoutes.routes());
app.use(movieRoutes.allowedMethods());

// Starte den Server
console.log("Server läuft auf http://localhost:8000");
await app.listen({ port: 8000 });
