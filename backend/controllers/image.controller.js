import Image from "../models/imageModel.js";
import s3UploadV3 from "../utils/s3Service.js";
import dotenv from "dotenv";
import multer from 'multer';

// Load environment variables
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
    { name: "image", maxCount: 1 },
]);



export const postImages = async (req, res) => {
    try {
        const { imageTitle, description } = req.body;

        // Validate required fields
        if (!imageTitle || !description || !req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                error: "Required fields (imageTitle, description, image) are missing",
            });
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
