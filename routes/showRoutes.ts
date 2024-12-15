import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { bookingController, showController } from "../controllers/index.ts";

const showRoutes = new Router();

showRoutes
  .get("/shows/:id", showController.getOne) // Get one show
  .get("/shows", showController.getAll) // Get all shows
  .post("/shows", showController.create) // Create a show
  .put("/shows/:id", showController.update) // Update a show
  .get("/shows/:id/bookings", bookingController.getBookingsByShowId) // Get bookings for a show
  .post("/shows/:id/book", bookingController.create) // Create a booking
  .delete("/shows/:id", showController.delete);

export { showRoutes };
