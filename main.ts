import { Application } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
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
