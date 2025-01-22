import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { contactController } from "../controllers/contactController.ts";

const contactRoutes = new Router();

contactRoutes.post("/contact", contactController.submitForm);

export { contactRoutes }; 