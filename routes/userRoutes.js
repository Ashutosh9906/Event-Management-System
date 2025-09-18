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
import { createAccount, Password, sendOtp, verifyOtp,  } from "../schema/userSchema.js";

const router = Router();

router.post("/forgetPassword", parseRequestBody(Password), handleForgetPassword);
/**
 * @swagger
 * /user/createAccount:
 *   post:
 *     summary: Create a new account (Attendee or Organizer)
 *     description: |
 *       Creates a new user account after verifying OTP.  
 *       - **ATTENDEE** role requires: name, email, password.  
 *       - **ORGANIZER** role requires: name, organization, email, ContactNo, purpose.  
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [role, name, email, password]
 *                 properties:
 *                   role:
 *                     type: string
 *                     enum: [ATTENDEE]
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     example: john@example.com
 *                   password:
 *                     type: string
 *                     format: password
 *                     example: Password123
 *               - type: object
 *                 required: [role, name, organization, email, ContactNo, purpose]
 *                 properties:
 *                   role:
 *                     type: string
 *                     enum: [ORGANIZER]
 *                   name:
 *                     type: string
 *                     example: Jane Smith
 *                   organization:
 *                     type: string
 *                     example: TechFest Club
 *                   email:
 *                     type: string
 *                     example: organizer@example.com
 *                   ContactNo:
 *                     type: string
 *                     example: "+91-9876543210"
 *                   purpose:
 *                     type: string
 *                     example: Organizing inter-college hackathon
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Created Successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad Request (Validation/User not verified/User already exists)
 *       500:
 *         description: Internal Server Error
 */
router.post("/createAccount", parseRequestBody(createAccount), handleCreateAccount);
router.post("/login", parseRequestBody(Password), handleUserLogin);
router.post("/logout", handleUserLogout);
router.get("/admin/requests", checkAuthentication, checkAuthorizationAdmin, handleOrganizerRequests);
router.post("/admin", parseRequestBody(rejectionReason), handleApproveRequest);
router.post("/sendOtp", parseRequestBody(sendOtp), handleSendOtp);
router.post("/verifyOtp", parseRequestBody(verifyOtp), handleVerifyOtp);

export default router;