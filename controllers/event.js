import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { int } from "zod";
import { sendMailToAttendes, sendRegistrationApproved, sendRegistrationCancel, snedEventCanceled } from "../utilities/email.js";

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
        const { title, description, category, date, mode, destination, availableSeats } = res.locals.validated;
        const organizerId = req.user.id;
        const event = await prisma.event.create({
            data: { title, description, category, date, mode, destination, availableSeats, organizerId },
            select: {
                title: true, 
                description: true, 
                category: true, 
                date: true, 
                mode: true, 
                destination: true, 
                availableSeats: true
            }
        });
        return handleResponse(res, 200, "Event Scheduled Successfully", event);
    } catch (error) {
        next(error);
    }
}

async function handleCancelEvent(req, res, next) {
    try {
        const { password, reason } = req.body;
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
        const events = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                organizer: {
                    select: {
                        name: true
                    }
                },
                registrations: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                email: true,

                            }
                        }
                    }
                }
            }
        })
        for(let ticket of events.registrations){
            snedEventCanceled(ticket.user, events, reason, ticket.user.email);
        }
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
            // console.log(allEvents);
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
                            mode: true,
                            destination: true,
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

async function handleCancelRegistration(req, res, next) {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;
        // console.log("EventId: " + eventId + " UserId: " + userId);
        await prisma.$transaction(async (tx) => {
            const event = await tx.event.findUnique({
                where: { id: eventId },
                select: { isCanceled: true, availableSeats: true }
            });
            if (!event) throw new Error("NO_EVENT");
            if (event.date < new Date()) throw new Error("PAST_EVENT");

            const isRegistration = await tx.registration.findUnique({
                where: { userId_eventId: { userId, eventId } }
            });
            if (!isRegistration) throw new Error("NO_REGISTRATION");

            const registration = await prisma.registration.delete({
                where: { userId_eventId: { userId, eventId } },
                include: {
                    event: {
                        select: {
                            title: true,
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
            });

            registration.status = "CANCELLED";
            const now = new Date();
            const formatted = now.toString();
            registration.createdAt = formatted;

            await tx.event.update({
                where: { id: eventId },
                data: { availableSeats: { increment: 1 } }
            });

            sendRegistrationCancel(registration, registration.user.email);

            return handleResponse(res, 200, "Registration cancelled successfully", registration);
        })
    } catch (error) {
        if (error.message === "NO_EVENT") return handleResponse(res, 404, "No Such Active Event");
        if (error.message === "PAST_EVENT") return handleResponse(res, 400, "The event has already passed");
        if (error.message === "NO_REGISTRATION") return handleResponse(res, 404, "No registration with those credentials");
        next(error);
    }
}

async function handleMailAttendes(req, res, next){
    try {
        const { subject, message, eventId } = res.locals.validated;
        const organizerId = req.user.id;
        const registration = await prisma.registration.findMany({
            where: { eventId },
            include: {
                event: {
                    select: {
                        title: true,
                        organizer: {
                            select: {
                                id: true,
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
        });
        if(organizerId != registration[0].event.organizer.id) return handleResponse(res, 400, "You are unauthorized to send mail for this event");
        for(let user of registration){
            sendMailToAttendes(user, user.user.email, subject, message);
        }
        return handleResponse(res, 200, "Registration fetched successfully", registration);
    } catch (error) {
        next(error);
    }
}

export {
    handleOrganizeEvent,
    handleCancelEvent,
    handleEditEvent,
    handleGetEvents,
    handleEventRegistration,
    handleCancelRegistration,
    handleMailAttendes
}

//1. While deletion take password from the user to confirm that's it is not by mistake
//2. Check if the user requestiong to delete the event is hosted by him or not
//3. isCancelled Boolean Variable
//4. if the event is passed then he can't delete that post
//5. while deletion do soft delete
//6. while updating if available seats if the number of registration for that specific event is above the new available seats than give an error
//7. Cancel registration -Done
//8. organizer to mail all its registerd attendes -Done
//9. review of the event after its half an hour
//10. destination of event if offline and add modes online, offline -Done
//11. sending the reject request with an reason -Done
//12. cancel event take reason from organizer and send mial to all rigister attendes with reason
//13. all my registrstion
//14. after updation of the something in event send email to attendes
//15. after cancellation of event send email to attendes of cancellation