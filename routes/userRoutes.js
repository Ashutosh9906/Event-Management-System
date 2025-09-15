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
import { createAccount, otpSchema, Password,  } from "../schema/userSchema.js";

const router = Router();

router.post("/forgetPassword", parseRequestBody(Password), handleForgetPassword);
router.post("/createAccount", parseRequestBody(createAccount), handleCreateAccount);
router.post("/login", parseRequestBody(Password), handleUserLogin);
router.post("/logout", handleUserLogout);
router.get("/admin/requests", checkAuthentication, checkAuthorizationAdmin, handleOrganizerRequests);
router.post("/admin", parseRequestBody(rejectionReason), handleApproveRequest);
router.post("/sendOtp", parseRequestBody(otpSchema), handleSendOtp);
router.post("/verifyOtp", parseRequestBody(otpSchema), handleVerifyOtp);

export default router;