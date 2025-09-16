import { boss } from "../config/db.js";
import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
import { sendMailToAttendes } from "../utilities/email.js";
configDotenv();

const QUEUE = "email-queue";

export async function registerEmailJob() {
    await boss.createQueue(QUEUE);

    await boss.work(QUEUE, async (job) => {
        console.log(job);
        sendMailToAttendes(job[0].data.user, job[0].data.to, job[0].data.subject, job[0].data.message);
        console.log(`✅ Sent email to ${job[0].data.to}`);
    });
}

export async function enqueueEmail(data) {
    return boss.send(QUEUE, data);
}
