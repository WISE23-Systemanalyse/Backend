import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { movieController } from "../controllers/index.ts";

const movieRoutes = new Router();

// Status Route
movieRoutes
    .get("/movies/:id", movieController.getOne)
    .get("/movies", movieController.getAll)
    .post("/movies", movieController.create)
    .put("/movies/:id", movieController.update)
    .delete("/movies/:id", movieController.delete)
    .get("/movies/tmdb/search", movieController.searchTMDB)
    .get("/movies/tmdb/popular", movieController.getPopularTMDB)

export { movieRoutes };
