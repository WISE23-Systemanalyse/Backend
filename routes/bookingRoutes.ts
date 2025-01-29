import { Router } from "https://deno.land/x/oak/mod.ts";
import { bookingController } from "../controllers/index.ts";


const bookingRoutes = new Router();

bookingRoutes
    .get("/bookings/details", bookingController.getAllBookingDetails)
    .get("/bookings", bookingController.getAll)
    .get("/bookings/:id", bookingController.getOne)
    .post("/bookings", bookingController.create)
    .put("/bookings/:id", bookingController.update)
    .delete("/bookings:id", bookingController.delete);

export { bookingRoutes };

