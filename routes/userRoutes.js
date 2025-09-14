import { Router } from "express";
import {handleCreateAccount, 
        handleUserLogin, 
        handleUserLogout, 
        handleOrganizerRequests, 
        handleApproveRequest, 
        handleSendOtp,
        handleVerifyOtp,
        handleForgetPassword
    } from "../controllers/user.js";
import { checkAuthentication, checkAuthorizationAdmin } from "../middlewares/auth.js";
import { parseRequestBody } from "../middlewares/parseBody.js";
import { rejectionReason } from "../schema/eventSchema.js";

const router = Router();

router.post("/forgetPassword", handleForgetPassword);
router.post("/createAccount", handleCreateAccount);
router.post("/login", handleUserLogin);
router.post("/logout", handleUserLogout);
router.get("/admin/requests", checkAuthentication, checkAuthorizationAdmin, handleOrganizerRequests);
router.post("/admin", parseRequestBody(rejectionReason), handleApproveRequest);
router.post("/sendOtp", handleSendOtp);
router.post("/verifyOtp", handleVerifyOtp);

export default router;