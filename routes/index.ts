import {movieRoutes } from "./movieRoutes.ts";
import {bookingRoutes } from "./bookingRoutes.ts";
import {statusRoutes } from "./statusRoutes.ts";
import {userRoutes } from "./userRoutes.ts";
import {webhookRouter } from "./clerk-webhooks.ts";
import {showRoutes } from "./showRoutes.ts";
import { hallRoutes } from "./hallRoutes.ts";
import { paymentRoutes } from "./paymentRoutes.ts";
import { seatRoutes } from "./seatRoutes.ts";
import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";

const routers = new Router();

routers.use(movieRoutes.routes());
routers.use(movieRoutes.allowedMethods());

routers.use(bookingRoutes.routes());
routers.use(bookingRoutes.allowedMethods());

routers.use(statusRoutes.routes());
routers.use(statusRoutes.allowedMethods());

routers.use(userRoutes.routes());
routers.use(userRoutes.allowedMethods());

routers.use(webhookRouter.routes());
routers.use(webhookRouter.allowedMethods());

routers.use(showRoutes.routes());
routers.use(showRoutes.allowedMethods());

routers.use(hallRoutes.routes());
routers.use(hallRoutes.allowedMethods());

routers.use(paymentRoutes.routes());
routers.use(paymentRoutes.allowedMethods());

routers.use(seatRoutes.routes());
routers.use(seatRoutes.allowedMethods());

export { routers };

