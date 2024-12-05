import { Router } from "https://deno.land/x/oak/mod.ts";
import { userController } from "../controllers/userController.ts";

const userRoutes = new Router();

// Status Route
userRoutes.get("/user/:id", userController.getUser);

// Create User Route
userRoutes.post("/user", userController.createUser);

export { userRoutes };
