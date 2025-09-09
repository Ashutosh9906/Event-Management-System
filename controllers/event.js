import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

async function handleOrganizeEvent(req, res, next){
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

async function handleCancelEvent(req, res, next){
    try {
        const { password } = req.body;
        const eventId = req.params.id;
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });
        if(!event) return handleResponse(res, 404, "No such event scheduled");
        const organizerId = req.user.id;
        if(event.organizerId != organizerId) return handleResponse(res, 400, "Unauthorized Organizer to delete Cancel Event");
        if(event.isCanceled) return handleResponse(res, 400, "Event is already been canceled");
        if(event.date.getTime() < Date.now()) return handleResponse(res, 400, "Event has already been passed");
        const organizer = await prisma.user.findUnique({
            where: { id: organizerId }
        });
        const isMatch = await bcrypt.compare(password, organizer.password);
        if(!isMatch) return handleResponse(res, 400, "Invalid Credentials");
        await prisma.event.update({
            where: { id: eventId },
            data: { isCanceled: true }
        });
        return handleResponse(res, 400, "Event has been canceled Successfully");
    } catch (error) {
        next(error);
    }
}

async function handleEditEvent(req, res, next){
    try {
        const organizerId = req.user.id;
        const id = req.params.id;
        const event = await prisma.event.findUnique({
            where: { id }
        });
        if(!event) return handleResponse(res, 400, "No Such Event Scheduled");
        if(event.isCanceled) return handleResponse(res, 400, "Event is already been canceled");
        if(event.organizerId != organizerId) return handleResponse(res, 400, "Unauthorized to edit Event");
        const { title, description, category, date, availableSeats } = res.locals.validated;
        if(event.date.getTime() < Date.now()) return handleResponse(res, 400, "Event has already been passed");
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

async function handleGetAllEvents(req, res, next){
    try {
        const events = await prisma.event.findMany();
        return handleResponse(res, 200, "Events Fetched Successfully", events);
    } catch (error) {
        next(error);
    }
}

export {
    handleOrganizeEvent,
    handleCancelEvent,
    handleEditEvent,
    handleGetAllEvents
}

//1. While deletion take password from the user to confirm that's it is not by mistake
//2. Check if the user requestiong to delete the event is hosted by him or not
//3. isCancelled Boolean Variable
//4. if the event is passed then he can't delete that post
//5. while deletion do soft delete
//6. while updating if available seats if the number of registration for that specific event is above the new available seats than give an error