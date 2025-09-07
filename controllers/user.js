import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createTokenUser } from "../utilities/auth.js";
import crypto from "crypto";

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
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: { name, email, password: hashedPassword, role },
                select: { name: true, email: true, role: true }
            });
            const token = createTokenUser(user.id, user.role);
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            })
            return handleResponse(res, 201, "User Created Successully", newUser);
        } else if (role == "ORGANIZER"){
            const { name, organization, email, ContactNo, purpose } = req.body;
            const newOrganizer = await prisma.requests.create({
                data: { name, organization, email, ContactNo, purpose },
                select: { name: true, organization: true, email: true, ContactNo: true }
            });
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

async function handleOrganizerRequests(req, res, next){
    try {
        const requests = await prisma.requests.findMany();
        return handleResponse(res, 200, "Requests fetched Successfully", requests);
    } catch (error) {
        next(error);
    }
}

async function handleApproveRequest(req, res, next){
    try {
        const requestId = req.params.id;
        const request = await prisma.requests.findUnique({
            where: { id: requestId }
        });
        if(!request) return handleResponse(res, 404, "Request Not Found");
        const temporaryPassword = crypto.randomBytes(12).toString("base64").slice(0, 12);
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
        const approvedUser = await prisma.user.create({
            data: { name: request.name, email: request.email, password: hashedPassword, role: "ORGANIZER" },
            select: { name: true, email: true, role: true }
        });
        await prisma.requests.delete({
            where: { id: requestId }
        });
        return handleResponse(res, 200, "Request Approved Successfully", approvedUser);
    } catch (error) {
        next(error);
    }
}

export {
    handleCreateAccount,
    handleUserLogin,
    handleUserLogout,
    handleOrganizerRequests,
    handleApproveRequest
}