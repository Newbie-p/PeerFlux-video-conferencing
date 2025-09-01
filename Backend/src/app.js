import express from "express";
import {createServer} from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectToSocket } from "./controllers/SocketManager.js";
import authRoutes from "./routes/users.routes.js"

dotenv.config();
const app = express();
const server = createServer(app);
const io = connectToSocket(server);
const PORT = process.env.PORT||8000;
const uri = process.env.MONGO_URL;

app.use(cors());//It allows your frontend to talk to your backend safely.
app.use(express.json({limit:"40kb"})); //limit: "40kb" ensures someone can’t send huge or malicious JSON payloads to crash your app.
app.use(express.urlencoded({limit:"40kb", extended: true}));//parses URL-encoded form data, like from an HTML <form> submission.

app.use("/api/v1/users", authRoutes);

const start = async()=>{

    server.listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`);
    })
    mongoose.connect(uri);// connects backend to database
    console.log("DB Connected");
};

start();