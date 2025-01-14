import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { bookingController, showController } from "../controllers/index.ts";

const showRoutes = new Router();

showRoutes
  .get("/shows/details", showController.getAllWithDetails)
  .get("/shows", showController.getAll)
  .get("/shows/:id", showController.getOne)
  .post("/shows", showController.create)
  .put("/shows/:id", showController.update)
  .get("/shows/:id/bookings", bookingController.getBookingsByShowId)
  .post("/shows/:id/book", bookingController.create)
  .delete("/shows/:id", showController.delete);

export { showRoutes };
