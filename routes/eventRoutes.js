import { Router } from "express";
import {handleCancelEvent, 
        handleOrganizeEvent, 
        handleEditEvent, 
        handleGetEvents,  
        handleEventRegistration,
        handleCancelRegistration,
        handleMailAttendes,
        handleGetMyRegistrations,
        handleGetEventRegistrations,
        hanldeEventFeedback,
        handleGetEventFeedback
    } from "../controllers/event.js";
import { checkAuthentication, checkAuthorizationAttendee, checkAuthorizationOrganizer } from "../middlewares/auth.js";
import { parseRequestBody } from "../middlewares/parseBody.js";
import { createEventRegistrationSchema, createEventSchema, cancelEvent, mailAttendes, UserFeedback } from "../schema/eventSchema.js";

const router = Router();

/**
 * @swagger
 * /event:
 *   get:
 *     summary: Get all events with optional filters
 *     description: Fetches upcoming events. Supports filtering by category, date range, and limit.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: WORKSHOP
 *         description: Filter events by category
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-09-23T00:00:00.000Z"
 *         description: Start date for filtering events
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-09-30T23:59:59.000Z"
 *         description: End date for filtering events
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Maximum number of events to return
 *     responses:
 *       200:
 *         description: Events fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: All events fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: cmfpgd88l0001u472zqz8sh2b
 *                       title:
 *                         type: string
 *                         example: Prisma ORM, PostgreSQL
 *                       description:
 *                         type: string
 *                         example: Event for discussing and learning about PostgreSQL
 *                       category:
 *                         type: string
 *                         example: MEETUP
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-25T12:00:00.000Z"
 *                       mode:
 *                         type: string
 *                         example: OFFLINE
 *                       destination:
 *                         type: string
 *                         example: Near R.K. Biryanni House
 *                       availableSeats:
 *                         type: integer
 *                         example: 150
 *       500:
 *         description: Internal server error
 */

router.get("/", handleGetEvents);
/**
 * @swagger
 * /event/organize:
 *   post:
 *     summary: Organize a new event
 *     description: Allows an organizer to schedule a new event. Requires authentication and organizer role.
 *     tags:
 *       - Event
 *     security:
 *       - cookieAuth: []   # JWT token sent via cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - date
 *               - mode
 *               - destination
 *               - availableSeats
 *             properties:
 *               title:
 *                 type: string
 *                 example: Prisma ORM, PostgreSQL
 *               description:
 *                 type: string
 *                 example: "Event for discussing and learning more things about PostgreSQL"
 *               category:
 *                 type: string
 *                 enum: [WORKSHOP, MEETUP, SEMINAR, CONFERENCE]
 *                 example: MEETUP
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-25T12:00:00.000Z"
 *               mode:
 *                 type: string
 *                 enum: [ONLINE, OFFLINE]
 *                 example: OFFLINE
 *               destination:
 *                 type: string
 *                 example: Near R.K. Biryanni House
 *               availableSeats:
 *                 type: integer
 *                 example: 150
 *     responses:
 *       200:
 *         description: Event scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Event Scheduled Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Prisma ORM, PostgreSQL
 *                     description:
 *                       type: string
 *                       example: Event for discussing and learning more things about PostgreSQL
 *                     category:
 *                       type: string
 *                       example: MEETUP
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-25T12:00:00.000Z"
 *                     mode:
 *                       type: string
 *                       example: OFFLINE
 *                     destination:
 *                       type: string
 *                       example: Near R.K. Biryanni House
 *                     availableSeats:
 *                       type: integer
 *                       example: 150
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, user is not an organizer
 *       500:
 *         description: Internal server error
 */

router.post("/organize", checkAuthentication, checkAuthorizationOrganizer, parseRequestBody(createEventSchema), handleOrganizeEvent);
/**
 * @swagger
 * /event/cancelEvent/{id}:
 *   delete:
 *     summary: Cancel an event
 *     description: Allows an organizer to cancel their own event. Sends cancellation emails to all registered users. Requires authentication and organizer role.
 *     tags:
 *       - Event
 *     security:
 *       - cookieAuth: []   # JWT token sent via cookie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to cancel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - reason
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "#@PAks54488598"
 *               reason:
 *                 type: string
 *                 example: "Not enough funds to host event on that scale"
 *     responses:
 *       200:
 *         description: Event canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Event has been canceled Successfully
 *       400:
 *         description: Unauthorized organizer, invalid credentials, or event already canceled/past
 *       404:
 *         description: Event not found
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, user not organizer
 *       500:
 *         description: Internal server error
 */

