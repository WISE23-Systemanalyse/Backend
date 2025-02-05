import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { categoryController } from "../controllers/categoryController.ts";


const categoryRoutes = new Router();

categoryRoutes
    .get("/categories/:id", categoryController.getOne)
    .get("/categories", categoryController.getAll)
    .post("/categories", categoryController.create)
    .put("/categories/:id", categoryController.update)
    .delete("/categories/:id", categoryController.delete);

export { categoryRoutes };
