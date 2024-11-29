import { Application } from "https://deno.land/x/oak/mod.ts";
import { statusRoutes } from "./routes/statusRoutes.ts";

const app = new Application();

// Definiere die Routen
app.use(statusRoutes.routes());
app.use(statusRoutes.allowedMethods());

// Starte den Server
console.log("Server läuft auf http://localhost:8000");
await app.listen({ port: 8000 });
