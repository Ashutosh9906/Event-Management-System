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
    mode: z.enum(["ONLINE", "OFFLINE"]),
    destination: z.string().min(5, "min 5 char in string"),
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

const mailAttendes = z.object({
    subject: z.string().min(5, "min 5 char in subject").max(50, "Max 50 char in subject"),
    message: z.string().min(10, "min 10 char in message"),
    eventId: z.string().cuid({ message: "Invalid Event ID" })
})

const rejectionReason = z.object({
    reason: z.string().min(5, "min 5 char to be in reason").optional()
})

const UserFeedback = z.object({
    eventId: z.string().cuid({ message: "Invalid Event Id" }),
    rating: z.number().int().min(1, "Invalid Rating").max(5, "Invalid Rating"),
    feedback: z.string().min(4, "min size 4 char")
})

const cancelEvent = z.object({
    password: z.string()
        .min(8, "Password must be atleast 8 char long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one Upper letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
    reason: z.string().min(4, "min size 4 char")
})

export {
    createEventSchema,
    createEventRegistrationSchema,
    mailAttendes,
    rejectionReason,
    UserFeedback,
    cancelEvent
}