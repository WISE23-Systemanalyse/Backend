import { Router } from "https://deno.land/x/oak/mod.ts";
import { userController } from "../controllers/userController.ts";

const userRoutes = new Router();

// Status Route
userRoutes
    .get("/users/:id", userController.getOne)
    .get("/users", userController.getAll)
    .post("/users", userController.create)
    .put("/users/:id", userController.update)
    .delete("/users/:id", userController.delete);

export { userRoutes };
