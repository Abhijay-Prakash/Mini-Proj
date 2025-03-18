import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/imageRoutes.js';
import sequelize from './db/connectToPostgreSQL.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();


const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 3000;



app.listen(PORT, async () => {
    console.log(`Server running on PORT ${PORT}`);

    try {
        await sequelize.authenticate();
        console.log("Connected to PostgreSQL successfully.");

        await sequelize.sync({ alter: true }); // Sync models
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Database connection error:", error);
    }
});
