import { Router } from "https://deno.land/x/oak/mod.ts";
import { hallController } from "../controllers/index.ts";

const hallRoutes = new Router();

hallRoutes
  .get("/halls/:id", hallController.getOne) // Get one hall
  .get("/halls", hallController.getAll) // Get all halls
  .post("/halls", hallController.create) // Create a hall
  .put("/halls/:id", hallController.update) // Update a hall
  .delete("/halls/:id", hallController.delete);


export { hallRoutes };