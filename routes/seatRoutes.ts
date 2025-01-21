import { Router } from "https://deno.land/x/oak/mod.ts";
import { seatController } from "../controllers/index.ts";

const seatRoutes = new Router();

seatRoutes
    .get("/seats", seatController.getAll)
    .get("/seats/:id", seatController.getOne)
    .post("/seats", seatController.create)
    .post("/seats/:id/reserve", seatController.reserve)
    .put("/seats/:id", seatController.update)
    .delete("/seats/:id", seatController.delete)
    // Bulk Operations
    .post("/seats/bulk", seatController.bulkCreate)
    .put("/seats/bulk", seatController.bulkUpdate)
    .delete("/seats/bulk", seatController.bulkDelete)
    .post("/seats/halls/:hallId/sync", seatController.syncHallSeats);

export { seatRoutes };