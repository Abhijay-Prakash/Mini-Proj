import jwt from "jsonwebtoken";
import { User } from "../models/postgresql/userSchema.js";

export const protectRoute = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;


        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await User.findOne({
            where: { userId: decoded.userId },
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


        req.user = user;

        // this allows the program to move its control to the next middleware/function if present
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

