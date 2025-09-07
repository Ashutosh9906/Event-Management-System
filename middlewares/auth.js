import jwt from "jsonwebtoken";

function checkAuthentication(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
}

export {
    checkAuthentication
}