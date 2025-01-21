import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { bookingController, showControllerObj } from "../controllers/index.ts";

const showRoutes = new Router();

showRoutes
  .get("/shows/details", showControllerObj.getAllWithDetails)
  .get("/shows", showControllerObj.getAll)
  .get("/shows/:id", showControllerObj.getOne)
  .get("/shows/:id/seats", showControllerObj.getSeatsWithStatus)
  .post("/shows", showControllerObj.create)
  .put("/shows/:id", showControllerObj.update)
  .get("/shows/:id/bookings", bookingController.getBookingsByShowId)
  .post("/shows/:id/book", bookingController.create)
  .delete("/shows/:id", showControllerObj.delete);

export { showRoutes };
