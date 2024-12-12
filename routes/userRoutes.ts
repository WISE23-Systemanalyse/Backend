import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { getProfile, loginUser } from "../controllers/userController.ts";

const router = new Router();
router.get("/profile", getProfile); // Profil ansehen
router.post("/login", loginUser);   // Benutzer einloggen

export { router as userRoutes };
