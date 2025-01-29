import { Router } from "https://deno.land/x/oak/mod.ts";
import { bookingController } from "../controllers/index.ts";


const bookingRoutes = new Router();

bookingRoutes
    .get("/bookings/:id", bookingController.getOne)
    .get("/bookings", bookingController.getAll)
    .get("/bookings/show/:showId", bookingController.getBookingsByShowId)
    .get("/bookings/user/:userId", bookingController.getBookingsByUserId)
    .get("/bookings/payment/:paymentId", bookingController.getByPaymentId)
    .get("/bookings/token/:token", bookingController.getByToken)
    .post("/bookings", bookingController.create)
    .put("/bookings/:id", bookingController.update)
    .delete("/bookings:id", bookingController.delete);

export { bookingRoutes };

