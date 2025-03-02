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
import { Op } from 'sequelize';



dotenv.config();
const app = express();


app.use(
    cors({
      origin: "http://localhost:5173", 
      credentials: true, 
      methods: ["GET", "POST", "PUT", "DELETE"], 
      allowedHeaders: ["Content-Type", "Authorization"], 
    })
  );

  

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 1
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);




const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await connectToMongoDB();
    console.log(`Listening on PORT ${PORT}`);

    (async () => {
        try {

            await sequelize.sync({ alter: true });

            console.log("All models were synchronized successfully.");
        } catch (error) {
            console.error("Error synchronizing models:", error);
        }
    })();
});
