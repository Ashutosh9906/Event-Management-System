import { Router } from "express";
import { handleCreateAccount, handleUserLogin, handleUserLogout, handleOrganizerRequests, handleApproveRequest } from "../controllers/user.js";
import { checkAuthentication, checkAuthorization } from "../middlewares/auth.js";

const router = Router();

router.post("/createAccount", handleCreateAccount);
router.post("/login", handleUserLogin);
router.post("/logout", handleUserLogout);
router.get("/admin/requests", checkAuthentication, checkAuthorization, handleOrganizerRequests);
router.post("/admin/:id/approve", handleApproveRequest);

export default router;