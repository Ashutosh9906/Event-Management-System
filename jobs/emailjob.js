    import { boss } from "../config/db.js";
    import nodemailer from "nodemailer";
    import { configDotenv } from "dotenv";
    import { sendEmail } from "../utilities/email.js";
    import { cancelEvent, eventUpdates, mailAttendes } from "../templates/eventTemplates.js";
    import { approveRequest, cancelRegistration, makeRegistration, otpTemplate, rejectRequest } from "../templates/userTemplates.js";
    configDotenv();

    const QUEUE = "email-queue";

    export async function registerEmailJob() {
        await boss.createQueue(QUEUE);

        await boss.work(QUEUE, async (job) => {
            
            // console.log(job);

            // const transporter = nodemailer.createTransport({
            //     service: "gmail",
            //     auth: {
            //         user: process.env.MAIL_USER,
            //         pass: process.env.MAIL_PASS,
            //     },
            // });

            // await transporter.sendMail({
            //     from: process.env.MAIL_USER,
            //     to: job[0].data.to,
            //     subject: job[0].data.subject,
            //     text: job[0].data.message,
            // });

            if(job[0].data.templateName == "mailAttendes"){
                sendEmail(job[0].data.to, mailAttendes(job[0].data.user, job[0].data.message, job[0].data.subject));
            } else if (job[0].data.templateName == "eventUpdates"){
                sendEmail(job[0].data.to, eventUpdates(job[0].data.updatedEventDetails, job[0].data.user));
            } else if (job[0].data.templateName == "cancelEvent"){
                sendEmail(job[0].data.to, cancelEvent(job[0].data.user, job[0].data.eventCanceledDetail, job[0].data.reason))
            } else if (job[0].data.templateName == "otpTemplate"){
                sendEmail(job[0].data.to, otpTemplate(job[0].data.otp))
            } else if (job[0].data.templateName == "approveRequest"){
                sendEmail(job[0].data.to, approveRequest(job[0].data.approvedUser))
            } else if (job[0].data.templateName == "rejectRequest"){
                sendEmail(job[0].data.to, rejectRequest(job[0].data.request, job[0].data.reason))
            } else if (job[0].data.templateName == "makeRegistration"){
                sendEmail(job[0].data.to, makeRegistration(job[0].data.newRegistration))
            } else if (job[0].data.templateName == "cancelRegistration"){
                sendEmail(job[0].data.to, cancelRegistration(job[0].data.registration))
            } else {
                console.log("Error sending email");
            }

            console.log(`✅ Sent email to ${job[0].data.to}`);
        });
    }

    export async function enqueueEmail(data) {
        return boss.send(QUEUE, data);
    }
