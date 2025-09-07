import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createTokenUser } from "../utilities/auth.js";

const prisma = new PrismaClient();

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

async function handleCreateAccount(req, res, next) {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword },
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
            secure: process.env.NODE_ENV === "production",
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

function handleUserLogout(req, res, next){
    try {
        res.clearCookie('token');
        return handleResponse(res, 200, "User loggedout Successfully");
    } catch (error) {
        next(error);
    }
}

export {
    handleCreateAccount,
    handleUserLogin,
    handleUserLogout
}