import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
configDotenv();

const app = express();
const PORT = process.env.PORT || 8000;

//customModules
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import errorHandling from "./middlewares/errorHandler.js";
import { initBoss } from "./config/db.js";
import { registerEmailJob } from "./jobs/emailjob.js";

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(errorHandling);

//routes
app.use("/user", userRoutes);
app.use("/event", eventRoutes);

//starting server
async function start() {
    await initBoss();
    await registerEmailJob();

    app.listen(PORT, () => {
        console.log("🚀 API + Worker running on http://localhost:4001");
    });
}

start().catch((err) => {
    console.error("Failed to start:", err);
    process.exit(1);
});

//Things to be add
//1. Implement Nodemailer
//2. Use otp to verify email while createAccout and login
//3. When organizer do first login send otp and then change password
//4. add isTemporaryPassword field to user schema
//5. while sneding otp check one if the email is already verified if yes then don't send otp
//6. cooldoen period to send otp
//7. user otp deletion after 
//8. While organizing the event must be organized atlest more than one day