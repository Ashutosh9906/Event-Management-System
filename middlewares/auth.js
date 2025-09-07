import jwt from "jsonwebtoken";

function checkAuthentication(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "User is unauthenticated" });
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
}

function checkAuthorization(req, res, next){
    try {
        const userRole = req.user.role;
        if(userRole != "ADMIN") return res.status(401).json({ error: "User is unauthorized" })
        next();
    } catch (error) {
        next(error);
    }
}

export {
    checkAuthentication,
    checkAuthorization
}