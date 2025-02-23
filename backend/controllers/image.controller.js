import Image from "../models/mongodb/imageModel.js";
import { User } from "../models/postgresql/userSchema.js";
import s3UploadV3 from "../services/s3Service.js";
import dotenv from "dotenv";
import multer from 'multer';
import { sendEmail } from "../services/mailService.js";


// Load environment variables
dotenv.config();


export const postImages = async (req, res) => {
    try {
        const { imageTitle, description } = req.body;
        const userId = req.user.userId;

        // Validate required fields
        if (!imageTitle || !description || !req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                error: "Required fields (imageTitle, description, image) are missing",
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        // Extract image buffer and name
        const imageFile = req.files.image[0];
        const imageBuffer = imageFile.buffer;
        const imageName = imageFile.originalname;

        // Upload to S3
        const { objectUrl: imageUrl } = await s3UploadV3(imageBuffer, imageName);

        // Save image metadata to the database
        const newImage = new Image({
            imageTitle,
            description,
            imageUrl,
            uploaderId: user.userId,
            uploaderUsername: user.username,
        });

        const savedImage = await newImage.save();

        // Respond with success
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

        const images = await Image.find({});

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

export const DownloadImages = async (req, res) => {
    try {

        const { imageId } = req.body;

        const image = await Image.findById(imageId);
        if (!image) return res.status(404).json({ message: "Image not found" });


        await sendEmail(req.user.email, "Your Image Download Link", `Download: ${image.imageUrl}`);

        res.json({ message: "Download link sent to your email" });
    } catch (error) {
        console.error("Error in /download-image route:", error);
        return res.status(500).json({ message: "Server error" });
    }


};