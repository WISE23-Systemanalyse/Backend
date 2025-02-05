import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { friendshipController, hallController } from "../controllers/index.ts";

const friendshipRoutes = new Router();

friendshipRoutes
  .get("/friendships/:id", friendshipController.getOne) // Get one friendship
  .get("/friendships", friendshipController.getAll) // Get all friendships
  .get("/friendships/user/:userId", friendshipController.getFriendshipsByUserId) // Get friendships by userId
  .post("/friendships", friendshipController.create) // Create a friendship
  .put("/friendships/:id", friendshipController.update) // Update a friendship
  .delete("/friendships/:id", friendshipController.delete);


export { friendshipRoutes };