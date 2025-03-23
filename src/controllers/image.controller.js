import { Image } from "../models/imageModel.js"; 
import { User } from "../models/userSchema.js";
import s3UploadV3 from "../services/s3Service.js";

import AWS from "aws-sdk";
import { sendEmail } from "../services/mailService.js";

import dotenv from "dotenv";
dotenv.config();





export const postImages = async (req, res) => {
    try {
        const { imageTitle, description } = req.body;
        const userId = req.user.userId;

        if (!imageTitle || !description || !req.files || !req.files.image || req.files.image.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Required fields (imageTitle, description, image) are missing",
            });
        }

       
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

      
        const imageFile = req.files.image[0];
        const imageBuffer = imageFile.buffer;
        const imageName = imageFile.originalname;

    
        const { objectUrl: imageUrl } = await s3UploadV3(imageBuffer, imageName);


        const savedImage = await Image.create({
            imageTitle,
            description,
            imageUrl,
            uploaderId: user.userId, 
            uploaderUsername: user.username,
        });

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            data: savedImage,
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const getImages = async (req, res) => {
    try {
        const images = await Image.findAll();

        if (!images || images.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No images found",
            });
        }

        res.status(200).json({
            success: true,
            data: images,
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const downloadImages = async (req, res) => {
    try {
        const { imageId } = req.body;

        const image = await Image.findByPk(imageId);
        if (!image) return res.status(404).json({ message: "Image not found" });

        await sendEmail(req.user.email, "Your Image Download Link", `Download: ${image.imageUrl}`);

        res.json({ message: "Download link sent to your email" });
    } catch (error) {
        console.error("Error in /download-image route:", error);
        return res.status(500).json({ message: "Server error" });
    }
};