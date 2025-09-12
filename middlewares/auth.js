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

function checkAuthorizationAdmin(req, res, next){
    try {
        const userRole = req.user.role;
        if(userRole != "ADMIN") return res.status(401).json({ error: "User is unauthorized" })
        next();
    } catch (error) {
        next(error);
    }
}

function checkAuthorizationOrganizer(req, res, next){
    try {
        const userRole = req.user.role;
        if(userRole != "ORGANIZER") return res.status(401).json({ error: "User is unauthorized" })
        next();
    } catch (error) {
        next(error);
    }
}

function checkAuthorizationAttendee(req, res, next){
    try {
        const userRole = req.user.role;
        if(userRole != "ATTENDEE") return res.status(401).json({ error: "User is unauthorized" })
        next();
    } catch (error) {
        next(error);
    }
}

export {
    checkAuthentication,
    checkAuthorizationAdmin,
    checkAuthorizationOrganizer,
    checkAuthorizationAttendee
}