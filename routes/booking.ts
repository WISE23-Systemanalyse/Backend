import { Router } from "https://deno.land/x/oak/mod.ts";
import { statusController } from "../controllers/statusController.ts";

const statusRoutes = new Router();

// Status Route
statusRoutes.post("/reserve", statusController.getStatus);
statusRoutes.post("/book", statusController.getStatus);

export { statusRoutes };