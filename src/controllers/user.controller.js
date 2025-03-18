import { Image } from "../models/imageModel.js";
import { User } from "../models/userSchema.js";

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;


        const user = await User.findByPk(userId, {
            attributes: ["fullName", "username", "profilePic", "email"],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        
        const images = await Image.findAll({
            where: { uploaderId: userId },
            attributes: ["id", "imageUrl", "imageTitle", "description", "tags"],
        });

        res.json({
            user,   
            images, 
        });

    } catch (error) {
        console.error("Error fetching user profile and uploads:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
