import { Router } from "https://deno.land/x/oak/mod.ts";
import { paymentController } from "../controllers/index.ts";

const paymentRoutes = new Router();

paymentRoutes
  .get("/payments/:id", paymentController.getOne) // Get one payment
  .get("/payments", paymentController.getAll) // Get all payments
  .post("/payments", paymentController.create) // Create a payment
  .put("/payments/:id", paymentController.update) // Update a payment
  .delete("/payments/:id", paymentController.delete);

export { paymentRoutes };