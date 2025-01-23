import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { userController, bookingController } from "../controllers/index.ts";
import { authMiddleware } from "../middleware/auth.ts";


const userRoutes = new Router();

// Status Route
userRoutes
    .get("/users/:id", userController.getOne)
    .get("/users", userController.getAll)
    .post("/users", userController.create)
    .put("/users/:id", userController.update)
    .delete("/users/:id", userController.delete)
    .get("/users/:id/bookings", bookingController.getBookingsByUserId);

export { userRoutes };
