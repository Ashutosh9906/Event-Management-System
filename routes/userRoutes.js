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

/**
 * @swagger
 * /user/forgetPassword:
 *   post:
 *     summary: Reset password for a verified user
 *     description: Allows a user who has verified their email via OTP to reset their password.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: testingofashutosh@gmail.com
 *               password:
 *                 type: string
 *                 example: "#@Test420"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Password Changed Successfully
 *       400:
 *         description: User with such credentials does not exist
 *       404:
 *         description: User not verified
 *       500:
 *         description: Internal server error
 */

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
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user with email and password
 *     description: Authenticates a user by verifying email and password. Returns a JWT token as an HTTP-only cookie on successful login.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: testingofashutosh@gmail.com
 *               password:
 *                 type: string
 *                 example: "#@Test420"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User Loggedin Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Ashutosh Gandule
 *                     email:
 *                       type: string
 *                       example: testingofashutosh@gmail.com
 *                     role:
 *                       type: string
 *                       example: user
 *       400:
 *         description: User must set password first using forget password
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.post("/login", parseRequestBody(Password), handleUserLogin);
/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout a user
 *     description: Clears the authentication token cookie to log out the user.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User loggedout Successfully
 *       500:
 *         description: Internal server error
 */

router.post("/logout", handleUserLogout);
/**
 * @swagger
 * /user/admin/requests:
 *   get:
 *     summary: Fetch all organizer requests
 *     description: Retrieves all requests submitted by organizers. Requires admin authentication and authorization.
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []   # Assuming JWT token is sent via cookie
 *     responses:
 *       200:
 *         description: Requests fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Requests fetched Successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "req_123456"
 *                       organizerId:
 *                         type: string
 *                         example: "org_98765"
 *                       eventName:
 *                         type: string
 *                         example: "Tech Conference 2025"
 *                       status:
 *                         type: string
 *                         example: "pending"
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, user not admin
 *       500:
 *         description: Internal server error
 */

router.get("/admin/requests", checkAuthentication, checkAuthorizationAdmin, handleOrganizerRequests);
/**
 * @swagger
 * /user/admin:
 *   post:
 *     summary: Approve or reject an organizer request
 *     description: Allows an admin to approve or reject an organizer request. Approving creates a new organizer user and sends an approval email. Rejecting deletes the request and sends a rejection email with a reason.
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []   # JWT token sent via cookie
 *     parameters:
 *       - in: query
 *         name: approve
 *         schema:
 *           type: string
 *         description: ID of the request to approve
 *       - in: query
 *         name: reject
 *         schema:
 *           type: string
 *         description: ID of the request to reject
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Police Background"
 *                 description: Reason for rejection (required if rejecting)
 *     responses:
 *       200:
 *         description: Request processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   enum: ["Request Approved Successfully", "Request Rejected Successfully"]
 *                 data:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: Request not found
 *       400:
 *         description: Invalid request body or missing rejection reason
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, user not admin
 *       500:
 *         description: Internal server error
 */

router.post("/admin", parseRequestBody(rejectionReason), handleApproveRequest);
/**
 * @swagger
 * /user/sendOtp:
 *   post:
 *     summary: Send a One-Time Password (OTP) to a user's email
 *     description: Generates a 6-digit OTP and sends it to the provided email. The OTP is valid for 5 minutes. Users must wait 1 minute before requesting a new OTP.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: spamofashutosh@gmail.com
 *     responses:
 *       201:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Otp Send Successfully valid for 5 mins
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: spamofashutosh@gmail.com
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-23T18:30:00.000Z"
 *       400:
 *         description: Must wait 1 minute before requesting a new OTP
 *       500:
 *         description: Internal server error
 */

router.post("/sendOtp", parseRequestBody(sendOtp), handleSendOtp);
/**
 * @swagger
 * /user/verifyOtp:
 *   post:
 *     summary: Verify a One-Time Password (OTP)
 *     description: Checks the provided OTP against the stored hashed OTP for the given email. Marks OTP as verified if correct and not expired.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: spamofashutosh@gmail.com
 *               otp:
 *                 type: string
 *                 example: "635775"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Otp Verified Successfully
 *       400:
 *         description: Invalid OTP, please try again
 *       404:
 *         description: Invalid credentials, OTP not found
 *       410:
 *         description: OTP expired
 *       500:
 *         description: Internal server error
 */

router.post("/verifyOtp", parseRequestBody(verifyOtp), handleVerifyOtp);

export default router;