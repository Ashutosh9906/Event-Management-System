import { Router } from "express";
import { handleCancelEvent, handleOrganizeEvent, handleEditEvent, handleGetAllEvents } from "../controllers/event.js";
import { checkAuthentication, checkAuthorizationOrganizer } from "../middlewares/auth.js";
import { parseRequestBody } from "../middlewares/parseBody.js";
import { createEventSchema } from "../schema/eventSchema.js";

const router = Router();

router.post("/organize", checkAuthentication, checkAuthorizationOrganizer, parseRequestBody(createEventSchema), handleOrganizeEvent);
router.delete("/cancelEvent/:id", checkAuthentication, checkAuthorizationOrganizer, handleCancelEvent);
router.patch("/editEvent/:id", checkAuthentication, checkAuthorizationOrganizer, parseRequestBody(createEventSchema), handleEditEvent);
router.get("/", handleGetAllEvents);

export default router;