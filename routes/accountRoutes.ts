import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { accountController } from "../controllers/index.ts";


const accountRoutes = new Router();

accountRoutes
    .post("/signup", accountController.signup)
    .post("/signin", accountController.signin)
    .get("/me", accountController.me);



export { accountRoutes };