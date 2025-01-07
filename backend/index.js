import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


import connectToMongoDB from './db/connectToMongoDB.js';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/imageRoutes.js";



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await connectToMongoDB();
    console.log(`Listening on port ${PORT}`);
});
