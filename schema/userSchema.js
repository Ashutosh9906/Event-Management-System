import { email, z } from "zod";

const Password = z.object({
    email: z.string().email({ message: "Invalid Email" }),
    password: z.string()
        .min(8, "Password must be atleast 8 char long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one Upper letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)")
})

const newAttendee = z.object({
    name: z.string().min(4, "Too short name"),
    email: z.string().email({ message: "Invalis Email" }),
    password: z.string()
        .min(8, "Password must be atleast 8 char long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one Upper letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
    role: z.literal("ATTENDEE", {
        errorMap: () => ({ message: "Role must be attendee" }),
    }),
})

const newOrganizer = z.object({
    name: z.string().min(4, "Too short name"),
    organization: z.string(),
    email: z.string().email({ message: "Invalis Email" }),
    role: z.literal("ORGANIZER", {
        errorMap: () => ({ message: "Role must be organizer" }),
    }),
    ContactNo: z.string().min(10, "Invalid contact Number"),
    purpose: z.string().min(5, "Purpose to short please elavorate")
})

const otpSchema = z.union([
    z.object({
        email: z.string().email({ message: "Invalid email" })
    }),

    z.object({
        email: z.string().email({ message: "Invalid email" }),
        otp: z.string()
            .regex(/^\d{6}$/, "OTP must be exactly 6 digit")
    })
])

const createAccount = z.discriminatedUnion("role", [
    newAttendee,
    newOrganizer
])

export {
    Password,
    createAccount,
    otpSchema
}