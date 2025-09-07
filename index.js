import express from "express";
import { configDotenv } from "dotenv";
configDotenv();

const app = express();
const PORT = process.env.PORT || 8000;

//customModules
import userRoutes from "./routes/userRoutes.js"
import errorHandling from "./middlewares/errorHandler.js";

//middlewares
app.use(express.json());
app.use(errorHandling);

//routes
app.use("/user", userRoutes);

//starting server
app.listen(PORT, () => {
    console.log(`Server Started at PORT:${PORT}`)
});