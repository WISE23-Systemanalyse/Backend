import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { newsletterController } from "../controllers/newsletterController.ts";

const newsletterRoutes = new Router();

newsletterRoutes.post("/newsletter/subscribe", newsletterController.subscribe);

export { newsletterRoutes };