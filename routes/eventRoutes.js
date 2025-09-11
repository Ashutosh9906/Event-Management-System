import { Router } from "express";
import {handleCancelEvent, 
        handleOrganizeEvent, 
        handleEditEvent, 
        handleGetEvents,  
        handleEventRegistration
    } from "../controllers/event.js";
import { checkAuthentication, checkAuthorizationOrganizer } from "../middlewares/auth.js";
import { parseRequestBody } from "../middlewares/parseBody.js";
import { createEventRegistrationSchema, createEventSchema } from "../schema/eventSchema.js";

const router = Router();

router.post("/organize", checkAuthentication, checkAuthorizationOrganizer, parseRequestBody(createEventSchema), handleOrganizeEvent);
router.delete("/cancelEvent/:id", checkAuthentication, checkAuthorizationOrganizer, handleCancelEvent);
router.patch("/editEvent/:id", checkAuthentication, checkAuthorizationOrganizer, parseRequestBody(createEventSchema), handleEditEvent);
router.get("/", handleGetEvents);
router.post("/registration", checkAuthentication, parseRequestBody(createEventRegistrationSchema), handleEventRegistration)

export default router;