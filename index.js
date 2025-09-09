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

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(errorHandling);

//routes
app.use("/user", userRoutes);
app.use("/event", eventRoutes);

//starting server
app.listen(PORT, () => {
    console.log(`Server Started at PORT:${PORT}`)
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