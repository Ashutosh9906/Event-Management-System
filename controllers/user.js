import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handleResponse = (res, status, message, data=null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

async function handleCreateAccount(req, res, next){
    const { name, email, password } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: { name, email, password }
        });
        return handleResponse(res, 201, "User Created Successully", newUser);
    } catch (error) {
        next(error);
    }
}

export {
    handleCreateAccount
}