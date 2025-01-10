import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectToMongoDB from './db/connectToMongoDB.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/imageRoutes.js';
import sequelize from './db/connectToPostgreSQL.js';
import { User } from './models/postgresql/userSchema.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);




const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await connectToMongoDB();  // Ensure MongoDB is connected before starting the server
    console.log(`Listening on port ${PORT}`);
    (async () => {
        try {
            // Sync all models with the database
            await sequelize.sync({ alter: true }); // alter: true updates the table if needed
            console.log("All models were synchronized successfully.");
        } catch (error) {
            console.error("Error synchronizing models:", error);
        }
    })();
});
