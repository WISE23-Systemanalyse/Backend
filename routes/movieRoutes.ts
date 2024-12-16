import { Router } from "https://deno.land/x/oak/mod.ts";
import { movieController } from "../controllers/index.ts";

const movieRoutes = new Router();

// Status Route
movieRoutes
    .get("/movies/:id", movieController.getOne)
    .get("/movies", movieController.getAll)
    .post("/movies", movieController.create)
    .put("/movies/:id", movieController.update)
    .delete("/movies:id", movieController.delete);

export { movieRoutes };
