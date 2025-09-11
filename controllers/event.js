import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { int } from "zod";
import { sendRegistrationApproved } from "../utilities/email.js";

const prisma = new PrismaClient();

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

async function handleOrganizeEvent(req, res, next) {
    try {
        const { title, description, category, date, availableSeats } = res.locals.validated;
        const organizerId = req.user.id;
        const event = await prisma.event.create({
            data: { title, description, category, date, availableSeats, organizerId },
            select: { title: true, description: true, category: true, date: true, availableSeats: true }
        });
        return handleResponse(res, 200, "Event Scheduled Successfully", event);
    } catch (error) {
        next(error);
    }
}

async function handleCancelEvent(req, res, next) {
    try {
        const { password } = req.body;
        const eventId = req.params.id;
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });
        if (!event) return handleResponse(res, 404, "No such event scheduled");
        const organizerId = req.user.id;
        if (event.organizerId != organizerId) return handleResponse(res, 400, "Unauthorized Organizer to delete Cancel Event");
        if (event.isCanceled) return handleResponse(res, 400, "Event is already been canceled");
        if (event.date.getTime() < Date.now()) return handleResponse(res, 400, "Event has already been passed");
        const organizer = await prisma.user.findUnique({
            where: { id: organizerId }
        });
        const isMatch = await bcrypt.compare(password, organizer.password);
        if (!isMatch) return handleResponse(res, 400, "Invalid Credentials");
        await prisma.event.update({
            where: { id: eventId },
            data: { isCanceled: true }
        });
        return handleResponse(res, 400, "Event has been canceled Successfully");
    } catch (error) {
        next(error);
    }
}

async function handleEditEvent(req, res, next) {
    try {
        const organizerId = req.user.id;
        const id = req.params.id;
        const event = await prisma.event.findUnique({
            where: { id }
        });
        if (!event) return handleResponse(res, 400, "No Such Event Scheduled");
        if (event.isCanceled) return handleResponse(res, 400, "Event is already been canceled");
        if (event.organizerId != organizerId) return handleResponse(res, 400, "Unauthorized to edit Event");
        const { title, description, category, date, availableSeats } = res.locals.validated;
        if (event.date.getTime() < Date.now()) return handleResponse(res, 400, "Event has already been passed");
        const updatedEvent = await prisma.event.update({
            where: { id },
            data: { title, description, category, date, availableSeats, organizerId },
            select: { title: true, description: true, category: true, date: true, availableSeats: true }
        });
        return handleResponse(res, 200, "Event updated successfully", updatedEvent);
    } catch (error) {
        next(error);
    }
}

async function handleGetEvents(req, res, next) {
    try {
        const { category, from, to } = req.query;
        let { limit } = req.query;
        limit = parseInt(limit);
        if (category && limit) {
            const limitAndCategoryEvent = await prisma.event.findMany({
                where: {
                    date: {
                        gte: new Date(),
                    },
                    category,
                    isCanceled: false
                },
                orderBy: {
                    date: "asc",
                },
                take: limit
            })
            return handleResponse(res, 200, "Event within filter fetched successfull ( limit & category )", limitAndCategoryEvent);
        } else if (category && from && to) {
            const timeAndCategoryEvent = await prisma.event.findMany({
                where: {
                    date: {
                        gte: new Date(from),
                        lte: new Date(to)
                    },
                    category,
                    isCanceled: false
                },
                orderBy: {
                    date: "asc"
                }
            })
            return handleResponse(res, 200, "Event within filter fetched successfull ( date and category )", timeAndCategoryEvent);
        } else if (from && to && limit) {
            const timeAndLimitEvent = await prisma.event.findMany({
                where: {
                    date: {
                        gte: new Date(from),
                        lte: new Date(to)
                    },
                    isCanceled: false
                },
                orderBy: {
                    date: "asc"
                },
                take: limit
            })
            return handleResponse(res, 200, "Event within filter fetched successfull ( date & limit )", timeAndLimitEvent);
        } else if (category) {
            const categoryEvent = await prisma.event.findMany({
                where: { category, date: { gte: new Date() }, isCanceled: false },
                orderBy: {
                    date: "asc"
                }
            });
            return handleResponse(res, 200, "Event within filter fetched successfull ( category )", categoryEvent);
        } else if (from && to) {
            const timeEvent = await prisma.event.findMany({
                where: {
                    date: {
                        gte: new Date(from),
                        lte: new Date(to)
                    },
                    isCanceled: false
                },
                orderBy: {
                    date: "asc"
                }
            })
            return handleResponse(res, 200, "Event within filter fetched successfull ( date )", timeEvent);
        } else if (limit) {
            const limitEvent = await prisma.event.findMany({
                where: {
                    date: {
                        gte: new Date(),
                    },
                    date: { gte: new Date() },
                    isCanceled: false
                },
                orderBy: {
                    date: "asc",
                },
                take: limit
            })
            return handleResponse(res, 200, "Event within filter fetched successfull ( limit )", limitEvent);
        } else {
            const allEvents = await prisma.event.findMany({
                where: { isCanceled: false, date: { gte: new Date() } },
                orderBy: {
                    date: "asc"
                },
            });
            return handleResponse(res, 200, "All events fetched successfully", allEvents);
        }
    } catch (error) {
        next(error);
    }
}

async function handleEventRegistration(req, res, next) {
    try {
        const { eventId, status } = res.locals.validated;
        const userId = req.user.id;
        await prisma.$transaction(async (tx) => {
            const event = await tx.event.findUnique({
                where: { id: eventId },
                select: { isCanceled: true, availableSeats: true }
            });
            if (!event) throw new Error("NO_EVENT"); 
            if (event.date < new Date()) throw new Error("PAST_EVENT");
            if (event.availableSeats <= 0) throw new Error("NO_SEATS");

            const isRegistration = await tx.registration.findUnique({
                where: { userId_eventId: { userId, eventId } }
            })
            if (isRegistration) throw new Error("ALREADY_REGISTERED");
            const newRegistration = await tx.registration.create({
                data: { userId, eventId, status: "REGISTERED" },
                include: {
                    event: {
                        select: {
                            title: true,
                            date: true,
                            organizer: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            })

            await tx.event.update({
                where: { id: eventId },
                data: { availableSeats: { decrement: 1 } }
            });

            sendRegistrationApproved(newRegistration, newRegistration.user.email);

            return handleResponse(res, 200, "Registration Successfully", newRegistration)
        })
    } catch (error) {
        if (error.message === "NO_EVENT") return handleResponse(res, 404, "No Such Active Event");
        if (error.message === "PAST_EVENT") return handleResponse(res, 400, "The event has already passed");
        if (error.message === "NO_SEATS") return handleResponse(res, 400, "No seats available");
        if (error.message === "ALREADY_REGISTERED") return handleResponse(res, 400, "User already Registered");
        next(error);
    }
}

export {
    handleOrganizeEvent,
    handleCancelEvent,
    handleEditEvent,
    handleGetEvents,
    handleEventRegistration
}

//1. While deletion take password from the user to confirm that's it is not by mistake
//2. Check if the user requestiong to delete the event is hosted by him or not
//3. isCancelled Boolean Variable
//4. if the event is passed then he can't delete that post
//5. while deletion do soft delete
//6. while updating if available seats if the number of registration for that specific event is above the new available seats than give an error