import { Router } from "express";
import { handleCreateAccount, handleUserLogin, handleUserLogout } from "../controllers/user.js";

const router = Router();

router.post("/createAccount", handleCreateAccount);
router.post("/login", handleUserLogin);
router.post("/logout", handleUserLogout);

export default router;