import { Router } from "express";
import {handleCancelEvent, 
        handleOrganizeEvent, 
        handleEditEvent, 
        handleGetEvents,  
        handleEventRegistration,
        handleCancelRegistration,
        handleMailAttendes
    } from "../controllers/event.js";
import { checkAuthentication, checkAuthorizationAttendee, checkAuthorizationOrganizer } from "../middlewares/auth.js";
import { parseRequestBody } from "../middlewares/parseBody.js";
import { createEventRegistrationSchema, createEventSchema, mailAttendes } from "../schema/eventSchema.js";

const router = Router();

router.get("/", handleGetEvents);
router.post("/organize", checkAuthentication, checkAuthorizationOrganizer, parseRequestBody(createEventSchema), handleOrganizeEvent);
router.delete("/cancelEvent/:id", checkAuthentication, checkAuthorizationOrganizer, handleCancelEvent);
router.patch("/editEvent/:id", checkAuthentication, checkAuthorizationOrganizer, parseRequestBody(createEventSchema), handleEditEvent);
router.post("/registration", checkAuthentication, checkAuthorizationAttendee, parseRequestBody(createEventRegistrationSchema), handleEventRegistration)
router.post("/cancelRegistration/:id", checkAuthentication, checkAuthorizationAttendee, handleCancelRegistration);
router.post("/mailAttendes", checkAuthentication, checkAuthorizationOrganizer, parseRequestBody(mailAttendes), handleMailAttendes)

export default router;