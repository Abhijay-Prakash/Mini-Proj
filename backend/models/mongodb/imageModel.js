import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        imageTitle: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        imageUrl: {
            type: String,
            required: true,
        },
        uploaderId: {
            type: Number,
            required: true,
        },
        uploaderUsername: {
            type: String, // Store the username of the uploader
            required: true,
        },
        tags: {
            type: [String], // Array of tags for categorization
            default: [],
        },
    },
    { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
