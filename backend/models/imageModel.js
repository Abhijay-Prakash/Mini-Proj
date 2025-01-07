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
        //        uploader: {
        //           type: mongoose.Schema.Types.ObjectId,
        //            ref: "User", // Reference to the User model
        //            required: true,
        //        },
        //        tags: {
        //            type: [String], // Array of tags for categorization
        //           default: [],
        //        },
        //        isPublic: {
        //            type: Boolean, // Public visibility toggle
        //           default: true,
        //       },
    },
    { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
