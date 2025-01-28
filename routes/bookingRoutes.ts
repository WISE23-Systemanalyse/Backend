import { Router } from "https://deno.land/x/oak/mod.ts";
import { bookingController } from "../controllers/index.ts";


const bookingRoutes = new Router();

bookingRoutes
    .get("/bookings/:id", bookingController.getOne)
    .get("/bookings", bookingController.getAll)
    .get("/bookings/payment/:paymentId", bookingController.getByPaymentId)
    .post("/bookings", bookingController.create)
    .put("/bookings/:id", bookingController.update)
    .delete("/bookings:id", bookingController.delete);

export { bookingRoutes };

