import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const protectRoute = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (!token) {
            console.log("No token found in cookies");
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            where: { userId: decoded.userId },
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            console.log("User not found in database");
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error); // More detailed logging
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};
