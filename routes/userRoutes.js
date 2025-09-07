import { Router } from "express";
import { handleCreateAccount } from "../controllers/user.js";

const router = Router();

router.post("/createAccount", handleCreateAccount);

export default router;