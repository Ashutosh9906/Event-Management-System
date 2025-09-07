import jwt from "jsonwebtoken";

function createTokenUser(id, role) {
    const token = jwt.sign(
        { id, role },
        process.env.SECRET,
        { expiresIn: "1d" }
    );
    return token;
}

export {
    createTokenUser,
}