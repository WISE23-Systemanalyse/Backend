import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { 
    statusRoutes,
    userRoutes,
    movieRoutes,
    webhookRouter,
    showRoutes,
    bookingRoutes,
    hallRoutes,
    paymentRoutes,
    seatRoutes
}
from "./routes/index.ts";
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

app.use(showRoutes.routes());
app.use(showRoutes.allowedMethods());

app.use(bookingRoutes.routes());
app.use(bookingRoutes.allowedMethods());

app.use(hallRoutes.routes());
app.use(hallRoutes.allowedMethods());

app.use(paymentRoutes.routes());
app.use(paymentRoutes.allowedMethods());

app.use(seatRoutes.allowedMethods());
app.use(seatRoutes.routes());

app.use(webhookRouter.routes());

// Start the server
console.log("Server läuft auf http://localhost:8000");
await app.listen({ port: 8000 });
