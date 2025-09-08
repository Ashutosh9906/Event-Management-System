import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createTokenUser } from "../utilities/auth.js";
import crypto from "crypto";
import { sendOtp, sendRequestApproved } from "../utilities/email.js";

const prisma = new PrismaClient();

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

async function handleCreateAccount(req, res, next) {
    const role = req.body.role
    try {
        if (role == "ATTENDEE") {
            const { name, email, password } = req.body;
            const isUser = await prisma.user.findUnique({
                where: { email }
            });
            if(isUser) return handleResponse(res, 400, "User Already exist");
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifiedUser = await prisma.otp.findFirst({
                where: { email }
            })
            if (!verifiedUser || !verifiedUser.isVerified) return handleResponse(res, 400, "User Not Verified");
            const newUser = await prisma.user.create({
                data: { name, email, password: hashedPassword, role, isVerified: verifiedUser.isVerified },
                select: { name: true, email: true, role: true }
            });
            await prisma.otp.delete({
                where: { id: verifiedUser.id }
            });
            const token = createTokenUser(newUser.id, newUser.role);
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            })
            return handleResponse(res, 201, "User Created Successully", newUser);
        } else if (role == "ORGANIZER") {
            const { name, organization, email, ContactNo, purpose } = req.body;
            const verifiedUser = await prisma.otp.findFirst({
                where: { email }
            })
            if (!verifiedUser) return handleResponse(res, 400, "User Not Verified");
            if (!verifiedUser.isVerified) return handleResponse(res, 400, "User Not Verified");
            const newOrganizer = await prisma.requests.create({
                data: { name, organization, email, ContactNo, purpose, isVerified: verifiedUser.isVerified },
                select: { name: true, organization: true, email: true, ContactNo: true }
            });
            await prisma.otp.delete({
                where: { id: verifiedUser.id }
            })
            return handleResponse(res, 201, "Approval Request Created Successfully", newOrganizer);
        } else {
            return handleResponse(res, 201, "Invalid Role");
        }
    } catch (error) {
        next(error);
    }
}

async function handleUserLogin(req, res, next) {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) return handleResponse(res, 404, "User Not Found");
        if (user.isPasswordSet) {
            const isMatch = await bcrypt.compare(password, user.password);
            // console.log(isMatch);
            if (!isMatch) return handleResponse(res, 401, "Invalid Credentials");
            const token = createTokenUser(user.id, user.role);
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            })
            return handleResponse(res, 200, "User Loggedin Successfully", {
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            return handleResponse(res, 400, "Set Your Password First using forget Password");
        }
    } catch (error) {
        next(error);
    }
}

function handleUserLogout(req, res, next) {
    try {
        res.clearCookie('token');
        return handleResponse(res, 200, "User loggedout Successfully");
    } catch (error) {
        next(error);
    }
}

async function handleOrganizerRequests(req, res, next) {
    try {
        const requests = await prisma.requests.findMany();
        return handleResponse(res, 200, "Requests fetched Successfully", requests);
    } catch (error) {
        next(error);
    }
}

async function handleApproveRequest(req, res, next) {
    try {
        const requestId = req.params.id;
        const request = await prisma.requests.findUnique({
            where: { id: requestId }
        });
        if (!request) return handleResponse(res, 404, "Request Not Found");
        const approvedUser = await prisma.user.create({
            data: {
                name: request.name,
                email: request.email,
                password: "",
                role: "ORGANIZER",
                organization: request.organization,
                isVerified: request.isVerified,
                isPasswordSet: false
            },
            select: { name: true, email: true, role: true, organization: true }
        });
        sendRequestApproved(approvedUser, approvedUser.email);
        await prisma.requests.delete({
            where: { id: requestId }
        });
        return handleResponse(res, 200, "Request Approved Successfully", approvedUser);
    } catch (error) {
        next(error);
    }
}

async function handleSendOtp(req, res, next) {
    try {
        const { email } = req.body;
        const oldOtp = await prisma.otp.findUnique({
            where: { email }
        });
        if(oldOtp){
            const now = new Date();
            const diffMs = now - otpRecord.createdAt;
            const diffMinutes = diffMs / (1000 * 60);
            if(diffMinutes < 1) return handleResponse(res, 400, "You must wait 1 minute before requesting a new OTP");
            else {
                await prisma.otp.delete({
                    where: { email }
                })
            }
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        sendOtp(otp, email);
        const hashedOtp = await bcrypt.hash(otp, 10);
        const generatedOtp = await prisma.otp.create({
            data: { otp: hashedOtp, email, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
            select: { email: true, expiresAt: true }
        });
        return handleResponse(res, 201, "Otp Send Successfully valid for 5 mins", generatedOtp);
    } catch (error) {
        next(error);
    }
}

async function handleVerifyOtp(req, res, next) {
    try {
        const { email, otp } = req.body;
        // console.log(req.body);
        const userOtp = await prisma.otp.findUnique({
            where: { email }
        });
        if(!userOtp) return handleResponse(res, 404, "Invalid Credentials");
        // console.log(userOtp);
        const isMatch = await bcrypt.compare(otp, userOtp.otp);
        if (!isMatch) return handleResponse(res, 400, "Invalid Otp Please Try Again");
        if (userOtp.expiresAt < new Date()) return handleResponse(res, 410, "Otp Expired");
        await prisma.otp.update({
            where: { id: userOtp.id },
            data: { isVerified: true }
        });
        return handleResponse(res, 200, "Otp Verified Successfully");
    } catch (error) {
        next(error);
    }
}

async function handleForgetPassword(req, res, next){
    try {
        // console.log("forgot password request", req.body)
        const { email, password } = req.body;
        const verifiedUser = await prisma.otp.findFirst({
            where: { email }
        })
        if(!verifiedUser || !verifiedUser.isVerified) return handleResponse(res, 404, "User not verified");
        const user = await prisma.user.findUnique({
            where: { email },
            select: { name: true, email: true, role: true }
        });
        if(!user) return handleResponse(res, 400, "User with such credentials does not exist");
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword, isPasswordSet: true }
        });
        await prisma.otp.delete({
            where: { email }
        });
        return handleResponse(res, 200, "Password Changed Successfully")
    } catch (error) {
        next();
    }
}

export {
    handleCreateAccount,
    handleUserLogin,
    handleUserLogout,
    handleOrganizerRequests,
    handleApproveRequest,
    handleSendOtp,
    handleVerifyOtp,
    handleForgetPassword
}