router.delete("/cancelEvent/:id", checkAuthentication, checkAuthorizationOrganizer, parseRequestBody(cancelEvent), handleCancelEvent);
/**
 * @swagger
 * /event/editEvent/{id}:
 *   patch:
 *     summary: Edit an event
 *     description: Allows an organizer to edit details of their scheduled event. Sends update emails to all registered attendees. Requires authentication and organizer role.
 *     tags:
 *       - Event
 *     security:
 *       - cookieAuth: []   # JWT token sent via cookie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - date
 *               - availableSeats
 *               - mode
 *               - destination
 *             properties:
 *               title:
 *                 type: string
 *                 example: MongoDB BootCamp by Ashutosh
 *               description:
 *                 type: string
 *                 example: "A student interaction program with hands-on experience, doubt clearance, and a quiz with goodies for top scorers."
 *               category:
 *                 type: string
 *                 enum: [WORKSHOP, MEETUP, SEMINAR, CONFERENCE]
 *                 example: WORKSHOP
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-30T12:00:00.000Z"
 *               mode:
 *                 type: string
 *                 enum: [ONLINE, OFFLINE]
 *                 example: ONLINE
 *               destination:
 *                 type: string
 *                 example: Microsoft Teams
 *               availableSeats:
 *                 type: integer
 *                 example: 200
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Event updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: MongoDB BootCamp by Ashutosh
 *                     description:
 *                       type: string
 *                       example: "A student interaction program with hands-on experience, doubt clearance, and a quiz with goodies for top scorers."
 *                     category:
 *                       type: string
 *                       example: WORKSHOP
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-30T12:00:00.000Z"
 *                     availableSeats:
 *                       type: integer
 *                       example: 200
 *                     mode:
 *                       type: string
 *                       example: ONLINE
 *                     destination:
 *                       type: string
 *                       example: Microsoft Teams
 *       400:
 *         description: No such event, unauthorized organizer, invalid update, or event already passed/canceled
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, user is not an organizer
 *       500:
 *         description: Internal server error
 */

router.patch("/editEvent/:id", checkAuthentication, checkAuthorizationOrganizer, parseRequestBody(createEventSchema), handleEditEvent);
/**
 * @swagger
 * /event/registration:
 *   post:
 *     summary: Register for an event
 *     description: Allows an attendee to register for an active event. Requires authentication and attendee role.
 *     tags:
 *       - Event
 *     security:
 *       - cookieAuth: []   # JWT token sent via cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: cmfpgd88l0001u472zqz8sh2b
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Registration Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: REGISTERED
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-23T18:30:00.000Z"
 *                     event:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                           example: Prisma ORM, PostgreSQL
 *                         date:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-09-25T12:00:00.000Z"
 *                         mode:
 *                           type: string
 *                           example: OFFLINE
 *                         destination:
 *                           type: string
 *                           example: Near R.K. Biryanni House
 *                         organizer:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: Ashutosh Gandule
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: Testing420
 *                         email:
 *                           type: string
 *                           example: testingofashutosh@gmail.com
 *       400:
 *         description: Invalid request (event passed, no seats, already registered)
 *       404:
 *         description: Event not found or has been canceled
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, user is not an attendee
 *       500:
 *         description: Internal server error
 */

router.post("/registration", checkAuthentication, checkAuthorizationAttendee, parseRequestBody(createEventRegistrationSchema), handleEventRegistration);
/**
 * @swagger
 * /event/cancelRegistration/{id}:
 *   post:
 *     summary: Cancel a registration
 *     description: Allows an attendee to cancel their event registration. Requires authentication and attendee role.
 *     tags:
 *       - Event
 *     security:
 *       - cookieAuth: []   # JWT token sent via cookie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event for which the registration is being canceled
 *     responses:
 *       200:
 *         description: Registration canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Registration cancelled successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: CANCELLED
 *                     createdAt:
 *                       type: string
 *                       example: Tue Sep 23 2025 20:30:00 GMT+0530 (India Standard Time)
 *                     event:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                           example: Prisma ORM, PostgreSQL
 *                         organizer:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: Ashutosh Gandule
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: Testing420
 *                         email:
 *                           type: string
 *                           example: testingofashutosh@gmail.com
 *       400:
 *         description: The event has already passed
 *       404:
 *         description: No such active event or no registration found
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, user is not an attendee
 *       500:
 *         description: Internal server error
 */

router.post("/cancelRegistration/:id", checkAuthentication, checkAuthorizationAttendee, handleCancelRegistration);
/**
 * @swagger
 * /event/mailAttendes:
 *   post:
 *     summary: Send an email to all attendees of an event
 *     description: Allows an organizer to send a custom message to all attendees registered for a specific event. Requires authentication and organizer role.
 *     tags:
 *       - Event
 *     security:
 *       - cookieAuth: []   # JWT token sent via cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *               - eventId
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Instructions about Event
 *               message:
 *                 type: string
 *                 example: "This is a reminder to join the event on time. Please check your registered email for details."
 *               eventId:
 *                 type: string
 *                 example: cmfpgd88l0001u472zqz8sh2b
 *     responses:
 *       200:
 *         description: Emails sent successfully to all registered attendees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Registration fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       event:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: MongoDB BootCamp by Ashutosh
 *                           organizer:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: org_12345
 *                               name:
 *                                 type: string
 *                                 example: Ashutosh Gandule
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Testing420
 *                           email:
 *                             type: string
 *                             example: testingofashutosh@gmail.com
 *       400:
 *         description: Unauthorized to send mail for this event
 *       404:
 *         description: No registrations found for this event
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, user is not an organizer
 *       500:
 *         description: Internal server error
 */

