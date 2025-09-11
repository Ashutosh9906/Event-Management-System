import { z } from "zod";

const categoryEnum = z.enum(["CONFERENCE", "WORKSHOP", "MEETUP", "WEBINAR"]);

const createEventSchema = z.object({
    title: z.string().min(3, "Title must be atlest 3 characters long"),
    description: z.string().min(10, "Description must be atlest 3 characters long"),
    category: categoryEnum.default("CONFERENCE"),
    date: z.preprocess(
        (arg) => (typeof(arg) === "string" ? new Date(arg) : arg),
        z.date().refine(
            (d) => d.getTime() > Date.now() + 24 * 60 * 60 * 1000,
            { message: "Event Date must be at least 1 day ahead in the future" }
        )
    ),
    availableSeats:z.number()
                    .int()
                    .min(100, { message: "seats must be atleast 100" })
                    .max(500, { message: "seats can't exceed 500" })
                    .default(100)
});

const eventStatusEnum = z.enum(["REGISTERED", "CANCELLED"])

const createEventRegistrationSchema = z.object({
    eventId: z.string().cuid({ message: "Invalid Event ID" }),
    status: eventStatusEnum.default("REGISTERED"),
})

export {
    createEventSchema,
    createEventRegistrationSchema,
}