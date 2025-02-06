import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { seatControllerObj } from "../controllers/index.ts";

const seatRoutes = new Router();

seatRoutes
    .get("/seats", seatControllerObj.getAll)
    .get("/seats/:id", seatControllerObj.getOne)
    .post("/seats", seatControllerObj.create)
    .post("/seats/:id/reserve", seatControllerObj.reserve)
    .put("/seats/:id", seatControllerObj.update)
    .delete("/seats/:id", seatControllerObj.delete)
    // Bulk Operations
    .post("/seats/bulk", seatControllerObj.bulkCreate)
    .put("/seats/bulk", seatControllerObj.bulkUpdate)
    .delete("/seats/bulk", seatControllerObj.bulkDelete)
    .post("/seats/halls/:hallId/sync", seatControllerObj.syncHallSeats);

export { seatRoutes };