router.post("/mailAttendes", checkAuthentication, checkAuthorizationOrganizer, parseRequestBody(mailAttendes), handleMailAttendes)
/**
 * @swagger
 * /event/myRegistrations:
 *   get:
 *     summary: Get my event registrations
 *     description: Retrieves all upcoming and active event registrations for the logged-in attendee.
 *     tags:
 *       - Event
 *     security:
 *       - cookieAuth: []   # JWT token sent via cookie
 *     responses:
 *       200:
 *         description: My registrations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: my Registrations fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-23T18:30:00.000Z"
 *                       event:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: Prisma ORM, PostgreSQL
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-09-25T12:00:00.000Z"
 *                           isCanceled:
 *                             type: boolean
 *                             example: false
 *                           organizer:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: Ashutosh Gandule
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, user is not an attendee
 *       500:
 *         description: Internal server error
 */

router.get("/myRegistrations", checkAuthentication, checkAuthorizationAttendee, handleGetMyRegistrations)
/**
 * @swagger
 * /event/eventRegistrations:
 *   get:
 *     summary: Get all event registrations for organizer
 *     description: Retrieves all events created by the logged-in organizer along with details of registered attendees.
 *     tags:
 *       - Event
 *     security:
 *       - cookieAuth: []   # JWT token sent via cookie
 *     responses:
 *       200:
 *         description: All events with registrations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: All events with registrations fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       event:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: Prisma ORM, PostgreSQL
 *                           description:
 *                             type: string
 *                             example: Event for discussing and learning PostgreSQL
 *                           category:
 *                             type: string
 *                             example: MEETUP
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-09-25T12:00:00.000Z"
 *                           mode:
 *                             type: string
 *                             example: OFFLINE
 *                           destination:
 *                             type: string
 *                             example: Near R.K. Biryani House
 *                           availableSeats:
 *                             type: integer
 *                             example: 150
 *                           isCanceled:
 *                             type: boolean
 *                             example: false
 *                       registrations:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             user:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   example: John Doe
 *                                 email:
 *                                   type: string
 *                                   example: johndoe@example.com
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, user is not an organizer
 *       500:
 *         description: Internal server error
 */

router.get("/eventRegistrations", checkAuthentication, checkAuthorizationOrganizer, handleGetEventRegistrations)
/**
 * @swagger
 * /event/feedback:
 *   post:
 *     summary: Submit feedback for an event
 *     description: Allows a logged-in attendee to submit feedback and rating for an event. Feedback can only be submitted **30 minutes after the event starts**. User must be registered for the event.
 *     tags:
 *       - Event
 *     security:
 *       - cookieAuth: []   # JWT token sent via cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - rating
 *               - feedback
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: ID of the event to provide feedback for
 *                 example: cmfjayr9k0001u434j5okau20
 *               rating:
 *                 type: integer
 *                 description: Rating given by the attendee (1-5)
 *                 example: 3
 *               feedback:
 *                 type: string
 *                 description: Feedback text provided by the attendee
 *                 example: nicely done and executed scope of betterment
 *     responses:
 *       200:
 *         description: Feedback given successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Feedback given successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     rating:
 *                       type: integer
 *                       example: 3
 *                     feedback:
 *                       type: string
 *                       example: nicely done and executed scope of betterment
 *       400:
 *         description: Bad request – event not found, feedback given too early, or user not registered
 *       401:
 *         description: Unauthorized – user not logged in
 *       403:
 *         description: Forbidden – user is not an attendee
 *       500:
 *         description: Internal server error
 */

router.post("/feedback", checkAuthentication, checkAuthorizationAttendee, parseRequestBody(UserFeedback), hanldeEventFeedback)
/**
 * @swagger
 * /event/allFeedback/{id}:
 *   get:
 *     summary: Get all feedback for a specific event
 *     description: Retrieves all feedback given by attendees for a specific event. Returns attendee name and email along with their feedback.
 *     tags:
 *       - Event
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event to fetch feedback for
 *         schema:
 *           type: string
 *           example: cmfjayr9k0001u434j5okau20
 *     responses:
 *       200:
 *         description: Feedback fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Feedback fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: John Doe
 *                           email:
 *                             type: string
 *                             example: johndoe@example.com
 *       404:
 *         description: Event does not exist
 *       500:
 *         description: Internal server error
 */

router.get("/allFeedback/:id", handleGetEventFeedback);

export default router;