import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { statusController } from "../controllers/statusController.ts";

const statusRoutes = new Router();

// Status Route
statusRoutes.get("/status", statusController.getStatus);

export { statusRoutes };
