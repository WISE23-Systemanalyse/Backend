import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { seatController } from "../controllers/index.ts";

const seatRoutes = new Router();


seatRoutes
  .get("/seats", seatController.getAll) // Get all seats
  .get("/seats/:id", seatController.getOne) // Get a seat
  .post("/seats", seatController.create) // Create a seat
  .put("/seats/:id", seatController.update) // Update a seat
  .delete("/seats/:id", seatController.delete); // Delete a seat


export { seatRoutes };